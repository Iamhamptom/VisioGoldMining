interface MockLead {
  id: string;
  workspace_id: string | null;
  source_page: string;
  interest_area: string;
  company_name: string | null;
  contact_name: string | null;
  email: string;
  phone: string | null;
  company_size: string | null;
  country: string | null;
  stage: string;
  estimated_acv: number | null;
  notes: string | null;
  intent_tags: string[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface MockProposal {
  id: string;
  workspace_id: string;
  name: string;
  site_type: string;
  remoteness: string;
  mine_stage: string;
  data_maturity: string;
  desired_bundle: string | null;
  desired_phase: string | null;
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

interface MockProposalVersion {
  id: string;
  workspace_id: string;
  proposal_id: string;
  version_number: number;
  input_json: Record<string, unknown>;
  output_json: Record<string, unknown>;
  created_at: string;
}

interface MockLineItem {
  id: string;
  workspace_id: string;
  proposal_id: string;
  label: string;
  description: string;
  amount_min: number;
  amount_max: number;
  quantity: number;
  unit: string;
  sort_order: number;
  created_at: string;
}

interface MockDataAsset {
  id: string;
  workspace_id: string;
  repo_id: string;
  branch_id: string;
  name: string;
  data_type: string;
  country: string | null;
  site: string | null;
  project: string | null;
  status: 'active' | 'archived';
  tags: string[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

interface MockDataAssetVersion {
  id: string;
  workspace_id: string;
  data_asset_id: string;
  version_number: number;
  parser_version: string;
  checksum: string;
  normalized_schema: Record<string, unknown>;
  summary_json: Record<string, unknown>;
  raw_metadata: Record<string, unknown>;
  created_at: string;
}

interface MockIngestionJob {
  id: string;
  workspace_id: string;
  repo_id: string;
  branch_id: string;
  data_asset_id: string;
  data_asset_version_id: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'needs_review';
  input_json: Record<string, unknown>;
  output_json: Record<string, unknown>;
  error_message: string | null;
  retry_count: number;
  queue_job_id: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}

interface MockTargetScoreRun {
  id: string;
  workspace_id: string;
  repo_id: string;
  branch_id: string;
  name: string;
  scoring_model_version: string;
  seed: number | null;
  status: 'queued' | 'running' | 'completed' | 'failed';
  input_snapshot: Record<string, unknown>;
  output_summary: Record<string, unknown>;
  created_at: string;
}

interface MockDrillTarget {
  id: string;
  workspace_id: string;
  repo_id: string;
  branch_id: string;
  score_run_id: string;
  external_target_id: string | null;
  name: string;
  rank: number;
  confidence_score: number;
  data_completeness: number;
  latitude: number | null;
  longitude: number | null;
  reason_codes: string[];
  risk_flags: string[];
  recommended_phase: number;
  promoted_to_plan: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface MockDrillPlan {
  id: string;
  workspace_id: string;
  repo_id: string;
  branch_id: string;
  score_run_id: string | null;
  name: string;
  phase_plan: Record<string, unknown>;
  budget_range: Record<string, unknown>;
  risk_map: Record<string, unknown>;
  status: 'draft' | 'active' | 'archived';
  created_at: string;
}

interface MockReportJob {
  id: string;
  workspace_id: string;
  repo_id: string;
  branch_id: string;
  score_run_id: string | null;
  drill_plan_id: string | null;
  template_type: string;
  output_formats: string[];
  status: 'queued' | 'running' | 'completed' | 'failed';
  error_message: string | null;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
}

interface MockReport {
  id: string;
  workspace_id: string;
  repo_id: string;
  branch_id: string;
  report_job_id: string;
  output_type: 'pdf' | 'pptx';
  artifact_id: string | null;
  storage_path: string;
  mime_type: string;
  size_bytes: number;
  metadata: Record<string, unknown>;
  created_at: string;
}

interface MockDecisionLog {
  id: string;
  workspace_id: string;
  repo_id: string;
  branch_id: string;
  recommendation: 'STOP' | 'CONTINUE' | 'PIVOT';
  reasons: string[];
  metrics: Record<string, unknown>;
  notes: string | null;
  decided_at: string;
  decided_by_name: string;
}

export interface MockMiningState {
  leads: MockLead[];
  proposals: MockProposal[];
  proposalVersions: MockProposalVersion[];
  proposalLineItems: MockLineItem[];
  dataAssets: MockDataAsset[];
  dataAssetVersions: MockDataAssetVersion[];
  ingestionJobs: MockIngestionJob[];
  targetScoreRuns: MockTargetScoreRun[];
  drillTargets: MockDrillTarget[];
  drillPlans: MockDrillPlan[];
  reportJobs: MockReportJob[];
  reports: MockReport[];
  decisionLogs: MockDecisionLog[];
}

const STORE_KEY = '__VG_MOCK_MINING_STATE__';

function createInitialState(): MockMiningState {
  return {
    leads: [],
    proposals: [],
    proposalVersions: [],
    proposalLineItems: [],
    dataAssets: [],
    dataAssetVersions: [],
    ingestionJobs: [],
    targetScoreRuns: [],
    drillTargets: [],
    drillPlans: [],
    reportJobs: [],
    reports: [],
    decisionLogs: [],
  };
}

export function getMockMiningState(): MockMiningState {
  const g = globalThis as typeof globalThis & { [STORE_KEY]?: MockMiningState };
  if (!g[STORE_KEY]) {
    g[STORE_KEY] = createInitialState();
  }
  return g[STORE_KEY] as MockMiningState;
}

export function mockId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}
