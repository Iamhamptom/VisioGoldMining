-- Migration 007: Public Snapshots

CREATE TABLE public_snapshots (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id     UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  branch_id        UUID NOT NULL REFERENCES branches(id),
  commit_id        UUID NOT NULL REFERENCES commits(id),
  slug             VARCHAR(255) NOT NULL UNIQUE,
  title            VARCHAR(500) NOT NULL,
  description      TEXT,
  redaction_rules  JSONB DEFAULT '[]',
  published        BOOLEAN NOT NULL DEFAULT false,
  published_by     UUID NOT NULL REFERENCES users(id),
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_public_snapshots_slug ON public_snapshots(slug);
CREATE INDEX idx_public_snapshots_workspace ON public_snapshots(workspace_id);
CREATE INDEX idx_public_snapshots_published ON public_snapshots(published) WHERE published = true;

GRANT SELECT, INSERT, UPDATE ON public_snapshots TO visiogold_app;
