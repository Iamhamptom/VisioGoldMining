-- Migration 008: Row-Level Security Policies
-- This is the CRITICAL security migration. Every tenant-scoped table gets RLS.

-- Helper functions to read session variables
CREATE OR REPLACE FUNCTION current_workspace_id() RETURNS UUID AS $$
  SELECT NULLIF(current_setting('app.current_workspace_id', true), '')::UUID;
$$ LANGUAGE SQL STABLE;

CREATE OR REPLACE FUNCTION current_user_id() RETURNS UUID AS $$
  SELECT NULLIF(current_setting('app.current_user_id', true), '')::UUID;
$$ LANGUAGE SQL STABLE;

-- ============================================================
-- WORKSPACES
-- ============================================================
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces FORCE ROW LEVEL SECURITY;

CREATE POLICY workspaces_isolation ON workspaces
  FOR ALL TO visiogold_app
  USING (id = current_workspace_id());

-- ============================================================
-- WORKSPACE_MEMBERS
-- ============================================================
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members FORCE ROW LEVEL SECURITY;

CREATE POLICY workspace_members_isolation ON workspace_members
  FOR ALL TO visiogold_app
  USING (workspace_id = current_workspace_id());

-- ============================================================
-- REPOS
-- ============================================================
ALTER TABLE repos ENABLE ROW LEVEL SECURITY;
ALTER TABLE repos FORCE ROW LEVEL SECURITY;

CREATE POLICY repos_isolation ON repos
  FOR ALL TO visiogold_app
  USING (workspace_id = current_workspace_id());

-- ============================================================
-- BRANCHES
-- ============================================================
ALTER TABLE branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE branches FORCE ROW LEVEL SECURITY;

-- Base policy: workspace isolation
CREATE POLICY branches_isolation ON branches
  FOR ALL TO visiogold_app
  USING (workspace_id = current_workspace_id());

-- Additional read policy: SHARED_WITH_VISIOGOLD branches visible to the VisioGold org workspace
CREATE POLICY branches_shared_read ON branches
  FOR SELECT TO visiogold_app
  USING (
    visibility = 'SHARED_WITH_VISIOGOLD'
    AND current_workspace_id() = NULLIF(current_setting('app.visiogold_org_workspace_id', true), '')::UUID
  );

-- ============================================================
-- COMMITS
-- ============================================================
ALTER TABLE commits ENABLE ROW LEVEL SECURITY;
ALTER TABLE commits FORCE ROW LEVEL SECURITY;

CREATE POLICY commits_isolation ON commits
  FOR ALL TO visiogold_app
  USING (workspace_id = current_workspace_id());

-- ============================================================
-- ARTIFACTS
-- ============================================================
ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE artifacts FORCE ROW LEVEL SECURITY;

CREATE POLICY artifacts_isolation ON artifacts
  FOR ALL TO visiogold_app
  USING (workspace_id = current_workspace_id());

-- ============================================================
-- COMMIT_ARTIFACTS
-- ============================================================
ALTER TABLE commit_artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE commit_artifacts FORCE ROW LEVEL SECURITY;

CREATE POLICY commit_artifacts_isolation ON commit_artifacts
  FOR ALL TO visiogold_app
  USING (workspace_id = current_workspace_id());

-- ============================================================
-- AUDIT_LOG (append-only: SELECT + INSERT only)
-- ============================================================
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log FORCE ROW LEVEL SECURITY;

CREATE POLICY audit_log_select ON audit_log
  FOR SELECT TO visiogold_app
  USING (workspace_id = current_workspace_id());

CREATE POLICY audit_log_insert ON audit_log
  FOR INSERT TO visiogold_app
  WITH CHECK (workspace_id = current_workspace_id());

-- ============================================================
-- ENCRYPTION_KEYS
-- ============================================================
ALTER TABLE encryption_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE encryption_keys FORCE ROW LEVEL SECURITY;

CREATE POLICY encryption_keys_isolation ON encryption_keys
  FOR ALL TO visiogold_app
  USING (workspace_id = current_workspace_id());

-- ============================================================
-- PUBLIC_SNAPSHOTS
-- ============================================================
ALTER TABLE public_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public_snapshots FORCE ROW LEVEL SECURITY;

-- Workspace members can manage their own snapshots
CREATE POLICY public_snapshots_isolation ON public_snapshots
  FOR ALL TO visiogold_app
  USING (workspace_id = current_workspace_id());

-- Anyone can read published snapshots (for public access)
CREATE POLICY public_snapshots_public_read ON public_snapshots
  FOR SELECT TO visiogold_app
  USING (published = true);
