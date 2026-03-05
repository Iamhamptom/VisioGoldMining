interface ProposalInput {
  site_type: 'greenfield' | 'brownfield' | 'producing' | 'multi_site';
  remoteness: 'low' | 'medium' | 'high' | 'extreme';
  mine_stage: 'phase_0' | 'phase_1' | 'phase_2' | 'phase_3' | 'enterprise';
  data_maturity: 'low' | 'medium' | 'high';
  desired_bundle?: string;
  desired_phase?: string;
}

export interface ProposalResult {
  recommendedPackage: string;
  priceMin: number;
  priceMax: number;
  timelineWeeks: number;
  sowSummary: string;
  milestones: Array<{ title: string; weeks: number }>;
  lineItems: Array<{ label: string; description: string; amountMin: number; amountMax: number }>;
}

const STAGE_BASE: Record<ProposalInput['mine_stage'], { label: string; min: number; max: number; weeks: number }> = {
  phase_0: { label: 'Desktop Targeting Pack', min: 15000, max: 150000, weeks: 4 },
  phase_1: { label: 'Drone + Field Verification', min: 50000, max: 600000, weeks: 8 },
  phase_2: { label: 'Drill Guidance Retainer', min: 120000, max: 450000, weeks: 12 },
  phase_3: { label: 'Recovery Uplift Program', min: 250000, max: 1800000, weeks: 16 },
  enterprise: { label: 'Autonomy Readiness Program', min: 500000, max: 5000000, weeks: 20 },
};

const REMOTENESS_MULTIPLIER: Record<ProposalInput['remoteness'], number> = {
  low: 1,
  medium: 1.15,
  high: 1.35,
  extreme: 1.55,
};

const MATURITY_MULTIPLIER: Record<ProposalInput['data_maturity'], number> = {
  low: 1.25,
  medium: 1.1,
  high: 1,
};

const SITE_MULTIPLIER: Record<ProposalInput['site_type'], number> = {
  greenfield: 1.2,
  brownfield: 1,
  producing: 1.1,
  multi_site: 1.45,
};

export function buildProposal(input: ProposalInput): ProposalResult {
  const base = STAGE_BASE[input.mine_stage];
  const multiplier = REMOTENESS_MULTIPLIER[input.remoteness] * MATURITY_MULTIPLIER[input.data_maturity] * SITE_MULTIPLIER[input.site_type];

  const priceMin = Math.round(base.min * multiplier);
  const priceMax = Math.round(base.max * multiplier);
  const timelineWeeks = Math.round(base.weeks * (input.remoteness === 'extreme' ? 1.3 : 1.0));

  const packageName = input.desired_bundle?.trim() || base.label;

  const milestones = [
    { title: 'Kickoff + Data Intake', weeks: 1 },
    { title: 'Modeling + Prioritization', weeks: Math.max(2, Math.round(timelineWeeks * 0.35)) },
    { title: 'Plan + Report Delivery', weeks: Math.max(2, Math.round(timelineWeeks * 0.35)) },
    { title: 'Handover + Decision Workshop', weeks: Math.max(1, Math.round(timelineWeeks * 0.15)) },
  ];

  const lineItems = [
    {
      label: 'Core Intelligence Package',
      description: `${packageName} delivery aligned to ${input.mine_stage.replace('_', ' ').toUpperCase()} objectives`,
      amountMin: Math.round(priceMin * 0.55),
      amountMax: Math.round(priceMax * 0.55),
    },
    {
      label: 'Data Engineering + Integration',
      description: 'Ingestion, normalization, quality controls, and deliverable packaging',
      amountMin: Math.round(priceMin * 0.25),
      amountMax: Math.round(priceMax * 0.25),
    },
    {
      label: 'Governance + Decision Support',
      description: 'Decision logs, KPI dashboard, and stakeholder reporting setup',
      amountMin: Math.round(priceMin * 0.20),
      amountMax: Math.round(priceMax * 0.20),
    },
  ];

  return {
    recommendedPackage: packageName,
    priceMin,
    priceMax,
    timelineWeeks,
    sowSummary: `VisioGold will deliver a DRC-first ${packageName} for a ${input.site_type} site with ${input.remoteness} remoteness and ${input.data_maturity} data maturity. Scope includes data integration, target intelligence outputs, board-ready reporting, and operational decision support with measurable milestones.`,
    milestones,
    lineItems,
  };
}
