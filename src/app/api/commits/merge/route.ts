import { NextRequest, NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { mergeSchema } from '@/lib/validation';
import { badRequest, notFound } from '@/lib/errors';
import { PoolClient } from 'pg';
import type { TreeEntry, DiffEntry } from '@/types';

async function resolveTreeAtCommit(
  db: PoolClient,
  commitId: string
): Promise<Map<string, TreeEntry>> {
  const { rows: commitChain } = await db.query(
    `WITH RECURSIVE chain AS (
      SELECT id, parent_commit_id, 0 AS depth
      FROM commits WHERE id = $1
      UNION ALL
      SELECT c.id, c.parent_commit_id, chain.depth + 1
      FROM commits c
      JOIN chain ON chain.parent_commit_id = c.id
    )
    SELECT id FROM chain ORDER BY depth DESC`,
    [commitId]
  );

  const tree = new Map<string, TreeEntry>();
  for (const { id } of commitChain) {
    const { rows: entries } = await db.query(
      `SELECT ca.path, ca.artifact_id, ca.change_type, a.sha256
       FROM commit_artifacts ca
       JOIN artifacts a ON a.id = ca.artifact_id
       WHERE ca.commit_id = $1`,
      [id]
    );
    for (const entry of entries) {
      if (entry.change_type === 'DELETE') {
        tree.delete(entry.path);
      } else {
        tree.set(entry.path, {
          path: entry.path,
          artifact_id: entry.artifact_id,
          sha256: entry.sha256,
        });
      }
    }
  }
  return tree;
}

async function findMergeBase(
  db: PoolClient,
  commitA: string,
  commitB: string
): Promise<string | null> {
  const { rows } = await db.query(
    `WITH RECURSIVE
      chain_a AS (
        SELECT id, parent_commit_id, 0 AS depth FROM commits WHERE id = $1
        UNION ALL
        SELECT c.id, c.parent_commit_id, ca.depth + 1
        FROM commits c JOIN chain_a ca ON ca.parent_commit_id = c.id
      ),
      chain_b AS (
        SELECT id, parent_commit_id, 0 AS depth FROM commits WHERE id = $2
        UNION ALL
        SELECT c.id, c.parent_commit_id, cb.depth + 1
        FROM commits c JOIN chain_b cb ON cb.parent_commit_id = c.id
      )
    SELECT chain_a.id FROM chain_a
    JOIN chain_b ON chain_a.id = chain_b.id
    ORDER BY chain_a.depth ASC
    LIMIT 1`,
    [commitA, commitB]
  );

  return rows.length > 0 ? rows[0].id : null;
}

// POST /api/commits/merge — merge source branch into target branch
export const POST = createHandler({
  roles: ['ADMIN', 'OWNER'],
  audit: { action: 'COMMIT_MERGE', resourceType: 'commit' },
  handler: async (req, ctx) => {
    const body = await req.json();
    const parsed = mergeSchema.safeParse(body);
    if (!parsed.success) {
      throw badRequest(parsed.error.errors[0].message);
    }

    const { sourceBranchId, targetBranchId, message } = parsed.data;

    // Get branch heads
    const { rows: sourceBranches } = await ctx.db.query(
      'SELECT id, head_commit_id, name FROM branches WHERE id = $1',
      [sourceBranchId]
    );
    const { rows: targetBranches } = await ctx.db.query(
      'SELECT id, head_commit_id, name FROM branches WHERE id = $1',
      [targetBranchId]
    );

    if (sourceBranches.length === 0 || targetBranches.length === 0) {
      throw notFound('Source or target branch not found');
    }

    const sourceHead = sourceBranches[0].head_commit_id;
    const targetHead = targetBranches[0].head_commit_id;

    if (!sourceHead) {
      throw badRequest('Source branch has no commits');
    }

    // If target has no commits, fast-forward by just pointing to source head
    if (!targetHead) {
      await ctx.db.query(
        'UPDATE branches SET head_commit_id = $1 WHERE id = $2',
        [sourceHead, targetBranchId]
      );
      return NextResponse.json({
        merge: { type: 'fast-forward', commitId: sourceHead },
      });
    }

    // Find merge base
    const mergeBase = await findMergeBase(ctx.db, sourceHead, targetHead);

    // If target IS the merge base, fast-forward
    if (mergeBase === targetHead) {
      await ctx.db.query(
        'UPDATE branches SET head_commit_id = $1 WHERE id = $2',
        [sourceHead, targetBranchId]
      );
      return NextResponse.json({
        merge: { type: 'fast-forward', commitId: sourceHead },
      });
    }

    // Three-way merge
    const sourceTree = await resolveTreeAtCommit(ctx.db, sourceHead);
    const targetTree = await resolveTreeAtCommit(ctx.db, targetHead);
    const baseTree = mergeBase
      ? await resolveTreeAtCommit(ctx.db, mergeBase)
      : new Map<string, TreeEntry>();

    const allPaths = new Set([...Array.from(sourceTree.keys()), ...Array.from(targetTree.keys()), ...Array.from(baseTree.keys())]);
    const mergedArtifacts: { artifactId: string; path: string; changeType: string; previousArtifactId?: string }[] = [];
    const conflicts: { path: string; source?: TreeEntry; target?: TreeEntry }[] = [];

    for (const path of allPaths) {
      const base = baseTree.get(path);
      const source = sourceTree.get(path);
      const target = targetTree.get(path);

      const sourceChanged = !base ? !!source : (!source || base.sha256 !== source.sha256);
      const targetChanged = !base ? !!target : (!target || base.sha256 !== target.sha256);

      if (sourceChanged && !targetChanged) {
        // Take source
        if (source) {
          mergedArtifacts.push({ artifactId: source.artifact_id, path, changeType: base ? 'UPDATE' : 'ADD', previousArtifactId: base?.artifact_id });
        } else {
          mergedArtifacts.push({ artifactId: base!.artifact_id, path, changeType: 'DELETE' });
        }
      } else if (!sourceChanged && targetChanged) {
        // Keep target (already there, no action needed in merge commit)
      } else if (sourceChanged && targetChanged) {
        if (source?.sha256 === target?.sha256) {
          // Both changed the same way — no conflict
        } else {
          conflicts.push({ path, source, target });
        }
      }
    }

    if (conflicts.length > 0) {
      return NextResponse.json(
        { error: 'Merge conflicts', conflicts },
        { status: 409 }
      );
    }

    // Create merge commit
    const mergeMessage = message || `Merge ${sourceBranches[0].name} into ${targetBranches[0].name}`;
    const { rows: [mergeCommit] } = await ctx.db.query(
      `INSERT INTO commits (workspace_id, branch_id, parent_commit_id, merge_source_commit_id, message, metadata, committed_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [
        ctx.workspaceId, targetBranchId, targetHead, sourceHead,
        mergeMessage,
        JSON.stringify({
          merged_from: {
            source_branch_id: sourceBranchId,
            source_commit_id: sourceHead,
            target_branch_id: targetBranchId,
            target_commit_id: targetHead,
            merge_base_commit_id: mergeBase,
            strategy: 'three-way',
          },
        }),
        ctx.user.sub,
      ]
    );

    // Link merged artifacts to the commit
    for (const art of mergedArtifacts) {
      await ctx.db.query(
        `INSERT INTO commit_artifacts (workspace_id, commit_id, artifact_id, change_type, path, previous_artifact_id)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [ctx.workspaceId, mergeCommit.id, art.artifactId, art.changeType, art.path, art.previousArtifactId || null]
      );
    }

    // Update target branch head
    await ctx.db.query(
      'UPDATE branches SET head_commit_id = $1 WHERE id = $2',
      [mergeCommit.id, targetBranchId]
    );

    return NextResponse.json({
      merge: { type: 'three-way', commitId: mergeCommit.id, commit: mergeCommit },
    });
  },
});
