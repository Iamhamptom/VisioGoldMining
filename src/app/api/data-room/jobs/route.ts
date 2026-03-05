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
      const jobs = state.ingestionJobs
        .filter((job) => job.workspace_id === ctx.workspaceId && job.branch_id === branchId)
        .map((job) => {
          const asset = state.dataAssets.find((entry) => entry.id === job.data_asset_id);
          const version = state.dataAssetVersions.find((entry) => entry.id === job.data_asset_version_id);
          return {
            ...job,
            asset_name: asset?.name || null,
            version_number: version?.version_number || null,
          };
        });

      return NextResponse.json({ jobs });
    }

    const { rows } = await ctx.db.query(
      `SELECT j.*, a.name as asset_name, v.version_number
       FROM ingestion_jobs j
       JOIN data_assets a ON a.id = j.data_asset_id
       LEFT JOIN data_asset_versions v ON v.id = j.data_asset_version_id
       WHERE j.workspace_id = $1 AND j.branch_id = $2
       ORDER BY j.created_at DESC
       LIMIT 300`,
      [ctx.workspaceId, branchId]
    );

    return NextResponse.json({ jobs: rows });
  },
});
