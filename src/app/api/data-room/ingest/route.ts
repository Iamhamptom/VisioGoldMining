import { NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { MOCK_MODE } from '@/lib/db';
import { badRequest } from '@/lib/errors';
import { storeFile } from '@/lib/storage';
import { sha256 } from '@/lib/hash';
import { normalizeAsset } from '@/lib/data-room/normalizers';
import { enqueueIngestionJob } from '@/lib/queue/bullmq';
import type { ArtifactType } from '@/types';
import { getMockMiningState, mockId, nowIso } from '@/lib/mock-mining-store';

const MAX_UPLOAD_SIZE = 100 * 1024 * 1024; // 100MB

const DATA_TYPE_TO_ARTIFACT: Record<string, ArtifactType> = {
  pdf: 'DOCUMENT',
  csv: 'DATASET',
  geojson: 'DATASET',
  shp: 'DATASET',
  assay_table: 'DATASET',
  drillhole_table: 'DATASET',
  geophysics_grid: 'DATASET',
  image: 'DOCUMENT',
  other: 'DOCUMENT',
};

export const POST = createHandler({
  roles: ['ANALYST', 'ADMIN', 'OWNER'],
  audit: { action: 'DATA_INGEST', resourceType: 'data_asset' },
  handler: async (req, ctx) => {
    const form = await req.formData();
    const branchId = String(form.get('branchId') || '');
    const repoIdFromForm = String(form.get('repoId') || '');
    const dataType = String(form.get('dataType') || 'other');
    const country = String(form.get('country') || 'DRC');
    const site = String(form.get('site') || '');
    const project = String(form.get('project') || '');
    const tagsRaw = String(form.get('tags') || '');
    const tags = tagsRaw.split(',').map((t) => t.trim()).filter(Boolean);

    if (!branchId) throw badRequest('branchId is required');

    const files = form.getAll('files') as File[];
    const singleFile = form.get('file') as File | null;
    const uploadFiles = files.length > 0 ? files : singleFile ? [singleFile] : [];

    if (uploadFiles.length === 0) throw badRequest('At least one file is required');

    let repoId = repoIdFromForm || '00000000-0000-4000-8000-000000000010';

    const results: Array<Record<string, unknown>> = [];

    if (MOCK_MODE) {
      const state = getMockMiningState();
      for (const file of uploadFiles) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const normalization = normalizeAsset(buffer, file.name, dataType);
        const now = nowIso();
        const dataAssetId = mockId('asset');
        const dataAssetVersionId = mockId('asset_version');
        const ingestionJobId = mockId('ingest_job');

        state.dataAssets.unshift({
          id: dataAssetId,
          workspace_id: ctx.workspaceId,
          repo_id: repoId,
          branch_id: branchId,
          name: file.name,
          data_type: dataType,
          country: country || null,
          site: site || null,
          project: project || null,
          status: 'active',
          tags,
          metadata: { source: 'mock', file_size: buffer.length },
          created_at: now,
          updated_at: now,
        });

        state.dataAssetVersions.unshift({
          id: dataAssetVersionId,
          workspace_id: ctx.workspaceId,
          data_asset_id: dataAssetId,
          version_number: 1,
          parser_version: normalization.parserVersion,
          checksum: normalization.checksum,
          normalized_schema: normalization.normalizedSchema,
          summary_json: normalization.summary,
          raw_metadata: { filename: file.name, mime: file.type },
          created_at: now,
        });

        state.ingestionJobs.unshift({
          id: ingestionJobId,
          workspace_id: ctx.workspaceId,
          repo_id: repoId,
          branch_id: branchId,
          data_asset_id: dataAssetId,
          data_asset_version_id: dataAssetVersionId,
          status: normalization.status === 'completed' ? 'completed' : 'needs_review',
          input_json: { file: file.name, dataType },
          output_json: normalization.summary,
          error_message: null,
          retry_count: 0,
          queue_job_id: null,
          created_at: now,
          started_at: now,
          completed_at: now,
        });

        results.push({
          artifact: {
            id: mockId('artifact'),
            filename: file.name,
            title: file.name,
            type: DATA_TYPE_TO_ARTIFACT[dataType] || 'DOCUMENT',
            size_bytes: buffer.length,
          },
          data_asset_id: dataAssetId,
          data_asset_version_id: dataAssetVersionId,
          ingestion_job_id: ingestionJobId,
          queue_job_id: null,
        });
      }

      return NextResponse.json({ results }, { status: 201 });
    }

    const { rows: branchRows } = await ctx.db.query(
      'SELECT id, repo_id FROM branches WHERE id = $1 AND workspace_id = $2',
      [branchId, ctx.workspaceId]
    );
    if (branchRows.length === 0) throw badRequest('Branch not found');
    repoId = branchRows[0].repo_id as string;

    for (const file of uploadFiles) {
      const buffer = Buffer.from(await file.arrayBuffer());
      if (buffer.length > MAX_UPLOAD_SIZE) {
        throw badRequest(`File ${file.name} exceeds maximum upload size of ${MAX_UPLOAD_SIZE / (1024 * 1024)} MB`);
      }

      const fileHash = sha256(buffer);
      const storagePath = await storeFile(ctx.workspaceId, repoId, buffer, file.name);

      const artifactType = DATA_TYPE_TO_ARTIFACT[dataType] || 'DOCUMENT';
      const { rows: artifactRows } = await ctx.db.query(
        `INSERT INTO artifacts (
          workspace_id, repo_id, branch_id, type, title, filename, mime_type,
          size_bytes, sha256, storage_path, metadata_json, created_by
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
        ) RETURNING *`,
        [
          ctx.workspaceId,
          repoId,
          branchId,
          artifactType,
          file.name,
          file.name,
          file.type || 'application/octet-stream',
          buffer.length,
          fileHash,
          storagePath,
          JSON.stringify({ source: 'data-room-ingest', dataType, country, site, project, tags }),
          ctx.user.sub,
        ]
      );
      const artifact = artifactRows[0];

      const { rows: assetRows } = await ctx.db.query(
        `SELECT * FROM data_assets
         WHERE workspace_id = $1 AND branch_id = $2 AND name = $3 AND data_type = $4
         ORDER BY created_at DESC LIMIT 1`,
        [ctx.workspaceId, branchId, file.name, dataType]
      );

      let dataAssetId = assetRows[0]?.id as string | undefined;
      if (!dataAssetId) {
        const { rows } = await ctx.db.query(
          `INSERT INTO data_assets (
            workspace_id, repo_id, branch_id, name, data_type, country, site, project,
            source_artifact_id, tags, metadata, created_by
          ) VALUES (
            $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12
          ) RETURNING id`,
          [
            ctx.workspaceId,
            repoId,
            branchId,
            file.name,
            dataType,
            country || null,
            site || null,
            project || null,
            artifact.id,
            tags,
            JSON.stringify({ latest_artifact_id: artifact.id }),
            ctx.user.sub,
          ]
        );
        dataAssetId = rows[0].id as string;
      }

      const { rows: versionRows } = await ctx.db.query(
        'SELECT COALESCE(MAX(version_number), 0) AS max_version FROM data_asset_versions WHERE data_asset_id = $1',
        [dataAssetId]
      );
      const nextVersion = Number(versionRows[0].max_version || 0) + 1;

      const normalization = normalizeAsset(buffer, file.name, dataType);

      const { rows: davRows } = await ctx.db.query(
        `INSERT INTO data_asset_versions (
          workspace_id, data_asset_id, version_number, source_artifact_id, parser_version,
          checksum, normalized_schema, summary_json, raw_metadata, created_by
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10
        ) RETURNING *`,
        [
          ctx.workspaceId,
          dataAssetId,
          nextVersion,
          artifact.id,
          normalization.parserVersion,
          normalization.checksum,
          JSON.stringify(normalization.normalizedSchema),
          JSON.stringify(normalization.summary),
          JSON.stringify({ filename: file.name, mime: file.type, size: buffer.length }),
          ctx.user.sub,
        ]
      );
      const dataAssetVersion = davRows[0];

      const { rows: jobRows } = await ctx.db.query(
        `INSERT INTO ingestion_jobs (
          workspace_id, repo_id, branch_id, data_asset_id, data_asset_version_id,
          status, input_json, created_by
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8
        ) RETURNING *`,
        [
          ctx.workspaceId,
          repoId,
          branchId,
          dataAssetId,
          dataAssetVersion.id,
          'queued',
          JSON.stringify({ file: file.name, dataType, artifact_id: artifact.id }),
          ctx.user.sub,
        ]
      );
      const job = jobRows[0];

      await ctx.db.query(
        `INSERT INTO provenance_events (
          workspace_id, repo_id, branch_id, data_asset_id, data_asset_version_id,
          ingestion_job_id, event_type, details, created_by
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9
        )`,
        [
          ctx.workspaceId,
          repoId,
          branchId,
          dataAssetId,
          dataAssetVersion.id,
          job.id,
          'ingest_requested',
          JSON.stringify({ file: file.name, dataType }),
          ctx.user.sub,
        ]
      );

      const queueJobId = await enqueueIngestionJob({
        ingestion_job_id: job.id,
        workspace_id: ctx.workspaceId,
        repo_id: repoId,
        branch_id: branchId,
        data_asset_id: dataAssetId,
        data_asset_version_id: dataAssetVersion.id,
      });

      if (queueJobId) {
        await ctx.db.query('UPDATE ingestion_jobs SET queue_job_id = $1 WHERE id = $2', [queueJobId, job.id]);
      } else {
        const finalStatus = normalization.status === 'completed' ? 'completed' : 'needs_review';
        await ctx.db.query(
          `UPDATE ingestion_jobs
           SET status = $1, started_at = NOW(), completed_at = NOW(), output_json = $2
           WHERE id = $3`,
          [finalStatus, JSON.stringify(normalization.summary), job.id]
        );

        await ctx.db.query(
          `INSERT INTO provenance_events (
            workspace_id, repo_id, branch_id, data_asset_id, data_asset_version_id,
            ingestion_job_id, event_type, details, created_by
          ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [
            ctx.workspaceId,
            repoId,
            branchId,
            dataAssetId,
            dataAssetVersion.id,
            job.id,
            finalStatus === 'completed' ? 'ingest_completed' : 'manual_review',
            JSON.stringify({ summary: normalization.summary }),
            ctx.user.sub,
          ]
        );
      }

      results.push({
        artifact,
        data_asset_id: dataAssetId,
        data_asset_version_id: dataAssetVersion.id,
        ingestion_job_id: job.id,
        queue_job_id: queueJobId,
      });
    }

    return NextResponse.json({ results }, { status: 201 });
  },
});
