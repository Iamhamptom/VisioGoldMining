import { Pool } from 'pg';
import { createHash } from 'crypto';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME || 'visiogold_dev',
  user: process.env.DB_ADMIN_USER || 'visiogold_admin',
  password: process.env.DB_ADMIN_PASSWORD || 'admin_password',
});

async function backfill() {
  const client = await pool.connect();

  try {
    const { rows: artifacts } = await client.query(
      `SELECT id, workspace_id, repo_id, branch_id, filename, sha256, metadata_json, created_by
       FROM artifacts
       WHERE type IN ('DATASET', 'DOCUMENT')`
    );

    for (const artifact of artifacts) {
      const dataType = String(artifact.metadata_json?.dataType || 'other');

      const { rows: existingAssets } = await client.query(
        `SELECT id FROM data_assets
         WHERE workspace_id = $1 AND branch_id = $2 AND name = $3 AND source_artifact_id = $4
         LIMIT 1`,
        [artifact.workspace_id, artifact.branch_id, artifact.filename, artifact.id]
      );

      if (existingAssets.length > 0) continue;

      const { rows: assetRows } = await client.query(
        `INSERT INTO data_assets (
          workspace_id, repo_id, branch_id, name, data_type,
          source_artifact_id, metadata, created_by
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING id`,
        [
          artifact.workspace_id,
          artifact.repo_id,
          artifact.branch_id,
          artifact.filename,
          dataType,
          artifact.id,
          JSON.stringify({ backfilled: true }),
          artifact.created_by,
        ]
      );

      const checksum = artifact.sha256 || createHash('sha256').update(String(artifact.id)).digest('hex');

      await client.query(
        `INSERT INTO data_asset_versions (
          workspace_id, data_asset_id, version_number, source_artifact_id,
          parser_version, checksum, normalized_schema, summary_json, raw_metadata, created_by
        ) VALUES ($1,$2,1,$3,'vg-ingest-backfill-1.0',$4,$5,$6,$7,$8)`,
        [
          artifact.workspace_id,
          assetRows[0].id,
          artifact.id,
          checksum,
          JSON.stringify({ format: 'backfilled' }),
          JSON.stringify({ backfilled_from_artifact: artifact.id }),
          JSON.stringify(artifact.metadata_json || {}),
          artifact.created_by,
        ]
      );
    }

    console.log(`Backfilled ${artifacts.length} artifact candidates into data_assets.`);
  } finally {
    client.release();
    await pool.end();
  }
}

backfill().catch((error) => {
  console.error('Backfill failed:', error);
  process.exit(1);
});
