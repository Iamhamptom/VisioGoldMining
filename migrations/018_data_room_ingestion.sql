-- Migration 018: Data Room + ingestion provenance tables

CREATE TABLE data_assets (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id      UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  repo_id           UUID NOT NULL REFERENCES repos(id) ON DELETE CASCADE,
  branch_id         UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  name              VARCHAR(500) NOT NULL,
  data_type         VARCHAR(50) NOT NULL CHECK (data_type IN (
                      'pdf', 'csv', 'geojson', 'shp', 'assay_table',
                      'drillhole_table', 'geophysics_grid', 'image', 'other'
                    )),
  country           VARCHAR(100),
  site              VARCHAR(255),
  project           VARCHAR(255),
  source_artifact_id UUID REFERENCES artifacts(id),
  status            VARCHAR(30) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
  tags              TEXT[] NOT NULL DEFAULT '{}',
  metadata          JSONB NOT NULL DEFAULT '{}',
  created_by        UUID NOT NULL REFERENCES users(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_data_assets_workspace ON data_assets(workspace_id);
CREATE INDEX idx_data_assets_repo_branch ON data_assets(repo_id, branch_id);
CREATE INDEX idx_data_assets_type ON data_assets(data_type);

CREATE TABLE data_asset_versions (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id       UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  data_asset_id      UUID NOT NULL REFERENCES data_assets(id) ON DELETE CASCADE,
  version_number     INTEGER NOT NULL,
  source_artifact_id UUID REFERENCES artifacts(id),
  parser_version     VARCHAR(100) NOT NULL DEFAULT 'vg-ingest-1.0',
  checksum           VARCHAR(64) NOT NULL,
  normalized_schema  JSONB NOT NULL DEFAULT '{}',
  summary_json       JSONB NOT NULL DEFAULT '{}',
  raw_metadata       JSONB NOT NULL DEFAULT '{}',
  created_by         UUID NOT NULL REFERENCES users(id),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(data_asset_id, version_number)
);

CREATE INDEX idx_data_asset_versions_workspace ON data_asset_versions(workspace_id);
CREATE INDEX idx_data_asset_versions_asset ON data_asset_versions(data_asset_id, version_number DESC);

CREATE TABLE ingestion_jobs (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id          UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  repo_id               UUID NOT NULL REFERENCES repos(id) ON DELETE CASCADE,
  branch_id             UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  data_asset_id         UUID NOT NULL REFERENCES data_assets(id) ON DELETE CASCADE,
  data_asset_version_id UUID REFERENCES data_asset_versions(id) ON DELETE SET NULL,
  queue_job_id          VARCHAR(255),
  status                VARCHAR(30) NOT NULL CHECK (status IN ('queued', 'running', 'completed', 'failed', 'needs_review')),
  input_json            JSONB NOT NULL DEFAULT '{}',
  output_json           JSONB NOT NULL DEFAULT '{}',
  error_message         TEXT,
  retry_count           INTEGER NOT NULL DEFAULT 0,
  started_at            TIMESTAMPTZ,
  completed_at          TIMESTAMPTZ,
  created_by            UUID NOT NULL REFERENCES users(id),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ingestion_jobs_workspace ON ingestion_jobs(workspace_id);
CREATE INDEX idx_ingestion_jobs_branch ON ingestion_jobs(branch_id, created_at DESC);
CREATE INDEX idx_ingestion_jobs_status ON ingestion_jobs(status);

CREATE TABLE provenance_events (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id          UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  repo_id               UUID NOT NULL REFERENCES repos(id) ON DELETE CASCADE,
  branch_id             UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  data_asset_id         UUID REFERENCES data_assets(id) ON DELETE CASCADE,
  data_asset_version_id UUID REFERENCES data_asset_versions(id) ON DELETE CASCADE,
  ingestion_job_id      UUID REFERENCES ingestion_jobs(id) ON DELETE SET NULL,
  event_type            VARCHAR(50) NOT NULL CHECK (event_type IN (
                        'ingest_requested', 'ingest_started', 'ingest_completed',
                        'ingest_failed', 'manual_review', 'retry_requested', 'lineage_linked'
                      )),
  details               JSONB NOT NULL DEFAULT '{}',
  created_by            UUID REFERENCES users(id),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_provenance_events_workspace ON provenance_events(workspace_id);
CREATE INDEX idx_provenance_events_asset ON provenance_events(data_asset_id, created_at DESC);
CREATE INDEX idx_provenance_events_job ON provenance_events(ingestion_job_id);

GRANT SELECT, INSERT, UPDATE ON data_assets TO visiogold_app;
GRANT SELECT, INSERT, UPDATE ON data_asset_versions TO visiogold_app;
GRANT SELECT, INSERT, UPDATE ON ingestion_jobs TO visiogold_app;
GRANT SELECT, INSERT ON provenance_events TO visiogold_app;
