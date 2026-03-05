export interface OfferPhase {
  id: 'phase_0' | 'phase_1' | 'phase_2' | 'phase_3' | 'enterprise';
  title: string;
  subtitle: string;
  deliverables: string[];
  priceRange: string;
  recurring?: string;
  performanceFee?: string;
  addons?: string[];
}

export interface OfferBundle {
  id: 'A' | 'B' | 'C' | 'D' | 'E';
  name: string;
  includes: string[];
  setupPrice: string;
  recurringPrice?: string;
  performanceFee?: string;
}

export interface SubscriptionPlan {
  name: 'Explorer' | 'Operator' | 'Enterprise';
  audience: string;
  monthly: string;
  setupFee: string;
  features: string[];
}

export const MINING_PHASES: OfferPhase[] = [
  {
    id: 'phase_0',
    title: 'Phase 0: Desktop Targeting Pack',
    subtitle: 'Fastest entry deal',
    deliverables: [
      'Unified data room (reports, maps, geochem, remote sensing)',
      'Ranked drill targets + confidence scoring',
      '10-phase drill plan + budget range + risk map',
      'Board/investor-ready PDF pack',
    ],
    priceRange: '$15k-$150k',
    addons: [
      'Stakeholder/security risk brief: $5k-$25k',
      'Capital raise pack: $10k-$40k',
    ],
  },
  {
    id: 'phase_1',
    title: 'Phase 1: Drone + Field Verification',
    subtitle: 'High-margin validation',
    deliverables: [
      'Orthomosaic + 3D terrain model',
      'Anomaly mapping + ground-truth plan',
      'Recommended drill pads/access routes',
      'Updated target ranking post-verification',
    ],
    priceRange: '$50k-$600k',
    addons: [
      'Ground-truth team deployment: $15k-$80k',
      'Repeat survey cycles: $10k-$60k each',
    ],
  },
  {
    id: 'phase_2',
    title: 'Phase 2: Drill Guidance + Live Updates',
    subtitle: 'Recurring starts here',
    deliverables: [
      'Drill priorities/collar locations/phased programs',
      'Assay + geology ingestion pipeline',
      'Weekly stop/continue/pivot recommendations',
      'Operator dashboards + decision logs',
    ],
    priceRange: '$120k-$450k setup',
    recurring: '$15k-$75k / month',
    performanceFee: '0.5%-3% verified value uplift',
  },
  {
    id: 'phase_3',
    title: 'Phase 3: Plant Recovery Optimization',
    subtitle: 'Measurable recovery uplift',
    deliverables: [
      'Loss-to-tailings diagnosis + sampling strategy',
      'Control improvement and variability reduction',
      'Gold accounting KPI framework + coaching',
      'Optional advanced control integration via partners',
    ],
    priceRange: '$75k-$1.8M project scope',
    recurring: '$25k-$150k / month',
    performanceFee: '1%-5% incremental recovered value',
  },
  {
    id: 'enterprise',
    title: 'Enterprise: Remote Ops / Autonomy Readiness',
    subtitle: 'Large program delivery',
    deliverables: [
      'Site network readiness design (via partners)',
      'Control room blueprint + training + safety rules',
      'Fleet governance + dispatch integration',
      'OEM autonomy readiness pack',
    ],
    priceRange: '$200k-$5M+',
    recurring: '$50k-$250k / month retained support',
  },
];

export const MINING_BUNDLES: OfferBundle[] = [
  {
    id: 'A',
    name: 'Safety Stack',
    includes: ['Collision avoidance program (partner hardware)', 'Safety rules + training + reporting', 'Monthly audits + incident analytics'],
    setupPrice: '$150k-$900k',
    recurringPrice: '$5k-$40k / month',
  },
  {
    id: 'B',
    name: 'Fleet Optimization',
    includes: ['Dispatch/fleet workflow setup', 'Cycle-time improvement program', 'Operator coaching + monthly optimization'],
    setupPrice: '$250k-$1.2M',
    recurringPrice: '$15k-$100k / month',
  },
  {
    id: 'C',
    name: 'Geo-to-Drill Pack',
    includes: ['3D geology model + target scoring', 'Drill plan + phased roadmap', 'Continuous model updates as results arrive'],
    setupPrice: '$60k-$250k',
    recurringPrice: '$10k-$50k / month',
  },
  {
    id: 'D',
    name: 'Recovery Uplift',
    includes: ['Sampling + control stabilization', 'Analyzer/APC integrations via partners', 'Ongoing metallurgical reporting'],
    setupPrice: '$300k-$2M',
    recurringPrice: '$25k-$150k / month',
    performanceFee: '1%-5% incremental value',
  },
  {
    id: 'E',
    name: 'Autonomy Readiness',
    includes: ['Readiness assessment', 'Partner coordination', 'Rollout program governance'],
    setupPrice: '$200k-$5M+',
  },
];

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    name: 'Explorer',
    audience: 'Juniors, 1-2 projects',
    monthly: '$2k-$6k',
    setupFee: '$10k-$40k',
    features: ['Data room', 'Dashboards', 'Reporting templates'],
  },
  {
    name: 'Operator',
    audience: 'Single producing site',
    monthly: '$10k-$35k',
    setupFee: '$25k-$100k',
    features: ['Weekly KPI reporting', 'Model updates', 'Planning support'],
  },
  {
    name: 'Enterprise',
    audience: 'Multi-site group',
    monthly: '$40k-$150k',
    setupFee: '$50k-$150k',
    features: ['Multi-site analytics', 'SLA support', 'Custom pipelines', 'Governance'],
  },
];

export const RESELLER_MODEL = {
  licenseMargin: '10%-25% partner/reseller margin',
  implementationMargin: '30%-60% gross margin',
  managedOps: 'High-margin retainers after go-live',
};

export const REVENUE_SCENARIOS = [
  {
    title: 'Scenario 1: 10 Operator Sites',
    annualRange: '$8.7M+ / year',
    assumptions: [
      '10 x $25k/month operator plans',
      '10 phase-2 engagements at $250k avg',
      '4 plant uplift projects at $800k avg',
    ],
  },
  {
    title: 'Scenario 2: Group Contracts',
    annualRange: '$6M-$15M+ / year',
    assumptions: [
      '3 enterprise groups at $120k/month',
      'Rollout programs add $2M-$10M/year',
    ],
  },
];

export const COMING_SOON_MODULES = [
  {
    slug: 'field-ops-app',
    title: 'Field Ops App',
    quarter: 'Q3 2026',
    description: 'Offline-first sampling, photos, waypoint capture, and chain-of-custody workflows.',
    dependencies: ['Mobile device management', 'Offline sync conflict strategy', 'Field team onboarding'],
  },
  {
    slug: 'connector-hub',
    title: 'Connector Hub',
    quarter: 'Q3 2026',
    description: 'Integration layer for GIS formats, assay labs, drone outputs, and mine systems.',
    dependencies: ['Partner API access', 'Mapping contracts', 'Data contracts per source'],
  },
  {
    slug: 'compliance-governance',
    title: 'Compliance + Governance Toolkit',
    quarter: 'Q4 2026',
    description: 'Access controls, auditable decisions, ESG/community template packs.',
    dependencies: ['Legal templates', 'Policy sign-off', 'Role model hardening'],
  },
  {
    slug: 'partner-marketplace',
    title: 'Partner Marketplace + Reseller Portal',
    quarter: 'Q4 2026',
    description: 'Approved partner catalog, quote bundles, implementation checklists, and training.',
    dependencies: ['Partner agreements', 'SKU catalog', 'Commercial workflow'],
  },
  {
    slug: 'plant-optimization-ai',
    title: 'Plant Optimization AI',
    quarter: 'Q1 2027',
    description: 'Tailings-loss prediction and control recommendations tied to performance-fee contracts.',
    dependencies: ['Plant historian access', 'Control loop integration', 'Baseline performance period'],
  },
] as const;
