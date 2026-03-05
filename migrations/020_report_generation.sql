-- Migration 020: Report jobs + generated report artifacts

CREATE TABLE report_jobs (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id          UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  repo_id               UUID NOT NULL REFERENCES repos(id) ON DELETE CASCADE,
  branch_id             UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  score_run_id          UUID REFERENCES target_score_runs(id) ON DELETE SET NULL,
  drill_plan_id         UUID REFERENCES drill_plans(id) ON DELETE SET NULL,
  template_type         VARCHAR(50) NOT NULL CHECK (template_type IN ('board_technical', 'investor_pack', 'gov_permit_community')),
  output_formats        TEXT[] NOT NULL DEFAULT '{pdf,pptx}',
  status                VARCHAR(30) NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed')),
  error_message         TEXT,
  metadata              JSONB NOT NULL DEFAULT '{}',
  created_by            UUID NOT NULL REFERENCES users(id),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at            TIMESTAMPTZ,
  completed_at          TIMESTAMPTZ
);

CREATE INDEX idx_report_jobs_workspace ON report_jobs(workspace_id);
CREATE INDEX idx_report_jobs_branch ON report_jobs(branch_id, created_at DESC);
CREATE INDEX idx_report_jobs_status ON report_jobs(status);

CREATE TABLE reports (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id          UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  repo_id               UUID NOT NULL REFERENCES repos(id) ON DELETE CASCADE,
  branch_id             UUID NOT NULL REFERENCES branches(id) ON DELETE CASCADE,
  report_job_id         UUID NOT NULL REFERENCES report_jobs(id) ON DELETE CASCADE,
  output_type           VARCHAR(30) NOT NULL CHECK (output_type IN ('pdf', 'pptx')),
  artifact_id           UUID REFERENCES artifacts(id) ON DELETE SET NULL,
  storage_path          VARCHAR(1000) NOT NULL,
  mime_type             VARCHAR(255) NOT NULL,
  size_bytes            BIGINT NOT NULL,
  metadata              JSONB NOT NULL DEFAULT '{}',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reports_workspace ON reports(workspace_id);
CREATE INDEX idx_reports_job ON reports(report_job_id);

GRANT SELECT, INSERT, UPDATE ON report_jobs TO visiogold_app;
GRANT SELECT, INSERT, UPDATE ON reports TO visiogold_app;
