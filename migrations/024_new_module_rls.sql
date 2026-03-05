-- Migration 024: RLS for new modules

-- Expand audit action enum/check to support all modules.
ALTER TABLE audit_log DROP CONSTRAINT IF EXISTS audit_log_action_check;
ALTER TABLE audit_log
  ADD CONSTRAINT audit_log_action_check CHECK (action IN (
    'LOGIN', 'LOGOUT',
    'REPO_READ', 'REPO_CREATE', 'REPO_UPDATE',
    'BRANCH_CREATE',
    'COMMIT_CREATE', 'COMMIT_MERGE',
    'ARTIFACT_UPLOAD', 'ARTIFACT_DOWNLOAD',
    'PUBLISH',
    'MEMBER_ADD', 'MEMBER_REMOVE', 'MEMBER_ROLE_CHANGE',
    'WORKSPACE_CREATE',
    'GOV_ENTITY_CREATE', 'GOV_ENTITY_UPDATE',
    'GOV_PORTAL_CREATE', 'GOV_PORTAL_UPDATE', 'GOV_PORTAL_PUBLISH',
    'LISTING_CREATE', 'LISTING_UPDATE', 'LISTING_WORKFLOW',
    'CONSULTATION_UPDATE', 'REVENUE_CREATE',
    'DATA_INGEST', 'TARGET_SCORE_RUN', 'DRILL_PLAN_GENERATE',
    'REPORT_GENERATE', 'PROPOSAL_CREATE', 'DECISION_LOG'
  ));

-- ============================================================
-- SALES_LEADS
-- ============================================================
ALTER TABLE sales_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_leads FORCE ROW LEVEL SECURITY;

CREATE POLICY sales_leads_isolation ON sales_leads
  FOR ALL TO visiogold_app
  USING (workspace_id = current_workspace_id() OR workspace_id IS NULL)
  WITH CHECK (workspace_id = current_workspace_id() OR workspace_id IS NULL);

-- ============================================================
-- DATA ROOM TABLES
-- ============================================================
ALTER TABLE data_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_assets FORCE ROW LEVEL SECURITY;
CREATE POLICY data_assets_isolation ON data_assets
  FOR ALL TO visiogold_app
  USING (workspace_id = current_workspace_id())
  WITH CHECK (workspace_id = current_workspace_id());

ALTER TABLE data_asset_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_asset_versions FORCE ROW LEVEL SECURITY;
CREATE POLICY data_asset_versions_isolation ON data_asset_versions
  FOR ALL TO visiogold_app
  USING (workspace_id = current_workspace_id())
  WITH CHECK (workspace_id = current_workspace_id());

ALTER TABLE ingestion_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingestion_jobs FORCE ROW LEVEL SECURITY;
CREATE POLICY ingestion_jobs_isolation ON ingestion_jobs
  FOR ALL TO visiogold_app
  USING (workspace_id = current_workspace_id())
  WITH CHECK (workspace_id = current_workspace_id());

ALTER TABLE provenance_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE provenance_events FORCE ROW LEVEL SECURITY;
CREATE POLICY provenance_events_isolation ON provenance_events
  FOR ALL TO visiogold_app
  USING (workspace_id = current_workspace_id())
  WITH CHECK (workspace_id = current_workspace_id());

-- ============================================================
-- TARGETING TABLES
-- ============================================================
ALTER TABLE target_score_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE target_score_runs FORCE ROW LEVEL SECURITY;
CREATE POLICY target_score_runs_isolation ON target_score_runs
  FOR ALL TO visiogold_app
  USING (workspace_id = current_workspace_id())
  WITH CHECK (workspace_id = current_workspace_id());

ALTER TABLE drill_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE drill_targets FORCE ROW LEVEL SECURITY;
CREATE POLICY drill_targets_isolation ON drill_targets
  FOR ALL TO visiogold_app
  USING (workspace_id = current_workspace_id())
  WITH CHECK (workspace_id = current_workspace_id());

ALTER TABLE drill_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE drill_plans FORCE ROW LEVEL SECURITY;
CREATE POLICY drill_plans_isolation ON drill_plans
  FOR ALL TO visiogold_app
  USING (workspace_id = current_workspace_id())
  WITH CHECK (workspace_id = current_workspace_id());

-- ============================================================
-- REPORTS
-- ============================================================
ALTER TABLE report_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_jobs FORCE ROW LEVEL SECURITY;
CREATE POLICY report_jobs_isolation ON report_jobs
  FOR ALL TO visiogold_app
  USING (workspace_id = current_workspace_id())
  WITH CHECK (workspace_id = current_workspace_id());

ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports FORCE ROW LEVEL SECURITY;
CREATE POLICY reports_isolation ON reports
  FOR ALL TO visiogold_app
  USING (workspace_id = current_workspace_id())
  WITH CHECK (workspace_id = current_workspace_id());

-- ============================================================
-- DECISION LOGS
-- ============================================================
ALTER TABLE decision_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE decision_logs FORCE ROW LEVEL SECURITY;
CREATE POLICY decision_logs_isolation ON decision_logs
  FOR ALL TO visiogold_app
  USING (workspace_id = current_workspace_id())
  WITH CHECK (workspace_id = current_workspace_id());

-- ============================================================
-- PROPOSALS
-- ============================================================
ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposals FORCE ROW LEVEL SECURITY;
CREATE POLICY proposals_isolation ON proposals
  FOR ALL TO visiogold_app
  USING (workspace_id = current_workspace_id())
  WITH CHECK (workspace_id = current_workspace_id());

ALTER TABLE proposal_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_versions FORCE ROW LEVEL SECURITY;
CREATE POLICY proposal_versions_isolation ON proposal_versions
  FOR ALL TO visiogold_app
  USING (workspace_id = current_workspace_id())
  WITH CHECK (workspace_id = current_workspace_id());

ALTER TABLE proposal_line_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE proposal_line_items FORCE ROW LEVEL SECURITY;
CREATE POLICY proposal_line_items_isolation ON proposal_line_items
  FOR ALL TO visiogold_app
  USING (workspace_id = current_workspace_id())
  WITH CHECK (workspace_id = current_workspace_id());
