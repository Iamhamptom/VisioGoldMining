-- Migration 019: Target scoring + drill planning

CREATE TABLE target_score_runs (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id          UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  repo_id               UUID NOT NULL REFERENCES repos(id) ON DELETE CASCADE,
  branch_id             UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  name                  VARCHAR(255) NOT NULL,
  scoring_model_version VARCHAR(100) NOT NULL DEFAULT 'vg-target-1.0',
  seed                  INTEGER,
  status                VARCHAR(30) NOT NULL DEFAULT 'completed' CHECK (status IN ('queued', 'running', 'completed', 'failed')),
  input_snapshot        JSONB NOT NULL DEFAULT '{}',
  output_summary        JSONB NOT NULL DEFAULT '{}',
  created_by            UUID NOT NULL REFERENCES users(id),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_target_score_runs_workspace ON target_score_runs(workspace_id);
CREATE INDEX idx_target_score_runs_branch ON target_score_runs(branch_id, created_at DESC);

CREATE TABLE drill_targets (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id          UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  repo_id               UUID NOT NULL REFERENCES repos(id) ON DELETE CASCADE,
  branch_id             UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  score_run_id          UUID NOT NULL REFERENCES target_score_runs(id) ON DELETE CASCADE,
  external_target_id    VARCHAR(255),
  name                  VARCHAR(500) NOT NULL,
  rank                  INTEGER NOT NULL,
  confidence_score      NUMERIC(5,2) NOT NULL,
  data_completeness     NUMERIC(5,2) NOT NULL,
  latitude              DOUBLE PRECISION,
  longitude             DOUBLE PRECISION,
  geojson               JSONB,
  reason_codes          TEXT[] NOT NULL DEFAULT '{}',
  risk_flags            TEXT[] NOT NULL DEFAULT '{}',
  recommended_phase     INTEGER NOT NULL CHECK (recommended_phase BETWEEN 1 AND 10),
  promoted_to_plan      BOOLEAN NOT NULL DEFAULT false,
  metadata              JSONB NOT NULL DEFAULT '{}',
  created_by            UUID NOT NULL REFERENCES users(id),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_drill_targets_workspace ON drill_targets(workspace_id);
CREATE INDEX idx_drill_targets_branch ON drill_targets(branch_id, rank);
CREATE INDEX idx_drill_targets_run ON drill_targets(score_run_id);

CREATE TABLE drill_plans (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id          UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  repo_id               UUID NOT NULL REFERENCES repos(id) ON DELETE CASCADE,
  branch_id             UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  score_run_id          UUID REFERENCES target_score_runs(id) ON DELETE SET NULL,
  name                  VARCHAR(255) NOT NULL,
  phase_plan            JSONB NOT NULL DEFAULT '{}',
  budget_range          JSONB NOT NULL DEFAULT '{}',
  risk_map              JSONB NOT NULL DEFAULT '{}',
  status                VARCHAR(30) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'archived')),
  created_by            UUID NOT NULL REFERENCES users(id),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_drill_plans_workspace ON drill_plans(workspace_id);
CREATE INDEX idx_drill_plans_branch ON drill_plans(branch_id, created_at DESC);

GRANT SELECT, INSERT, UPDATE ON target_score_runs TO visiogold_app;
GRANT SELECT, INSERT, UPDATE ON drill_targets TO visiogold_app;
GRANT SELECT, INSERT, UPDATE ON drill_plans TO visiogold_app;
