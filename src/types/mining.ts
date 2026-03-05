import type { ArtifactType } from '@/types';

export type IngestionStatus = 'queued' | 'running' | 'completed' | 'failed' | 'needs_review';

export interface DataAsset {
  id: string;
  workspace_id: string;
  repo_id: string;
  branch_id: string;
  name: string;
  data_type: 'pdf' | 'csv' | 'geojson' | 'shp' | 'assay_table' | 'drillhole_table' | 'geophysics_grid' | 'image' | 'other';
  country?: string | null;
  site?: string | null;
  project?: string | null;
  source_artifact_id?: string | null;
  status: 'active' | 'archived';
  tags: string[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface DataAssetVersion {
  id: string;
  workspace_id: string;
  data_asset_id: string;
  version_number: number;
  source_artifact_id?: string | null;
  parser_version: string;
  checksum: string;
  normalized_schema: Record<string, unknown>;
  summary_json: Record<string, unknown>;
  raw_metadata: Record<string, unknown>;
  created_at: string;
}

export interface IngestionJob {
  id: string;
  workspace_id: string;
  repo_id: string;
  branch_id: string;
  data_asset_id: string;
  data_asset_version_id?: string | null;
  queue_job_id?: string | null;
  status: IngestionStatus;
  input_json: Record<string, unknown>;
  output_json: Record<string, unknown>;
  error_message?: string | null;
  retry_count: number;
  started_at?: string | null;
  completed_at?: string | null;
  created_at: string;
}

export interface TargetScoreRun {
  id: string;
  workspace_id: string;
  repo_id: string;
  branch_id: string;
  name: string;
  scoring_model_version: string;
  seed?: number | null;
  status: 'queued' | 'running' | 'completed' | 'failed';
  input_snapshot: Record<string, unknown>;
  output_summary: Record<string, unknown>;
  created_at: string;
}

export interface DrillTarget {
  id: string;
  workspace_id: string;
  repo_id: string;
  branch_id: string;
  score_run_id: string;
  external_target_id?: string | null;
  name: string;
  rank: number;
  confidence_score: number;
  data_completeness: number;
  latitude?: number | null;
  longitude?: number | null;
  geojson?: Record<string, unknown> | null;
  reason_codes: string[];
  risk_flags: string[];
  recommended_phase: number;
  promoted_to_plan: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface DrillPlan {
  id: string;
  workspace_id: string;
  repo_id: string;
  branch_id: string;
  score_run_id?: string | null;
  name: string;
  phase_plan: Record<string, unknown>;
  budget_range: Record<string, unknown>;
  risk_map: Record<string, unknown>;
  status: 'draft' | 'active' | 'archived';
  created_at: string;
}

export interface ReportJob {
  id: string;
  workspace_id: string;
  repo_id: string;
  branch_id: string;
  score_run_id?: string | null;
  drill_plan_id?: string | null;
  template_type: 'board_technical' | 'investor_pack' | 'gov_permit_community';
  output_formats: Array<'pdf' | 'pptx'>;
  status: 'queued' | 'running' | 'completed' | 'failed';
  error_message?: string | null;
  created_at: string;
  started_at?: string | null;
  completed_at?: string | null;
}

export interface ReportArtifact {
  id: string;
  report_job_id: string;
  output_type: 'pdf' | 'pptx';
  artifact_id?: string | null;
  storage_path: string;
  mime_type: string;
  size_bytes: number;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Proposal {
  id: string;
  workspace_id: string;
  name: string;
  site_type: string;
  remoteness: string;
  mine_stage: string;
  data_maturity: string;
  desired_bundle?: string | null;
  desired_phase?: string | null;
  recommended_package: string;
  price_min: number;
  price_max: number;
  timeline_weeks: number;
  sow_summary: string;
  milestones: Array<{ title: string; weeks: number }>;
  status: 'draft' | 'shared' | 'won' | 'lost';
  created_at: string;
  updated_at: string;
}

export interface ReportGenerationInput {
  repoId: string;
  branchId: string;
  templateType: 'board_technical' | 'investor_pack' | 'gov_permit_community';
  outputFormats: Array<'pdf' | 'pptx'>;
  scoreRunId?: string;
  drillPlanId?: string;
  title?: string;
  includeFinancials?: boolean;
  includeMaps?: boolean;
}

export const INGESTION_DATA_TYPES = [
  'pdf',
  'csv',
  'geojson',
  'shp',
  'assay_table',
  'drillhole_table',
  'geophysics_grid',
  'image',
  'other',
] as const;

export const REPORT_OUTPUT_ARTIFACT_TYPES: Record<'pdf' | 'pptx', ArtifactType> = {
  pdf: 'REPORT',
  pptx: 'INVESTOR_DECK',
};
