// ============================================================
// Enums
// ============================================================

export type MemberRole = 'OWNER' | 'ADMIN' | 'ANALYST' | 'VIEWER';

export type BranchVisibility = 'PRIVATE' | 'SHARED_WITH_VISIOGOLD' | 'PUBLIC';

export type ArtifactType =
  | 'DOCUMENT'
  | 'DATASET'
  | 'PLAN'
  | 'SIMULATION'
  | 'TASKS'
  | 'NOTE'
  | 'RISK_REGISTER'
  | 'VENDOR_REPORT';

export type CommitArtifactAction = 'ADD' | 'UPDATE' | 'DELETE';

export type AuditAction =
  | 'LOGIN'
  | 'LOGOUT'
  | 'REPO_READ'
  | 'REPO_CREATE'
  | 'REPO_UPDATE'
  | 'BRANCH_CREATE'
  | 'COMMIT_CREATE'
  | 'COMMIT_MERGE'
  | 'ARTIFACT_UPLOAD'
  | 'ARTIFACT_DOWNLOAD'
  | 'PUBLISH'
  | 'MEMBER_ADD'
  | 'MEMBER_REMOVE'
  | 'MEMBER_ROLE_CHANGE'
  | 'WORKSPACE_CREATE';

// ============================================================
// Database Row Types
// ============================================================

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  settings: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

export interface User {
  id: string;
  email: string;
  password_hash: string;
  display_name: string;
  is_active: boolean;
  created_at: Date;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: MemberRole;
  created_at: Date;
}

export interface Repo {
  id: string;
  workspace_id: string;
  name: string;
  slug: string;
  description: string | null;
  metadata: Record<string, unknown>;
  status: string;
  default_branch_id: string | null;
  created_by: string;
  created_at: Date;
}

export interface Branch {
  id: string;
  workspace_id: string;
  repo_id: string;
  name: string;
  visibility: BranchVisibility;
  parent_branch_id: string | null;
  head_commit_id: string | null;
  created_by: string;
  created_at: Date;
}

export interface Commit {
  id: string;
  workspace_id: string;
  branch_id: string;
  parent_commit_id: string | null;
  merge_source_commit_id: string | null;
  message: string;
  metadata: Record<string, unknown>;
  committed_by: string;
  committed_at: Date;
}

export interface Artifact {
  id: string;
  workspace_id: string;
  repo_id: string;
  branch_id: string;
  type: ArtifactType;
  title: string;
  filename: string;
  mime_type: string | null;
  size_bytes: number;
  sha256: string;
  storage_path: string;
  encrypted_dek: Buffer | null;
  encryption_key_id: string | null;
  metadata_json: Record<string, unknown>;
  created_by: string;
  created_at: Date;
}

export interface CommitArtifact {
  id: string;
  workspace_id: string;
  commit_id: string;
  artifact_id: string;
  change_type: CommitArtifactAction;
  path: string;
  previous_artifact_id: string | null;
}

export interface AuditLogEntry {
  id: string;
  workspace_id: string;
  user_id: string | null;
  action: AuditAction;
  resource_type: string | null;
  resource_id: string | null;
  details: Record<string, unknown>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: Date;
}

export interface EncryptionKey {
  id: string;
  workspace_id: string;
  key_version: number;
  encrypted_key: Buffer;
  is_active: boolean;
  created_at: Date;
  rotated_at: Date | null;
}

export interface PublicSnapshot {
  id: string;
  workspace_id: string;
  branch_id: string;
  commit_id: string;
  slug: string;
  title: string;
  description: string | null;
  redaction_rules: RedactionRule[];
  published: boolean;
  published_by: string;
  published_at: Date | null;
  created_at: Date;
}

// ============================================================
// Redaction Rules
// ============================================================

export type RedactionRule =
  | { type: 'exclude_artifact_types'; types: ArtifactType[] }
  | { type: 'exclude_paths'; patterns: string[] }
  | { type: 'exclude_metadata_fields'; fields: string[] };

// ============================================================
// Auth / JWT
// ============================================================

export interface JWTPayload {
  sub: string;        // user ID
  email: string;
  workspaceId: string;
  role: MemberRole;
}

// ============================================================
// API Context
// ============================================================

export interface RequestContext {
  user: JWTPayload;
  workspaceId: string;
}

// ============================================================
// Diff / Merge
// ============================================================

export interface TreeEntry {
  path: string;
  artifact_id: string;
  sha256: string;
}

export interface DiffEntry {
  path: string;
  status: 'added' | 'modified' | 'deleted';
  old_artifact_id?: string;
  new_artifact_id?: string;
  old_sha256?: string;
  new_sha256?: string;
}
