-- Migration 003: Repos and Branches

CREATE TABLE repos (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id      UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name              VARCHAR(255) NOT NULL,
  slug              VARCHAR(255) NOT NULL,
  description       TEXT,
  country           VARCHAR(100) DEFAULT 'DRC',
  commodity         VARCHAR(100) DEFAULT 'Gold',
  geom              GEOMETRY(Polygon, 4326),
  metadata          JSONB DEFAULT '{}',
  status            VARCHAR(50) DEFAULT 'ACTIVE',
  default_branch_id UUID,
  created_by        UUID NOT NULL REFERENCES users(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(workspace_id, slug)
);

CREATE INDEX idx_repos_workspace ON repos(workspace_id);
CREATE INDEX idx_repos_geom ON repos USING GIST(geom);

CREATE TABLE branches (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id      UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  repo_id           UUID NOT NULL REFERENCES repos(id) ON DELETE CASCADE,
  name              VARCHAR(255) NOT NULL,
  visibility        VARCHAR(30) NOT NULL DEFAULT 'PRIVATE'
                    CHECK (visibility IN ('PRIVATE', 'SHARED_WITH_VISIOGOLD', 'PUBLIC')),
  parent_branch_id  UUID REFERENCES branches(id),
  head_commit_id    UUID,
  created_by        UUID NOT NULL REFERENCES users(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(repo_id, name)
);

CREATE INDEX idx_branches_repo ON branches(repo_id);
CREATE INDEX idx_branches_workspace ON branches(workspace_id);

-- Set default_branch_id FK on repos (deferred since branches table now exists)
ALTER TABLE repos ADD CONSTRAINT fk_repos_default_branch
  FOREIGN KEY (default_branch_id) REFERENCES branches(id) DEFERRABLE INITIALLY DEFERRED;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON repos TO visiogold_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON branches TO visiogold_app;
