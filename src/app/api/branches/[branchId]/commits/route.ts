import { NextRequest, NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { createCommitSchema } from '@/lib/validation';
import { badRequest } from '@/lib/errors';

// GET /api/branches/:branchId/commits
export const GET = createHandler({
  handler: async (_req, ctx) => {
    const { rows } = await ctx.db.query(
      `SELECT c.*, u.display_name as committed_by_name
       FROM commits c
       LEFT JOIN users u ON u.id = c.committed_by
       WHERE c.branch_id = $1
       ORDER BY c.committed_at DESC`,
      [ctx.params.branchId]
    );

    return NextResponse.json({ commits: rows });
  },
});

// POST /api/branches/:branchId/commits — create a commit
export const POST = createHandler({
  roles: ['ANALYST', 'ADMIN', 'OWNER'],
  audit: { action: 'COMMIT_CREATE', resourceType: 'commit' },
  handler: async (req, ctx) => {
    const body = await req.json();
    const parsed = createCommitSchema.safeParse(body);
    if (!parsed.success) {
      throw badRequest(parsed.error.errors[0].message);
    }

    const { message, artifacts } = parsed.data;

    // Get current head commit of this branch
    const { rows: branchRows } = await ctx.db.query(
      'SELECT head_commit_id FROM branches WHERE id = $1',
      [ctx.params.branchId]
    );

    const parentCommitId = branchRows[0]?.head_commit_id || null;

    // Create the commit
    const { rows: [commit] } = await ctx.db.query(
      `INSERT INTO commits (workspace_id, branch_id, parent_commit_id, message, committed_by)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [ctx.workspaceId, ctx.params.branchId, parentCommitId, message, ctx.user.sub]
    );

    // Link artifacts to the commit
    for (const art of artifacts) {
      await ctx.db.query(
        `INSERT INTO commit_artifacts (workspace_id, commit_id, artifact_id, change_type, path, previous_artifact_id)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [ctx.workspaceId, commit.id, art.artifactId, art.changeType, art.path, art.previousArtifactId || null]
      );
    }

    // Update branch head
    await ctx.db.query(
      'UPDATE branches SET head_commit_id = $1 WHERE id = $2',
      [commit.id, ctx.params.branchId]
    );

    return NextResponse.json({ commit }, { status: 201 });
  },
});
