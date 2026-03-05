import { NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { MOCK_MODE } from '@/lib/db';
import { badRequest } from '@/lib/errors';
import { getMockMiningState } from '@/lib/mock-mining-store';

export const GET = createHandler({
  roles: ['VIEWER', 'ANALYST', 'ADMIN', 'OWNER'],
  handler: async (req, ctx) => {
    const url = new URL(req.url);
    const branchId = url.searchParams.get('branchId');
    if (!branchId) throw badRequest('branchId is required');

    if (MOCK_MODE) {
      const state = getMockMiningState();
      const targets = state.drillTargets
        .filter((target) => target.workspace_id === ctx.workspaceId && target.repo_id === ctx.params.repoId && target.branch_id === branchId)
        .sort((a, b) => a.rank - b.rank);
      const scoreRun = state.targetScoreRuns
        .filter((run) => run.workspace_id === ctx.workspaceId && run.repo_id === ctx.params.repoId && run.branch_id === branchId)
        .sort((a, b) => b.created_at.localeCompare(a.created_at))[0] || null;

      return NextResponse.json({ score_run: scoreRun, targets });
    }

    const { rows } = await ctx.db.query(
      `SELECT t.*
       FROM drill_targets t
       WHERE t.workspace_id = $1
         AND t.repo_id = $2
         AND t.branch_id = $3
       ORDER BY t.rank ASC, t.created_at DESC`,
      [ctx.workspaceId, ctx.params.repoId, branchId]
    );

    const { rows: runRows } = await ctx.db.query(
      `SELECT * FROM target_score_runs
       WHERE workspace_id = $1 AND repo_id = $2 AND branch_id = $3
       ORDER BY created_at DESC LIMIT 1`,
      [ctx.workspaceId, ctx.params.repoId, branchId]
    );

    return NextResponse.json({
      score_run: runRows[0] || null,
      targets: rows,
    });
  },
});
