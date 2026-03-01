-- Additional indexes for query performance
-- These cover the most frequent lookup patterns observed in the API routes.

-- Users: email lookup during login
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- Commits: chronological listing per branch
CREATE INDEX IF NOT EXISTS idx_commits_branch_created ON commits (branch_id, committed_at DESC);

-- Artifacts: listing per branch
CREATE INDEX IF NOT EXISTS idx_artifacts_branch ON artifacts (branch_id, created_at DESC);

-- Commit artifacts: lookup by commit
CREATE INDEX IF NOT EXISTS idx_commit_artifacts_commit ON commit_artifacts (commit_id);

-- Audit log: lookup by workspace + timestamp
CREATE INDEX IF NOT EXISTS idx_audit_log_workspace_time ON audit_log (workspace_id, created_at DESC);

-- Workspace members: lookup by user
CREATE INDEX IF NOT EXISTS idx_workspace_members_user ON workspace_members (user_id);

-- Branches: lookup by repo
CREATE INDEX IF NOT EXISTS idx_branches_repo ON branches (repo_id);
