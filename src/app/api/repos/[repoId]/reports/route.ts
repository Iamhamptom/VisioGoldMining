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
      const reportJobs = getMockMiningState().reportJobs.filter(
        (job) => job.workspace_id === ctx.workspaceId && job.repo_id === ctx.params.repoId && job.branch_id === branchId
      );
      return NextResponse.json({ report_jobs: reportJobs });
    }

    const { rows } = await ctx.db.query(
      `SELECT * FROM report_jobs
       WHERE workspace_id = $1 AND repo_id = $2 AND branch_id = $3
       ORDER BY created_at DESC`,
      [ctx.workspaceId, ctx.params.repoId, branchId]
    );

    return NextResponse.json({ report_jobs: rows });
  },
});
