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
  | 'WORKSPACE_CREATE'
  | 'GOV_ENTITY_CREATE'
  | 'GOV_ENTITY_UPDATE'
  | 'GOV_PORTAL_CREATE'
  | 'GOV_PORTAL_UPDATE'
  | 'GOV_PORTAL_PUBLISH'
  | 'LISTING_CREATE'
  | 'LISTING_UPDATE'
  | 'LISTING_WORKFLOW'
  | 'CONSULTATION_UPDATE'
  | 'REVENUE_CREATE';

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

// ============================================================
// Government Portal Types
// ============================================================

export type GovernmentEntityType = 'province' | 'municipality' | 'territory' | 'sector' | 'chiefdom';

export type OpportunitySector = 'mining' | 'agriculture' | 'infrastructure' | 'energy' | 'tourism' | 'urban' | 'forestry' | 'fisheries';

export type ListingStatus = 'draft' | 'submitted' | 'in_review' | 'approved' | 'published' | 'archived';

export type ConsultationType = 'meeting' | 'information' | 'site_visit' | 'partnership' | 'other';

export type ConsultationStatus = 'pending' | 'acknowledged' | 'scheduled' | 'completed' | 'declined' | 'cancelled';

export type ConsultationPriority = 'low' | 'normal' | 'high' | 'urgent';

export type InvestorExperience = 'novice' | 'intermediate' | 'experienced' | 'institutional';

export type RevenueEventType = 'consultation_fee' | 'listing_fee' | 'success_fee' | 'subscription' | 'data_license' | 'other';

export type RevenueStatus = 'pending' | 'invoiced' | 'paid' | 'cancelled';

export type AnalyticsEventType =
  | 'portal_view' | 'listing_view' | 'listing_click' | 'catalog_search'
  | 'investor_register' | 'consultation_submit' | 'document_download'
  | 'map_interact' | 'share' | 'contact_click';

export interface GovernmentEntity {
  id: string;
  workspace_id: string;
  name: string;
  slug: string;
  entity_type: GovernmentEntityType;
  parent_id: string | null;
  province: string | null;
  country: string;
  location: { lat: number; lon: number; bbox?: number[] } | null;
  population: number | null;
  area_km2: number | null;
  metadata: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

export interface GovernmentPortal {
  id: string;
  workspace_id: string;
  entity_id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  contact_email: string | null;
  contact_phone: string | null;
  website_url: string | null;
  featured_sectors: OpportunitySector[];
  hero_text: string | null;
  about_text: string | null;
  published: boolean;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface OpportunitySectorRow {
  id: OpportunitySector;
  name: string;
  icon: string | null;
  description: string | null;
  sort_order: number;
}

export interface KeyFact {
  label: string;
  value: string;
  tooltip?: string;
}

export interface ListingDocument {
  title: string;
  url: string;
  type: string;
}

export interface ListingImage {
  url: string;
  caption?: string;
}

export interface OpportunityListing {
  id: string;
  workspace_id: string;
  portal_id: string;
  entity_id: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  sector_id: OpportunitySector;
  province: string | null;
  location: { lat: number; lon: number } | null;
  area_hectares: number | null;
  investment_min: number | null;
  investment_max: number | null;
  currency: string;
  expected_roi: string | null;
  timeline_months: number | null;
  score_geological: number | null;
  score_infrastructure: number | null;
  score_legal: number | null;
  score_environmental: number | null;
  score_social: number | null;
  score_overall: number | null;
  key_facts: KeyFact[];
  documents: ListingDocument[];
  images: ListingImage[];
  status: ListingStatus;
  submitted_at: Date | null;
  approved_at: Date | null;
  published_at: Date | null;
  approved_by: string | null;
  tags: string[];
  metadata: Record<string, unknown>;
  created_by: string;
  created_at: Date;
  updated_at: Date;
}

export interface InvestorProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  company: string | null;
  job_title: string | null;
  country: string | null;
  investment_min: number | null;
  investment_max: number | null;
  sectors_of_interest: OpportunitySector[];
  experience_level: InvestorExperience | null;
  is_verified: boolean;
  verified_at: Date | null;
  lead_score: number;
  lead_score_details: Record<string, unknown>;
  metadata: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

export interface InvestorPortalRegistration {
  id: string;
  investor_id: string;
  portal_id: string;
  registered_at: Date;
  source: string;
  notes: string | null;
}

export interface ConsultationRequest {
  id: string;
  workspace_id: string;
  portal_id: string;
  listing_id: string | null;
  investor_id: string | null;
  request_type: ConsultationType;
  subject: string;
  message: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string | null;
  contact_company: string | null;
  status: ConsultationStatus;
  priority: ConsultationPriority;
  assigned_to: string | null;
  response_notes: string | null;
  scheduled_date: Date | null;
  completed_at: Date | null;
  metadata: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
}

export interface RevenueEvent {
  id: string;
  workspace_id: string;
  portal_id: string;
  listing_id: string | null;
  investor_id: string | null;
  event_type: RevenueEventType;
  description: string | null;
  gross_amount: number;
  currency: string;
  platform_rate: number;
  platform_amount: number;
  government_amount: number;
  status: RevenueStatus;
  paid_at: Date | null;
  reference_id: string | null;
  notes: string | null;
  metadata: Record<string, unknown>;
  created_by: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface PortalAnalyticsEvent {
  id: string;
  portal_id: string;
  listing_id: string | null;
  investor_id: string | null;
  event_type: AnalyticsEventType;
  referrer: string | null;
  user_agent: string | null;
  ip_country: string | null;
  session_id: string | null;
  metadata: Record<string, unknown>;
  created_at: Date;
}

export interface PortalAnalyticsDaily {
  id: string;
  portal_id: string;
  listing_id: string | null;
  date: Date;
  portal_views: number;
  listing_views: number;
  listing_clicks: number;
  registrations: number;
  consultations: number;
  document_downloads: number;
  unique_visitors: number;
  conversion_rate: number;
}
