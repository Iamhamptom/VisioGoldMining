-- Migration 022: Sales proposals + versioning + line items

CREATE TABLE proposals (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id          UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name                  VARCHAR(255) NOT NULL,
  site_type             VARCHAR(100) NOT NULL,
  remoteness            VARCHAR(100) NOT NULL,
  mine_stage            VARCHAR(100) NOT NULL,
  data_maturity         VARCHAR(100) NOT NULL,
  desired_bundle        VARCHAR(100),
  desired_phase         VARCHAR(100),
  recommended_package   VARCHAR(255) NOT NULL,
  price_min             NUMERIC(14,2) NOT NULL,
  price_max             NUMERIC(14,2) NOT NULL,
  timeline_weeks        INTEGER NOT NULL,
  sow_summary           TEXT NOT NULL,
  milestones            JSONB NOT NULL DEFAULT '[]',
  status                VARCHAR(30) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'shared', 'won', 'lost')),
  created_by            UUID NOT NULL REFERENCES users(id),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_proposals_workspace ON proposals(workspace_id);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_created ON proposals(created_at DESC);

CREATE TABLE proposal_versions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id          UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  proposal_id           UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  version_number        INTEGER NOT NULL,
  input_json            JSONB NOT NULL DEFAULT '{}',
  output_json           JSONB NOT NULL DEFAULT '{}',
  created_by            UUID NOT NULL REFERENCES users(id),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(proposal_id, version_number)
);

CREATE INDEX idx_proposal_versions_workspace ON proposal_versions(workspace_id);

CREATE TABLE proposal_line_items (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id          UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  proposal_id           UUID NOT NULL REFERENCES proposals(id) ON DELETE CASCADE,
  label                 VARCHAR(255) NOT NULL,
  description           TEXT,
  amount_min            NUMERIC(14,2) NOT NULL,
  amount_max            NUMERIC(14,2) NOT NULL,
  quantity              NUMERIC(12,2) NOT NULL DEFAULT 1,
  unit                  VARCHAR(50) NOT NULL DEFAULT 'lot',
  sort_order            INTEGER NOT NULL DEFAULT 0,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_proposal_line_items_workspace ON proposal_line_items(workspace_id);
CREATE INDEX idx_proposal_line_items_proposal ON proposal_line_items(proposal_id, sort_order);

GRANT SELECT, INSERT, UPDATE ON proposals TO visiogold_app;
GRANT SELECT, INSERT ON proposal_versions TO visiogold_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON proposal_line_items TO visiogold_app;
