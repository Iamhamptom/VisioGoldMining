import { NextRequest, NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { diffSchema } from '@/lib/validation';
import { badRequest } from '@/lib/errors';
import { PoolClient } from 'pg';
import type { TreeEntry, DiffEntry } from '@/types';

/**
 * Resolve the full file tree at a given commit by walking the commit chain.
 */
async function resolveTreeAtCommit(
  db: PoolClient,
  commitId: string
): Promise<Map<string, TreeEntry>> {
  // Get commit chain from root to this commit using recursive CTE
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

// POST /api/commits/diff — diff between two commits
export const POST = createHandler({
  handler: async (req, ctx) => {
    const body = await req.json();
    const parsed = diffSchema.safeParse(body);
    if (!parsed.success) {
      throw badRequest(parsed.error.errors[0].message);
    }

    const { fromCommitId, toCommitId } = parsed.data;

    const fromTree = await resolveTreeAtCommit(ctx.db, fromCommitId);
    const toTree = await resolveTreeAtCommit(ctx.db, toCommitId);

    const diff: DiffEntry[] = [];
    const allPaths = new Set([...Array.from(fromTree.keys()), ...Array.from(toTree.keys())]);

    for (const path of allPaths) {
      const from = fromTree.get(path);
      const to = toTree.get(path);

      if (!from && to) {
        diff.push({
          path,
          status: 'added',
          new_artifact_id: to.artifact_id,
          new_sha256: to.sha256,
        });
      } else if (from && !to) {
        diff.push({
          path,
          status: 'deleted',
          old_artifact_id: from.artifact_id,
          old_sha256: from.sha256,
        });
      } else if (from && to && from.sha256 !== to.sha256) {
        diff.push({
          path,
          status: 'modified',
          old_artifact_id: from.artifact_id,
          old_sha256: from.sha256,
          new_artifact_id: to.artifact_id,
          new_sha256: to.sha256,
        });
      }
    }

    return NextResponse.json({ diff });
  },
});

