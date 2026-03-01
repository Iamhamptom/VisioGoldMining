-- Migration 004: Commits, Artifacts, Commit-Artifacts junction

CREATE TABLE commits (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id            UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  branch_id               UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  parent_commit_id        UUID REFERENCES commits(id),
  merge_source_commit_id  UUID REFERENCES commits(id),
  message                 TEXT NOT NULL,
  metadata                JSONB DEFAULT '{}',
  committed_by            UUID NOT NULL REFERENCES users(id),
  committed_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_commits_branch ON commits(branch_id);
CREATE INDEX idx_commits_workspace ON commits(workspace_id);
CREATE INDEX idx_commits_parent ON commits(parent_commit_id);

-- Add FK for branches.head_commit_id now that commits table exists
ALTER TABLE branches ADD CONSTRAINT fk_branches_head_commit
  FOREIGN KEY (head_commit_id) REFERENCES commits(id) DEFERRABLE INITIALLY DEFERRED;

CREATE TABLE artifacts (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id      UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  repo_id           UUID NOT NULL REFERENCES repos(id) ON DELETE CASCADE,
  branch_id         UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  type              VARCHAR(30) NOT NULL CHECK (type IN (
                      'DOCUMENT', 'DATASET', 'PLAN', 'SIMULATION',
                      'TASKS', 'NOTE', 'RISK_REGISTER', 'VENDOR_REPORT'
                    )),
  title             VARCHAR(500) NOT NULL,
  filename          VARCHAR(500) NOT NULL,
  mime_type         VARCHAR(255),
  size_bytes        BIGINT NOT NULL,
  sha256            VARCHAR(64) NOT NULL,
  storage_path      VARCHAR(1000) NOT NULL,
  encrypted_dek     BYTEA,
  encryption_key_id UUID,
  metadata_json     JSONB DEFAULT '{}',
  created_by        UUID NOT NULL REFERENCES users(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_artifacts_workspace ON artifacts(workspace_id);
CREATE INDEX idx_artifacts_repo ON artifacts(repo_id);
CREATE INDEX idx_artifacts_branch ON artifacts(branch_id);
CREATE INDEX idx_artifacts_sha256 ON artifacts(sha256);

CREATE TABLE commit_artifacts (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id          UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  commit_id             UUID NOT NULL REFERENCES commits(id) ON DELETE CASCADE,
  artifact_id           UUID NOT NULL REFERENCES artifacts(id),
  change_type           VARCHAR(10) NOT NULL CHECK (change_type IN ('ADD', 'UPDATE', 'DELETE')),
  path                  VARCHAR(1000) NOT NULL,
  previous_artifact_id  UUID REFERENCES artifacts(id),
  UNIQUE(commit_id, path)
);

CREATE INDEX idx_commit_artifacts_commit ON commit_artifacts(commit_id);
CREATE INDEX idx_commit_artifacts_workspace ON commit_artifacts(workspace_id);

-- Commits and artifacts are immutable: SELECT + INSERT only
GRANT SELECT, INSERT ON commits TO visiogold_app;
GRANT SELECT, INSERT ON artifacts TO visiogold_app;
GRANT SELECT, INSERT ON commit_artifacts TO visiogold_app;
