-- Migration 021: Exploration decision logs

CREATE TABLE decision_logs (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id          UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  repo_id               UUID NOT NULL REFERENCES repos(id) ON DELETE CASCADE,
  branch_id             UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  recommendation        VARCHAR(20) NOT NULL CHECK (recommendation IN ('STOP', 'CONTINUE', 'PIVOT')),
  reasons               TEXT[] NOT NULL DEFAULT '{}',
  metrics               JSONB NOT NULL DEFAULT '{}',
  notes                 TEXT,
  decided_by            UUID NOT NULL REFERENCES users(id),
  decided_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_decision_logs_workspace ON decision_logs(workspace_id);
CREATE INDEX idx_decision_logs_branch ON decision_logs(branch_id, decided_at DESC);

GRANT SELECT, INSERT ON decision_logs TO visiogold_app;
