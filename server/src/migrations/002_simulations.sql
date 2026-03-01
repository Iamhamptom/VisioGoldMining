CREATE TABLE IF NOT EXISTS simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id),
  repo_id UUID REFERENCES repos(id),
  branch_id UUID REFERENCES branches(id),
  name TEXT NOT NULL,
  seed INTEGER NOT NULL,
  inputs JSONB NOT NULL,
  outputs JSONB,
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_simulations_branch ON simulations(branch_id);
