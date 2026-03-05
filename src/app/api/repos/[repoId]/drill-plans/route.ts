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
      const drillPlans = getMockMiningState().drillPlans
        .filter((plan) => plan.workspace_id === ctx.workspaceId && plan.repo_id === ctx.params.repoId && plan.branch_id === branchId)
        .sort((a, b) => b.created_at.localeCompare(a.created_at));
      return NextResponse.json({ drill_plans: drillPlans });
    }

    const { rows } = await ctx.db.query(
      `SELECT * FROM drill_plans
       WHERE workspace_id = $1 AND repo_id = $2 AND branch_id = $3
       ORDER BY created_at DESC`,
      [ctx.workspaceId, ctx.params.repoId, branchId]
    );

    return NextResponse.json({ drill_plans: rows });
  },
});
