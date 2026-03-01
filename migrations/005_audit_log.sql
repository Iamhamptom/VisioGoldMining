-- Migration 005: Audit Log (append-only)

CREATE TABLE audit_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id),
  user_id         UUID REFERENCES users(id),
  action          VARCHAR(50) NOT NULL CHECK (action IN (
                    'LOGIN', 'LOGOUT',
                    'REPO_READ', 'REPO_CREATE', 'REPO_UPDATE',
                    'BRANCH_CREATE',
                    'COMMIT_CREATE', 'COMMIT_MERGE',
                    'ARTIFACT_UPLOAD', 'ARTIFACT_DOWNLOAD',
                    'PUBLISH',
                    'MEMBER_ADD', 'MEMBER_REMOVE', 'MEMBER_ROLE_CHANGE',
                    'WORKSPACE_CREATE'
                  )),
  resource_type   VARCHAR(50),
  resource_id     UUID,
  details         JSONB DEFAULT '{}',
  ip_address      INET,
  user_agent      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_log_workspace ON audit_log(workspace_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);
CREATE INDEX idx_audit_log_action ON audit_log(action);
CREATE INDEX idx_audit_log_user ON audit_log(user_id);

-- Append-only: SELECT + INSERT only, no UPDATE or DELETE
GRANT SELECT, INSERT ON audit_log TO visiogold_app;
