import { NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { MOCK_MODE } from '@/lib/db';
import { badRequest } from '@/lib/errors';
import { getMockMiningState } from '@/lib/mock-mining-store';

export const GET = createHandler({
  roles: ['VIEWER', 'ANALYST', 'ADMIN', 'OWNER'],
  handler: async (_req, ctx) => {
    const reportId = ctx.params.reportId;

    if (MOCK_MODE) {
      const state = getMockMiningState();
      const report = state.reports.find((item) => item.id === reportId && item.workspace_id === ctx.workspaceId);
      if (!report) throw badRequest('Report not found');

      const job = state.reportJobs.find((item) => item.id === report.report_job_id && item.workspace_id === ctx.workspaceId) || null;
      return NextResponse.json({
        report,
        job,
        download_url: report.artifact_id ? `/api/artifacts/${report.artifact_id}?download=true` : null,
      });
    }

    const { rows: reportRows } = await ctx.db.query(
      `SELECT r.*, a.filename AS artifact_filename
       FROM reports r
       LEFT JOIN artifacts a ON a.id = r.artifact_id
       WHERE r.id = $1 AND r.workspace_id = $2`,
      [reportId, ctx.workspaceId]
    );

    if (reportRows.length === 0) throw badRequest('Report not found');

    const report = reportRows[0];
    const { rows: jobRows } = await ctx.db.query(
      'SELECT * FROM report_jobs WHERE id = $1 AND workspace_id = $2',
      [report.report_job_id, ctx.workspaceId]
    );

    return NextResponse.json({
      report,
      job: jobRows[0] || null,
      download_url: report.artifact_id ? `/api/artifacts/${report.artifact_id}?download=true` : null,
    });
  },
});
