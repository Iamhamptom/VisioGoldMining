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
      const assets = state.dataAssets
        .filter((asset) => asset.workspace_id === ctx.workspaceId && asset.branch_id === branchId)
        .map((asset) => {
          const latestVersion = state.dataAssetVersions
            .filter((version) => version.data_asset_id === asset.id)
            .sort((a, b) => b.version_number - a.version_number)[0];
          const latestJob = state.ingestionJobs
            .filter((job) => job.data_asset_id === asset.id)
            .sort((a, b) => b.created_at.localeCompare(a.created_at))[0];

          return {
            ...asset,
            latest_version_id: latestVersion?.id || null,
            latest_version_number: latestVersion?.version_number || null,
            latest_summary: latestVersion?.summary_json || null,
            latest_schema: latestVersion?.normalized_schema || null,
            latest_job_id: latestJob?.id || null,
            latest_job_status: latestJob?.status || null,
            latest_job_created_at: latestJob?.created_at || null,
          };
        });

      return NextResponse.json({ assets });
    }

    const { rows } = await ctx.db.query(
      `SELECT
        a.*,
        dav.id AS latest_version_id,
        dav.version_number AS latest_version_number,
        dav.summary_json AS latest_summary,
        dav.normalized_schema AS latest_schema,
        ij.id AS latest_job_id,
        ij.status AS latest_job_status,
        ij.created_at AS latest_job_created_at
      FROM data_assets a
      LEFT JOIN LATERAL (
        SELECT * FROM data_asset_versions v
        WHERE v.data_asset_id = a.id
        ORDER BY v.version_number DESC
        LIMIT 1
      ) dav ON true
      LEFT JOIN LATERAL (
        SELECT * FROM ingestion_jobs j
        WHERE j.data_asset_id = a.id
        ORDER BY j.created_at DESC
        LIMIT 1
      ) ij ON true
      WHERE a.workspace_id = $1 AND a.branch_id = $2
      ORDER BY a.updated_at DESC`,
      [ctx.workspaceId, branchId]
    );

    return NextResponse.json({ assets: rows });
  },
});
