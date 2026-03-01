import { NextRequest, NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { notFound } from '@/lib/errors';

// GET /api/commits/:commitId
export const GET = createHandler({
  handler: async (_req, ctx) => {
    const { rows: commits } = await ctx.db.query(
      `SELECT c.*, u.display_name as committed_by_name
       FROM commits c
       LEFT JOIN users u ON u.id = c.committed_by
       WHERE c.id = $1`,
      [ctx.params.commitId]
    );

    if (commits.length === 0) {
      throw notFound('Commit not found');
    }

    // Get linked artifacts
    const { rows: commitArtifacts } = await ctx.db.query(
      `SELECT ca.*, a.title, a.filename, a.type, a.sha256, a.size_bytes
       FROM commit_artifacts ca
       JOIN artifacts a ON a.id = ca.artifact_id
       WHERE ca.commit_id = $1
       ORDER BY ca.path`,
      [ctx.params.commitId]
    );

    return NextResponse.json({
      commit: commits[0],
      artifacts: commitArtifacts,
    });
  },
});
