-- Migration 006: Encryption Keys (envelope encryption)

CREATE TABLE encryption_keys (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  key_version     INTEGER NOT NULL DEFAULT 1,
  encrypted_key   BYTEA NOT NULL,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  rotated_at      TIMESTAMPTZ,
  UNIQUE(workspace_id, key_version)
);

CREATE INDEX idx_encryption_keys_workspace ON encryption_keys(workspace_id);

GRANT SELECT, INSERT, UPDATE ON encryption_keys TO visiogold_app;
