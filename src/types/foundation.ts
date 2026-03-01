export interface Workspace {
  id: string;
  name: string;
  created_at: string;
}

export interface Repo {
  id: string;
  workspace_id: string;
  name: string;
  created_at: string;
}

export interface Branch {
  id: string;
  repo_id: string;
  name: string;
  created_at: string;
}

export interface Artifact {
  id: string;
  branch_id: string;
  entity_type: string;
  entity_id: string;
  sha256: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface DefaultContext {
  workspaceId: string;
  repoId: string;
  branchId: string;
}
