import { NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { MOCK_MODE } from '@/lib/db';
import { badRequest } from '@/lib/errors';
import { enqueueIngestionJob } from '@/lib/queue/bullmq';
import { getMockMiningState, nowIso } from '@/lib/mock-mining-store';

export const POST = createHandler({
  roles: ['ANALYST', 'ADMIN', 'OWNER'],
  audit: { action: 'DATA_INGEST', resourceType: 'ingestion_job' },
  handler: async (req, ctx) => {
    const body = await req.json();
    const jobId = body.job_id as string | undefined;
    if (!jobId) throw badRequest('job_id is required');

    if (MOCK_MODE) {
      const state = getMockMiningState();
      const job = state.ingestionJobs.find((entry) => entry.id === jobId && entry.workspace_id === ctx.workspaceId);
      if (!job) throw badRequest('Job not found');

      job.status = 'queued';
      job.error_message = null;
      job.retry_count += 1;
      job.queue_job_id = null;
      job.started_at = nowIso();
      job.completed_at = nowIso();
      job.status = 'completed';

      return NextResponse.json({ ok: true, queue_job_id: null });
    }

    const { rows } = await ctx.db.query(
      'SELECT * FROM ingestion_jobs WHERE id = $1 AND workspace_id = $2',
      [jobId, ctx.workspaceId]
    );

    if (rows.length === 0) throw badRequest('Job not found');
    const job = rows[0];

    const queueJobId = await enqueueIngestionJob({
      ingestion_job_id: job.id,
      workspace_id: job.workspace_id,
      repo_id: job.repo_id,
      branch_id: job.branch_id,
      data_asset_id: job.data_asset_id,
      data_asset_version_id: job.data_asset_version_id,
      retry: true,
    });

    await ctx.db.query(
      `UPDATE ingestion_jobs
       SET status = 'queued', error_message = NULL, retry_count = retry_count + 1, queue_job_id = $1
       WHERE id = $2`,
      [queueJobId, job.id]
    );

    await ctx.db.query(
      `INSERT INTO provenance_events (
        workspace_id, repo_id, branch_id, data_asset_id, data_asset_version_id,
        ingestion_job_id, event_type, details, created_by
      ) VALUES ($1,$2,$3,$4,$5,$6,'retry_requested',$7,$8)`,
      [
        ctx.workspaceId,
        job.repo_id,
        job.branch_id,
        job.data_asset_id,
        job.data_asset_version_id,
        job.id,
        JSON.stringify({ queue_job_id: queueJobId }),
        ctx.user.sub,
      ]
    );

    return NextResponse.json({ ok: true, queue_job_id: queueJobId });
  },
});
