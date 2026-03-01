CREATE TABLE IF NOT EXISTS project_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id),
  repo_id UUID REFERENCES repos(id),
  branch_id UUID REFERENCES branches(id),
  name TEXT NOT NULL,
  plan_json JSONB NOT NULL,
  simulation_id UUID REFERENCES simulations(id),
  created_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_project_plans_branch ON project_plans(branch_id);
