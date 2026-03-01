export type ProjectType = 'exploration' | 'small_mine' | 'industrial';
export type LogisticsMode = 'road' | 'mixed' | 'heli';
export type SecurityPosture = 'low' | 'med' | 'high';
export type DrillingType = 'RC' | 'diamond' | 'mixed';
export type AssayPackage = 'screening' | 'standard' | 'full_qaqc';
export type LabChoice = 'local' | 'regional' | 'international';
export type TimelineAggressiveness = 'fast' | 'normal' | 'conservative';
export type CampStandard = 'basic' | 'standard' | 'premium';
export type ComplianceRigor = 'minimum' | 'standard' | 'investor_grade';
export type Currency = 'USD' | 'CDF' | 'ZAR';

export interface SimulationInput {
  name: string;
  target_polygon?: string;
  project_type: ProjectType;
  logistics_mode: LogisticsMode;
  security_posture: SecurityPosture;
  sampling_density_m: number;
  samples_count: number;
  drilling_meters: number;
  drilling_type: DrillingType;
  assay_package: AssayPackage;
  labs: LabChoice;
  timeline_aggressiveness: TimelineAggressiveness;
  camp_standard: CampStandard;
  compliance_rigor: ComplianceRigor;
  currency: Currency;
  gold_price_assumption: number;
  seed?: number;
}

export const DEPARTMENTS = [
  'legal_and_tenure',
  'licensing_and_filing',
  'environmental_and_esg',
  'community_engagement',
  'camp_and_logistics',
  'security',
  'mapping_and_remote_sensing',
  'sampling_and_fieldwork',
  'laboratory_assays',
  'drilling_campaign',
  'technical_studies_pea',
  'reporting_and_disclosure',
] as const;

export type DepartmentName = typeof DEPARTMENTS[number];

export const DEPARTMENT_LABELS: Record<DepartmentName, string> = {
  legal_and_tenure: 'Legal & Tenure',
  licensing_and_filing: 'Licensing & Filing',
  environmental_and_esg: 'Environmental & ESG',
  community_engagement: 'Community Engagement',
  camp_and_logistics: 'Camp & Logistics',
  security: 'Security',
  mapping_and_remote_sensing: 'Mapping & Remote Sensing',
  sampling_and_fieldwork: 'Sampling & Fieldwork',
  laboratory_assays: 'Laboratory Assays',
  drilling_campaign: 'Drilling Campaign',
  technical_studies_pea: 'Technical Studies / PEA',
  reporting_and_disclosure: 'Reporting & Disclosure',
};

export interface CostRange {
  min: number;
  p50: number;
  p90: number;
  confidence: number;
}

export interface DepartmentCost {
  department: DepartmentName;
  label: string;
  cost: CostRange;
  drivers: string[];
  notes: string;
}

export interface ScheduleOutput {
  min_days: number;
  p50_days: number;
  p90_days: number;
  critical_path: string[];
  risk_flags: string[];
}

export interface RiskScore {
  name: string;
  score: number;
  evidence: string;
  mitigations: string[];
}

export interface RiskImpact {
  security_risk_score: RiskScore;
  legal_complexity_score: RiskScore;
  esg_risk_score: RiskScore;
  access_risk_score: RiskScore;
  data_completeness_score: RiskScore;
}

export interface SimulationOutput {
  department_costs: DepartmentCost[];
  total_cost: CostRange;
  schedule: ScheduleOutput;
  risk_impact: RiskImpact;
  assumptions: string[];
}

export interface Simulation {
  id: string;
  workspace_id: string;
  repo_id: string;
  branch_id: string;
  name: string;
  seed: number;
  inputs: SimulationInput;
  outputs: SimulationOutput;
  created_at: string;
}

export interface ScenarioComparison {
  scenario_a: { id: string; name: string; total_p50: number };
  scenario_b: { id: string; name: string; total_p50: number };
  delta_cost: { department: DepartmentName; label: string; delta_p50: number }[];
  delta_total: number;
  delta_schedule_days: number;
  delta_risk: { name: string; delta: number }[];
  recommendation: string;
}
