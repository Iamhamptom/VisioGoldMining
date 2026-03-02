// ============================================================================
// Mining Project Lifecycle Phases — DRC Gold Mining Intelligence Platform
// ============================================================================

export interface PhaseTask {
  name: string;
  department: string;
  durationDays: { min: number; max: number };
  deliverable: string;
}

export interface PhaseDocument {
  name: string;
  type: 'report' | 'permit' | 'plan' | 'study' | 'agreement' | 'application' | 'certificate';
  responsible: string;
  drcSpecific: boolean;
}

export interface TeamRole {
  role: string;
  count: number;
  localHire: boolean;
  estimatedCostPerMonth: number;
}

export interface PhaseRisk {
  category: string;
  description: string;
  likelihood: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high' | 'critical';
  mitigation: string;
}

export interface MiningPhase {
  id: number;
  name: string;
  slug: string;
  durationRange: { min: string; max: string };
  description: string;
  tasks: PhaseTask[];
  documents: PhaseDocument[];
  teamRequirements: TeamRole[];
  estimatedCost: { min: number; max: number; currency: string };
  risks: PhaseRisk[];
  milestones: string[];
  drcSpecific: string[];
  icon: string;
  color: string;
}

// ============================================================================
// Phase Definitions
// ============================================================================

export const MINING_PHASES: MiningPhase[] = [
  // --------------------------------------------------------------------------
  // Phase 1: Reconnaissance & Desktop Study
  // --------------------------------------------------------------------------
  {
    id: 1,
    name: 'Reconnaissance & Desktop Study',
    slug: 'reconnaissance-desktop-study',
    durationRange: { min: '1 month', max: '3 months' },
    description:
      'Initial evaluation of prospective gold-bearing areas across the DRC using satellite imagery, published geological maps, historical mining records from the CAMI cadastre, and open-source geochemical datasets to identify priority target zones.',
    tasks: [
      {
        name: 'Satellite imagery analysis and terrain mapping',
        department: 'Remote Sensing',
        durationDays: { min: 14, max: 30 },
        deliverable: 'Terrain classification map with lineament interpretation',
      },
      {
        name: 'Literature review of DRC geological surveys and BRGM reports',
        department: 'Geology',
        durationDays: { min: 10, max: 21 },
        deliverable: 'Geological synthesis report with target ranking matrix',
      },
      {
        name: 'CAMI mining cadastre title search and overlap analysis',
        department: 'Legal',
        durationDays: { min: 7, max: 14 },
        deliverable: 'Title status report and cadastre conflict assessment',
      },
      {
        name: 'Artisanal mining activity mapping from field intelligence',
        department: 'Community Relations',
        durationDays: { min: 14, max: 30 },
        deliverable: 'Artisanal activity heat map and stakeholder register',
      },
      {
        name: 'Preliminary security and access risk assessment',
        department: 'Security',
        durationDays: { min: 7, max: 14 },
        deliverable: 'Security risk matrix and logistics feasibility memo',
      },
    ],
    documents: [
      {
        name: 'Desktop Study Report',
        type: 'report',
        responsible: 'Chief Geologist',
        drcSpecific: false,
      },
      {
        name: 'CAMI Cadastre Search Certificate',
        type: 'certificate',
        responsible: 'Legal Counsel',
        drcSpecific: true,
      },
      {
        name: 'Target Prioritisation Plan',
        type: 'plan',
        responsible: 'Exploration Manager',
        drcSpecific: false,
      },
      {
        name: 'Security & Access Assessment',
        type: 'report',
        responsible: 'Security Manager',
        drcSpecific: true,
      },
    ],
    teamRequirements: [
      { role: 'Senior Geologist', count: 1, localHire: false, estimatedCostPerMonth: 18000 },
      { role: 'GIS / Remote Sensing Analyst', count: 1, localHire: false, estimatedCostPerMonth: 12000 },
      { role: 'Legal Advisor (DRC Mining Law)', count: 1, localHire: true, estimatedCostPerMonth: 8000 },
      { role: 'Security Consultant', count: 1, localHire: false, estimatedCostPerMonth: 15000 },
    ],
    estimatedCost: { min: 50000, max: 200000, currency: 'USD' },
    risks: [
      {
        category: 'Data Quality',
        description: 'Historical geological data for eastern DRC is sparse and often unreliable due to decades of conflict disrupting surveys.',
        likelihood: 'high',
        impact: 'medium',
        mitigation: 'Cross-reference multiple data sources including BRGM archives, academic publications, and modern satellite geochemistry.',
      },
      {
        category: 'Title Conflict',
        description: 'Overlapping or fraudulent mining titles in the CAMI cadastre system may encumber target areas.',
        likelihood: 'medium',
        impact: 'high',
        mitigation: 'Engage experienced DRC mining counsel to perform in-person cadastre verification in Kinshasa and provincial offices.',
      },
      {
        category: 'Security',
        description: 'Armed groups may control access to prospective areas, particularly in North Kivu, South Kivu, and Ituri provinces.',
        likelihood: 'medium',
        impact: 'critical',
        mitigation: 'Conduct thorough security due diligence through MONUSCO briefings and engage local security advisors before any field presence.',
      },
    ],
    milestones: [
      'Desktop geological synthesis completed',
      'CAMI title search confirmed clear or conflicts identified',
      'Target areas ranked and board approval for prospecting obtained',
      'Security clearance for field reconnaissance granted',
    ],
    drcSpecific: [
      'All cadastre searches must be conducted through the CAMI (Cadastre Minier) system in accordance with the 2018 Mining Code amendments.',
      'Areas within or adjacent to Kahuzi-Biega, Virunga, or other national parks require additional ICCN (Institut Congolais pour la Conservation de la Nature) clearance.',
      'Conflict mineral due diligence per OECD guidelines and DRC traceability requirements must be initiated at this stage.',
    ],
    icon: 'Search',
    color: '#4488FF',
  },

  // --------------------------------------------------------------------------
  // Phase 2: Prospecting & Early Exploration
  // --------------------------------------------------------------------------
  {
    id: 2,
    name: 'Prospecting & Early Exploration',
    slug: 'prospecting-early-exploration',
    durationRange: { min: '3 months', max: '12 months' },
    description:
      'Ground-truthing of desktop targets through field mapping, stream sediment sampling, soil geochemistry, and initial geophysical surveys to confirm gold anomalies and define drill-ready targets across the concession.',
    tasks: [
      {
        name: 'Geological field mapping and structural interpretation',
        department: 'Geology',
        durationDays: { min: 30, max: 90 },
        deliverable: '1:10,000 scale geological map with structural overlays',
      },
      {
        name: 'Stream sediment and soil geochemistry sampling campaigns',
        department: 'Geochemistry',
        durationDays: { min: 30, max: 120 },
        deliverable: 'Geochemical anomaly maps with statistical analysis report',
      },
      {
        name: 'Ground-based geophysical surveys (magnetics, IP/resistivity)',
        department: 'Geophysics',
        durationDays: { min: 30, max: 90 },
        deliverable: 'Geophysical interpretation report with drill target recommendations',
      },
      {
        name: 'Community engagement and social baseline initiation',
        department: 'Community Relations',
        durationDays: { min: 30, max: 120 },
        deliverable: 'Community engagement log and preliminary social baseline report',
      },
      {
        name: 'Establishment of field camp and logistics infrastructure',
        department: 'Operations',
        durationDays: { min: 14, max: 45 },
        deliverable: 'Operational field camp with communications and supply chain established',
      },
      {
        name: 'Obtain Prospecting Permit (PR) from CAMI',
        department: 'Legal',
        durationDays: { min: 30, max: 90 },
        deliverable: 'Granted Prospecting Permit registered in CAMI cadastre',
      },
    ],
    documents: [
      {
        name: 'Prospecting Permit (Permis de Recherches)',
        type: 'permit',
        responsible: 'Legal Counsel',
        drcSpecific: true,
      },
      {
        name: 'Early-Stage Exploration Report',
        type: 'report',
        responsible: 'Exploration Manager',
        drcSpecific: false,
      },
      {
        name: 'Community Engagement Plan',
        type: 'plan',
        responsible: 'Community Relations Manager',
        drcSpecific: false,
      },
      {
        name: 'Environmental Screening Report',
        type: 'report',
        responsible: 'Environmental Officer',
        drcSpecific: true,
      },
    ],
    teamRequirements: [
      { role: 'Exploration Manager', count: 1, localHire: false, estimatedCostPerMonth: 22000 },
      { role: 'Field Geologist', count: 2, localHire: false, estimatedCostPerMonth: 14000 },
      { role: 'Geochemistry Technician', count: 2, localHire: true, estimatedCostPerMonth: 3500 },
      { role: 'Community Liaison Officer', count: 1, localHire: true, estimatedCostPerMonth: 2500 },
      { role: 'Camp Manager / Logistics Coordinator', count: 1, localHire: true, estimatedCostPerMonth: 4000 },
    ],
    estimatedCost: { min: 500000, max: 3000000, currency: 'USD' },
    risks: [
      {
        category: 'Access & Logistics',
        description: 'Road infrastructure in eastern DRC deteriorates severely during rainy seasons (Sep-Nov, Mar-May), potentially halting fieldwork for weeks.',
        likelihood: 'high',
        impact: 'medium',
        mitigation: 'Plan field campaigns around dry seasons; pre-position critical supplies; maintain helicopter evacuation contracts.',
      },
      {
        category: 'Community Relations',
        description: 'Artisanal miners (orpailleurs) operating within the concession may resist formal exploration activities.',
        likelihood: 'high',
        impact: 'high',
        mitigation: 'Establish early and transparent community dialogue; consider artisanal mining coexistence frameworks per DRC Mining Code Article 109.',
      },
      {
        category: 'Regulatory',
        description: 'Prospecting permit applications may face delays at CAMI due to administrative backlog or competing applications.',
        likelihood: 'medium',
        impact: 'high',
        mitigation: 'Engage well-connected local legal counsel and maintain regular follow-ups at the CAMI office in Kinshasa.',
      },
    ],
    milestones: [
      'Prospecting Permit (PR) granted by CAMI',
      'First-pass geochemistry results confirm gold anomalies',
      'Geophysical survey completed with drill targets defined',
      'Community engagement framework established and documented',
    ],
    drcSpecific: [
      'Prospecting Permits (Permis de Recherches) are valid for 5 years and renewable twice under the 2018 Mining Code; annual minimum expenditure commitments apply.',
      'All sample exports for assay must be declared to the Division des Mines and accompanied by a mineral transport permit (Autorisation de Transport).',
      'Engagement with customary chiefs (chefs coutumiers) is essential alongside formal local government authorities for community access.',
    ],
    icon: 'Compass',
    color: '#A78BFA',
  },

  // --------------------------------------------------------------------------
  // Phase 3: Advanced Exploration & Resource Definition
  // --------------------------------------------------------------------------
  {
    id: 3,
    name: 'Advanced Exploration & Resource Definition',
    slug: 'advanced-exploration-resource-definition',
    durationRange: { min: '1 year', max: '3 years' },
    description:
      'Systematic diamond and RC drilling programs to delineate gold mineralisation, establish a JORC/NI 43-101 compliant Mineral Resource estimate, and generate the geological model that underpins feasibility evaluation.',
    tasks: [
      {
        name: 'Diamond drilling program design and execution',
        department: 'Geology',
        durationDays: { min: 180, max: 720 },
        deliverable: 'Drill core database with assay results and geological logs',
      },
      {
        name: 'RC drilling for infill and grade control',
        department: 'Geology',
        durationDays: { min: 90, max: 360 },
        deliverable: 'RC chip samples with assay results and geological interpretations',
      },
      {
        name: 'Geological modelling and Mineral Resource estimation',
        department: 'Resource Geology',
        durationDays: { min: 60, max: 180 },
        deliverable: 'JORC/NI 43-101 compliant Mineral Resource statement',
      },
      {
        name: 'Metallurgical test work on drill core composites',
        department: 'Metallurgy',
        durationDays: { min: 90, max: 270 },
        deliverable: 'Preliminary metallurgical recovery report with flowsheet options',
      },
      {
        name: 'Environmental baseline data collection',
        department: 'Environment',
        durationDays: { min: 365, max: 730 },
        deliverable: 'Environmental baseline dataset covering wet and dry seasons',
      },
    ],
    documents: [
      {
        name: 'Mineral Resource Estimate (JORC/NI 43-101)',
        type: 'report',
        responsible: 'Competent Person / QP',
        drcSpecific: false,
      },
      {
        name: 'Exploration Results Technical Report',
        type: 'report',
        responsible: 'Exploration Manager',
        drcSpecific: false,
      },
      {
        name: 'Environmental Baseline Study',
        type: 'study',
        responsible: 'Environmental Manager',
        drcSpecific: true,
      },
    ],
    teamRequirements: [
      { role: 'Principal Geologist / Resource Modeller', count: 1, localHire: false, estimatedCostPerMonth: 25000 },
      { role: 'Senior Drill Geologist', count: 2, localHire: false, estimatedCostPerMonth: 16000 },
      { role: 'Core Logging Geologist', count: 3, localHire: true, estimatedCostPerMonth: 4500 },
      { role: 'Environmental Scientist', count: 1, localHire: false, estimatedCostPerMonth: 14000 },
      { role: 'Drill Crew (per rig)', count: 8, localHire: true, estimatedCostPerMonth: 2000 },
    ],
    estimatedCost: { min: 5000000, max: 30000000, currency: 'USD' },
    risks: [
      {
        category: 'Geological',
        description: 'Orogenic gold deposits in the Kibali greenstone belt can be structurally complex with erratic high grades, making resource estimation challenging.',
        likelihood: 'medium',
        impact: 'high',
        mitigation: 'Apply appropriate top-cutting and compositing strategies; use multiple estimation methods (OK, ID2, MIK) for cross-validation.',
      },
      {
        category: 'Operational',
        description: 'Drilling contractors face long mobilisation times and high costs to reach remote DRC sites; equipment breakdowns can cause extended standby.',
        likelihood: 'high',
        impact: 'medium',
        mitigation: 'Contract rigs with proven DRC track records; stockpile critical spares on-site; maintain backup rig availability clauses.',
      },
      {
        category: 'Environmental',
        description: 'Drilling near waterways may trigger concerns from the Agence Congolaise de lEnvironnement (ACE) or downstream communities.',
        likelihood: 'medium',
        impact: 'medium',
        mitigation: 'Implement best-practice drill site management with containment sumps; maintain regular reporting to ACE throughout field operations.',
      },
    ],
    milestones: [
      'First drill hole completed and assay results received',
      'Maiden Mineral Resource estimate published',
      'Metallurgical test work confirms viable gold recovery above 85%',
      'Environmental baseline dataset complete for two full seasons',
    ],
    drcSpecific: [
      'All drill core must be stored in-country; export of representative samples for assay requires Division des Mines authorisation and export permits.',
      'The Mineral Resource estimate must be reported by a Competent Person recognized under an accepted reporting code (JORC, NI 43-101, SAMREC) to satisfy both investor and DRC regulatory requirements.',
      'Annual exploration expenditure and work programs must be submitted to the Direction des Mines as a condition of the Prospecting Permit.',
    ],
    icon: 'Drill',
    color: '#00FF88',
  },

  // --------------------------------------------------------------------------
  // Phase 4: Pre-Feasibility Study
  // --------------------------------------------------------------------------
  {
    id: 4,
    name: 'Pre-Feasibility Study',
    slug: 'pre-feasibility-study',
    durationRange: { min: '6 months', max: '12 months' },
    description:
      'Intermediate technical and economic evaluation that converts the Mineral Resource into a preliminary mine plan, assesses processing routes, and determines whether the project warrants the investment required for a full Definitive Feasibility Study.',
    tasks: [
      {
        name: 'Preliminary mine design and production scheduling',
        department: 'Mining Engineering',
        durationDays: { min: 60, max: 120 },
        deliverable: 'Conceptual mine plan with pit optimisation or underground design scenarios',
      },
      {
        name: 'Process flowsheet development and trade-off studies',
        department: 'Metallurgy / Process Engineering',
        durationDays: { min: 60, max: 120 },
        deliverable: 'Process design criteria document with equipment sizing estimates',
      },
      {
        name: 'Infrastructure and logistics assessment',
        department: 'Engineering',
        durationDays: { min: 45, max: 90 },
        deliverable: 'Infrastructure concept report covering power, water, roads, and airstrip',
      },
      {
        name: 'Capital and operating cost estimation (Class 4)',
        department: 'Cost Engineering',
        durationDays: { min: 30, max: 60 },
        deliverable: 'Class 4 cost estimate (+/- 30% accuracy) with key assumptions',
      },
      {
        name: 'Financial modelling and economic analysis',
        department: 'Finance',
        durationDays: { min: 30, max: 60 },
        deliverable: 'Pre-feasibility financial model with NPV, IRR, and sensitivity analysis',
      },
    ],
    documents: [
      {
        name: 'Pre-Feasibility Study Report',
        type: 'study',
        responsible: 'Study Manager',
        drcSpecific: false,
      },
      {
        name: 'Preliminary Economic Assessment',
        type: 'report',
        responsible: 'Financial Analyst',
        drcSpecific: false,
      },
      {
        name: 'DRC Fiscal Regime Analysis',
        type: 'study',
        responsible: 'Tax Advisor',
        drcSpecific: true,
      },
      {
        name: 'Mineral Reserve Conversion Report (Probable)',
        type: 'report',
        responsible: 'Competent Person / QP',
        drcSpecific: false,
      },
    ],
    teamRequirements: [
      { role: 'Study Manager', count: 1, localHire: false, estimatedCostPerMonth: 28000 },
      { role: 'Mining Engineer', count: 2, localHire: false, estimatedCostPerMonth: 18000 },
      { role: 'Process Engineer', count: 1, localHire: false, estimatedCostPerMonth: 20000 },
      { role: 'Cost / Financial Analyst', count: 1, localHire: false, estimatedCostPerMonth: 16000 },
    ],
    estimatedCost: { min: 2000000, max: 8000000, currency: 'USD' },
    risks: [
      {
        category: 'Economic',
        description: 'Gold price volatility may significantly shift project economics between study completion and investment decision.',
        likelihood: 'medium',
        impact: 'high',
        mitigation: 'Run sensitivity analysis across a wide gold price range ($1,500-$2,500/oz); identify breakeven price and communicate to board.',
      },
      {
        category: 'Technical',
        description: 'Refractory gold mineralogy may require more expensive processing (POX, BIOX) than simple CIL, materially increasing capital costs.',
        likelihood: 'medium',
        impact: 'high',
        mitigation: 'Complete detailed mineralogical characterisation and variability test work before committing to a process route.',
      },
      {
        category: 'Fiscal',
        description: 'DRC fiscal regime under the 2018 Mining Code (10% royalty on gold) may reduce project returns below investor thresholds.',
        likelihood: 'low',
        impact: 'high',
        mitigation: 'Model DRC-specific taxes comprehensively including super-profit tax and evaluate eligibility for Mining Convention benefits.',
      },
    ],
    milestones: [
      'Preliminary mine plan and production schedule completed',
      'Process route selected based on trade-off study outcomes',
      'Class 4 capital cost estimate delivered within target accuracy',
      'Board decision on advancement to Definitive Feasibility Study',
    ],
    drcSpecific: [
      'The financial model must incorporate the full DRC fiscal framework: 10% gold royalty, 30% corporate tax, 50% super-profit tax, and 10% free-carried state equity per the 2018 Mining Code.',
      'Power supply analysis must evaluate SNEL grid availability versus self-generation (HFO, solar-hybrid) given unreliable grid supply in most mining provinces.',
      'Transport logistics should model both road-to-Mombasa and road-to-Dar-es-Salaam export corridors for dore bullion.',
    ],
    icon: 'Calculator',
    color: '#FFD700',
  },

  // --------------------------------------------------------------------------
  // Phase 5: Definitive Feasibility Study
  // --------------------------------------------------------------------------
  {
    id: 5,
    name: 'Definitive Feasibility Study',
    slug: 'definitive-feasibility-study',
    durationRange: { min: '12 months', max: '18 months' },
    description:
      'Comprehensive bankable study that provides the technical, environmental, social, and financial basis for a final investment decision. Delivers Class 3 cost estimates and detailed engineering sufficient for project financing.',
    tasks: [
      {
        name: 'Detailed mine design with Ore Reserve estimation',
        department: 'Mining Engineering',
        durationDays: { min: 120, max: 180 },
        deliverable: 'Definitive mine plan with Proved and Probable Ore Reserves and life-of-mine schedule',
      },
      {
        name: 'Detailed process plant engineering and design',
        department: 'Process Engineering',
        durationDays: { min: 150, max: 270 },
        deliverable: 'Process design package with P&IDs, equipment specifications, and layout drawings',
      },
      {
        name: 'Environmental and Social Impact Assessment (ESIA)',
        department: 'Environment & Social',
        durationDays: { min: 180, max: 360 },
        deliverable: 'ESIA report compliant with DRC regulations and IFC Performance Standards',
      },
      {
        name: 'Class 3 capital and operating cost estimation',
        department: 'Cost Engineering',
        durationDays: { min: 60, max: 120 },
        deliverable: 'Class 3 cost estimate (+/- 15% accuracy) with vendor quotes and benchmarks',
      },
      {
        name: 'Bankable financial model and project valuation',
        department: 'Finance',
        durationDays: { min: 60, max: 90 },
        deliverable: 'Bankable financial model with debt sizing, equity returns, and risk-adjusted scenarios',
      },
      {
        name: 'Resettlement Action Plan (if applicable)',
        department: 'Social / Community',
        durationDays: { min: 120, max: 270 },
        deliverable: 'RAP compliant with IFC PS5 and DRC law with livelihood restoration framework',
      },
    ],
    documents: [
      {
        name: 'Definitive Feasibility Study Report',
        type: 'study',
        responsible: 'Study Director',
        drcSpecific: false,
      },
      {
        name: 'Environmental and Social Impact Assessment (ESIA)',
        type: 'study',
        responsible: 'Environmental Lead',
        drcSpecific: true,
      },
      {
        name: 'Resettlement Action Plan',
        type: 'plan',
        responsible: 'Social Manager',
        drcSpecific: true,
      },
      {
        name: 'Ore Reserve Statement (JORC/NI 43-101)',
        type: 'report',
        responsible: 'Competent Person / QP',
        drcSpecific: false,
      },
    ],
    teamRequirements: [
      { role: 'Study Director', count: 1, localHire: false, estimatedCostPerMonth: 35000 },
      { role: 'Senior Mining Engineer', count: 2, localHire: false, estimatedCostPerMonth: 22000 },
      { role: 'Process Design Engineer', count: 2, localHire: false, estimatedCostPerMonth: 22000 },
      { role: 'ESIA Lead Consultant', count: 1, localHire: false, estimatedCostPerMonth: 20000 },
      { role: 'DRC Social / Resettlement Specialist', count: 1, localHire: true, estimatedCostPerMonth: 8000 },
    ],
    estimatedCost: { min: 10000000, max: 30000000, currency: 'USD' },
    risks: [
      {
        category: 'Technical',
        description: 'Geotechnical conditions may differ from assumptions, requiring steeper or shallower pit slopes that significantly alter strip ratios and economics.',
        likelihood: 'medium',
        impact: 'high',
        mitigation: 'Complete comprehensive geotechnical drilling and laboratory testing program to support detailed slope stability analysis.',
      },
      {
        category: 'Social',
        description: 'Physical or economic displacement of communities may trigger opposition and delay project timelines if not managed to international standards.',
        likelihood: 'medium',
        impact: 'critical',
        mitigation: 'Engage an experienced resettlement consultant early; follow IFC Performance Standard 5 and conduct transparent community consultations.',
      },
      {
        category: 'Schedule',
        description: 'ESIA approval process through ACE can take 12+ months and is subject to political and administrative delays.',
        likelihood: 'high',
        impact: 'high',
        mitigation: 'Begin ESIA process as early as possible; maintain proactive engagement with ACE reviewers; budget for additional public consultation rounds.',
      },
    ],
    milestones: [
      'Ore Reserve statement with Proved and Probable categories published',
      'ESIA submitted to Agence Congolaise de lEnvironnement (ACE)',
      'Class 3 cost estimate completed and peer-reviewed',
      'Final Investment Decision by board and shareholders',
    ],
    drcSpecific: [
      'The ESIA must be submitted to ACE and undergo public consultation per DRC environmental regulations; approval is a prerequisite for the Exploitation Permit.',
      'The Resettlement Action Plan must comply with both DRC Law No. 77-001 on expropriation and IFC Performance Standard 5 to satisfy international lenders.',
      'Water use and discharge plans must be approved by the provincial water authority in addition to ACE environmental certification.',
    ],
    icon: 'FileText',
    color: '#FF8800',
  },

  // --------------------------------------------------------------------------
  // Phase 6: Permitting & Regulatory Approvals
  // --------------------------------------------------------------------------
  {
    id: 6,
    name: 'Permitting & Regulatory Approvals',
    slug: 'permitting-regulatory-approvals',
    durationRange: { min: '12 months', max: '36 months' },
    description:
      'Securing all government permits, licences, and regulatory approvals required to develop and operate a gold mine in the DRC, including conversion from Prospecting to Exploitation Permit and environmental certification.',
    tasks: [
      {
        name: 'Exploitation Permit (PE) application to CAMI',
        department: 'Legal',
        durationDays: { min: 90, max: 365 },
        deliverable: 'Granted Exploitation Permit (Permis dExploitation) registered in CAMI cadastre',
      },
      {
        name: 'Environmental Certificate of Compliance from ACE',
        department: 'Environment',
        durationDays: { min: 120, max: 365 },
        deliverable: 'ACE Environmental Certificate enabling construction activities',
      },
      {
        name: 'Negotiation of Mining Convention with DRC Government',
        department: 'Legal / Government Relations',
        durationDays: { min: 180, max: 720 },
        deliverable: 'Signed Mining Convention providing fiscal stability and operating terms',
      },
      {
        name: 'Provincial and local government consultations and approvals',
        department: 'Government Relations',
        durationDays: { min: 60, max: 180 },
        deliverable: 'Provincial government endorsement letters and local operating agreements',
      },
      {
        name: 'Free, Prior, and Informed Consent (FPIC) process with affected communities',
        department: 'Community Relations',
        durationDays: { min: 90, max: 270 },
        deliverable: 'Documented FPIC process outcomes and community benefit agreements',
      },
    ],
    documents: [
      {
        name: 'Exploitation Permit (Permis dExploitation)',
        type: 'permit',
        responsible: 'Legal Director',
        drcSpecific: true,
      },
      {
        name: 'ACE Environmental Certificate',
        type: 'certificate',
        responsible: 'Environmental Manager',
        drcSpecific: true,
      },
      {
        name: 'Mining Convention (Convention Miniere)',
        type: 'agreement',
        responsible: 'Legal Director',
        drcSpecific: true,
      },
      {
        name: 'Community Development Agreement',
        type: 'agreement',
        responsible: 'Community Relations Manager',
        drcSpecific: true,
      },
    ],
    teamRequirements: [
      { role: 'Legal Director (DRC Mining Law)', count: 1, localHire: false, estimatedCostPerMonth: 30000 },
      { role: 'DRC Government Relations Advisor', count: 1, localHire: true, estimatedCostPerMonth: 10000 },
      { role: 'Environmental Permitting Specialist', count: 1, localHire: false, estimatedCostPerMonth: 16000 },
      { role: 'Community Relations Manager', count: 1, localHire: true, estimatedCostPerMonth: 6000 },
      { role: 'Kinshasa-based Administrative Coordinator', count: 1, localHire: true, estimatedCostPerMonth: 4000 },
    ],
    estimatedCost: { min: 2000000, max: 10000000, currency: 'USD' },
    risks: [
      {
        category: 'Regulatory',
        description: 'Exploitation Permit approval can be delayed by inter-ministerial coordination failures or changes in political leadership.',
        likelihood: 'high',
        impact: 'critical',
        mitigation: 'Maintain presence in Kinshasa with experienced government relations team; engage at both ministerial and technical levels.',
      },
      {
        category: 'Political',
        description: 'Changes in mining policy or government attempts to renegotiate fiscal terms may alter the economic framework.',
        likelihood: 'medium',
        impact: 'critical',
        mitigation: 'Negotiate a Mining Convention with fiscal stability clauses; maintain constructive government relationships at multiple levels.',
      },
      {
        category: 'Community',
        description: 'Inadequate community consultation may lead to legal challenges, blockades, or reputational damage with international investors.',
        likelihood: 'medium',
        impact: 'high',
        mitigation: 'Implement robust FPIC processes aligned with IFC standards; ensure transparent benefit-sharing through Community Development Agreements.',
      },
    ],
    milestones: [
      'Exploitation Permit granted by CAMI and gazetted',
      'Environmental Certificate issued by ACE',
      'Mining Convention signed with DRC Government',
      'Community Development Agreement executed with affected communities',
    ],
    drcSpecific: [
      'The Exploitation Permit application requires submission of a feasibility study, ESIA, environmental management plan, and proof of financial capacity to CAMI.',
      'The DRC Government is entitled to 10% free-carried equity in the mining company under the 2018 Mining Code, with an option to acquire an additional 5%.',
      'A Community Development Fund (Cahier des Charges) must be established, funded at 0.3% of revenue, and governed jointly with local communities.',
    ],
    icon: 'Shield',
    color: '#FF4444',
  },

  // --------------------------------------------------------------------------
  // Phase 7: Financing & Deal Structuring
  // --------------------------------------------------------------------------
  {
    id: 7,
    name: 'Financing & Deal Structuring',
    slug: 'financing-deal-structuring',
    durationRange: { min: '6 months', max: '18 months' },
    description:
      'Securing project finance through a combination of equity, debt, and streaming/royalty arrangements, while structuring the corporate and operating entities to optimise the DRC fiscal regime and satisfy lender requirements.',
    tasks: [
      {
        name: 'Preparation of Information Memorandum for lenders and investors',
        department: 'Finance',
        durationDays: { min: 30, max: 60 },
        deliverable: 'Confidential Information Memorandum with project summary and financial projections',
      },
      {
        name: 'Lender due diligence and independent technical review',
        department: 'Finance / Technical',
        durationDays: { min: 60, max: 180 },
        deliverable: 'Lender technical advisors report and due diligence completion certificate',
      },
      {
        name: 'Negotiate project finance term sheet and credit agreements',
        department: 'Finance / Legal',
        durationDays: { min: 90, max: 270 },
        deliverable: 'Signed credit facility agreements and security documentation',
      },
      {
        name: 'Corporate structuring and DRC entity establishment',
        department: 'Legal / Tax',
        durationDays: { min: 30, max: 90 },
        deliverable: 'Incorporated DRC operating entity (SARL) with appropriate holding structure',
      },
    ],
    documents: [
      {
        name: 'Confidential Information Memorandum',
        type: 'report',
        responsible: 'CFO',
        drcSpecific: false,
      },
      {
        name: 'Project Finance Credit Agreement',
        type: 'agreement',
        responsible: 'Legal Director',
        drcSpecific: false,
      },
      {
        name: 'DRC Entity Incorporation Documents',
        type: 'certificate',
        responsible: 'Legal Counsel',
        drcSpecific: true,
      },
      {
        name: 'Equator Principles Compliance Assessment',
        type: 'report',
        responsible: 'Environmental & Social Manager',
        drcSpecific: false,
      },
    ],
    teamRequirements: [
      { role: 'Chief Financial Officer', count: 1, localHire: false, estimatedCostPerMonth: 40000 },
      { role: 'Project Finance Advisor', count: 1, localHire: false, estimatedCostPerMonth: 35000 },
      { role: 'International Mining Tax Counsel', count: 1, localHire: false, estimatedCostPerMonth: 30000 },
    ],
    estimatedCost: { min: 1000000, max: 5000000, currency: 'USD' },
    risks: [
      {
        category: 'Financial',
        description: 'DRC sovereign risk perception may increase lending margins by 200-400bps compared to more stable jurisdictions.',
        likelihood: 'high',
        impact: 'medium',
        mitigation: 'Engage development finance institutions (IFC, AfDB, DEG) alongside commercial banks to signal confidence and reduce pricing.',
      },
      {
        category: 'Legal',
        description: 'Uncertainty around DRC tax enforcement and transfer pricing regulations may create structuring complexity.',
        likelihood: 'medium',
        impact: 'medium',
        mitigation: 'Obtain advance pricing agreements where possible; structure inter-company arrangements to be defensible under OECD guidelines.',
      },
    ],
    milestones: [
      'Lender due diligence completed with satisfactory outcomes',
      'Term sheet signed with lead arranging bank or syndicate',
      'Financial close achieved with all conditions precedent satisfied',
      'DRC operating entity (SARL) fully incorporated and capitalised',
    ],
    drcSpecific: [
      'The DRC operating entity must be a Societe a Responsabilite Limitee (SARL) registered with the RCCM (Registre du Commerce et du Credit Mobilier) and the mining cadastre.',
      'Lenders will require political risk insurance (MIGA, ATI) given DRC country risk; this adds 1-2% to total financing costs.',
      'Repatriation of dividends and loan repayments must comply with Central Bank of Congo (BCC) foreign exchange regulations.',
    ],
    icon: 'DollarSign',
    color: '#D4AF37',
  },

  // --------------------------------------------------------------------------
  // Phase 8: Construction & Development
  // --------------------------------------------------------------------------
  {
    id: 8,
    name: 'Construction & Development',
    slug: 'construction-development',
    durationRange: { min: '18 months', max: '36 months' },
    description:
      'Full-scale construction of the mine, processing plant, tailings storage facility, and supporting infrastructure. Includes equipment procurement, installation, commissioning, and recruitment of the operational workforce.',
    tasks: [
      {
        name: 'Detailed engineering and procurement (EPCM or EPC)',
        department: 'Engineering',
        durationDays: { min: 180, max: 360 },
        deliverable: 'Completed detailed engineering packages and all major equipment procured',
      },
      {
        name: 'Process plant construction and mechanical completion',
        department: 'Construction',
        durationDays: { min: 360, max: 720 },
        deliverable: 'Mechanically complete process plant ready for commissioning',
      },
      {
        name: 'Mine pre-stripping or underground development',
        department: 'Mining',
        durationDays: { min: 180, max: 540 },
        deliverable: 'Initial ore stockpile available for plant commissioning feed',
      },
      {
        name: 'Tailings Storage Facility (TSF) construction',
        department: 'Engineering',
        durationDays: { min: 180, max: 360 },
        deliverable: 'TSF Stage 1 constructed and certified for initial operation',
      },
      {
        name: 'Workforce recruitment, training, and mobilisation',
        department: 'Human Resources',
        durationDays: { min: 120, max: 270 },
        deliverable: 'Full operational workforce recruited, trained, and site-inducted',
      },
      {
        name: 'Plant commissioning and ramp-up to nameplate capacity',
        department: 'Operations / Process',
        durationDays: { min: 90, max: 270 },
        deliverable: 'Processing plant operating at or above 80% of nameplate throughput',
      },
    ],
    documents: [
      {
        name: 'Construction Completion Certificate',
        type: 'certificate',
        responsible: 'Construction Manager',
        drcSpecific: false,
      },
      {
        name: 'DRC Import Duty Exemption Applications',
        type: 'application',
        responsible: 'Logistics / Customs Manager',
        drcSpecific: true,
      },
      {
        name: 'Environmental Management Plan (Construction Phase)',
        type: 'plan',
        responsible: 'Environmental Manager',
        drcSpecific: true,
      },
      {
        name: 'Commissioning and Ramp-Up Report',
        type: 'report',
        responsible: 'Plant Manager',
        drcSpecific: false,
      },
    ],
    teamRequirements: [
      { role: 'Project / Construction Manager', count: 1, localHire: false, estimatedCostPerMonth: 40000 },
      { role: 'Site Engineers (civil, mechanical, electrical)', count: 6, localHire: false, estimatedCostPerMonth: 18000 },
      { role: 'Construction Supervisors', count: 8, localHire: true, estimatedCostPerMonth: 5000 },
      { role: 'Skilled Tradespeople (welders, electricians, fitters)', count: 50, localHire: true, estimatedCostPerMonth: 2500 },
      { role: 'HSE Manager and Officers', count: 3, localHire: false, estimatedCostPerMonth: 16000 },
    ],
    estimatedCost: { min: 100000000, max: 1000000000, currency: 'USD' },
    risks: [
      {
        category: 'Construction',
        description: 'Logistics challenges importing heavy equipment through Dar-es-Salaam or Mombasa ports and overland to site can cause schedule overruns.',
        likelihood: 'high',
        impact: 'high',
        mitigation: 'Engage experienced DRC logistics providers; pre-clear customs documentation; maintain 3-month buffer stock of critical materials.',
      },
      {
        category: 'Cost',
        description: 'Exchange rate fluctuations between USD and CDF, combined with DRC import duties, may inflate construction costs beyond estimates.',
        likelihood: 'medium',
        impact: 'high',
        mitigation: 'Apply for mining code import duty exemptions for capital equipment; hedge major foreign currency exposures where practical.',
      },
      {
        category: 'Safety',
        description: 'Construction in remote areas with a largely inexperienced local workforce increases the risk of safety incidents.',
        likelihood: 'medium',
        impact: 'critical',
        mitigation: 'Implement rigorous safety induction and ongoing training; deploy experienced HSE supervision; enforce zero-tolerance safety culture.',
      },
    ],
    milestones: [
      'First concrete pour for process plant foundations',
      'Major equipment delivered and installed on-site',
      'Mechanical completion of process plant achieved',
      'First gold poured during commissioning phase',
    ],
    drcSpecific: [
      'The 2018 Mining Code provides customs duty exemptions on imported capital equipment during construction, but applications must be filed with DGDA (Direction Generale des Douanes et Accises) and approved by the Ministry of Mines.',
      'DRC labour law requires a minimum 90% Congolese workforce ratio for unskilled positions and progressive localisation targets for skilled and management roles.',
      'All construction must comply with DRC building codes and the environmental management plan approved by ACE; monthly compliance reporting is mandatory.',
    ],
    icon: 'HardHat',
    color: '#4488FF',
  },

  // --------------------------------------------------------------------------
  // Phase 9: Production & Operations
  // --------------------------------------------------------------------------
  {
    id: 9,
    name: 'Production & Operations',
    slug: 'production-operations',
    durationRange: { min: '10 years', max: '30 years' },
    description:
      'Steady-state mining and processing operations to extract and process gold ore, pour dore bars, and generate returns for shareholders while maintaining environmental compliance, community commitments, and workforce safety standards.',
    tasks: [
      {
        name: 'Ongoing mine planning and grade control',
        department: 'Mining / Geology',
        durationDays: { min: 3650, max: 10950 },
        deliverable: 'Monthly mine plans, reconciliation reports, and updated resource models',
      },
      {
        name: 'Process plant optimisation and throughput management',
        department: 'Processing',
        durationDays: { min: 3650, max: 10950 },
        deliverable: 'Sustained gold recovery above target and throughput at or above nameplate',
      },
      {
        name: 'Gold dore production, security, and export logistics',
        department: 'Operations / Security',
        durationDays: { min: 3650, max: 10950 },
        deliverable: 'Regular dore shipments to refinery with full chain-of-custody documentation',
      },
      {
        name: 'Environmental monitoring and compliance reporting',
        department: 'Environment',
        durationDays: { min: 3650, max: 10950 },
        deliverable: 'Quarterly environmental monitoring reports submitted to ACE',
      },
      {
        name: 'Community development program implementation',
        department: 'Community Relations',
        durationDays: { min: 3650, max: 10950 },
        deliverable: 'Annual community development reports and fund disbursement records',
      },
    ],
    documents: [
      {
        name: 'Annual Mining Report to Direction des Mines',
        type: 'report',
        responsible: 'General Manager',
        drcSpecific: true,
      },
      {
        name: 'Quarterly Environmental Compliance Report',
        type: 'report',
        responsible: 'Environmental Manager',
        drcSpecific: true,
      },
      {
        name: 'Annual Community Development Fund Report',
        type: 'report',
        responsible: 'Community Relations Manager',
        drcSpecific: true,
      },
    ],
    teamRequirements: [
      { role: 'General Manager', count: 1, localHire: false, estimatedCostPerMonth: 45000 },
      { role: 'Mining Operations Manager', count: 1, localHire: false, estimatedCostPerMonth: 30000 },
      { role: 'Plant / Processing Manager', count: 1, localHire: false, estimatedCostPerMonth: 28000 },
      { role: 'Operational Workforce (miners, operators, technicians)', count: 300, localHire: true, estimatedCostPerMonth: 1500 },
      { role: 'HSE Department', count: 5, localHire: true, estimatedCostPerMonth: 4000 },
    ],
    estimatedCost: { min: 50000000, max: 150000000, currency: 'USD' },
    risks: [
      {
        category: 'Commodity Price',
        description: 'Sustained low gold prices below the operations all-in sustaining cost (AISC) may render the mine uneconomic.',
        likelihood: 'low',
        impact: 'critical',
        mitigation: 'Maintain a low-cost operating profile through continuous improvement; implement selective hedging strategy for portion of production.',
      },
      {
        category: 'Operational',
        description: 'Equipment availability and maintenance challenges in remote DRC locations can reduce throughput and increase unit costs.',
        likelihood: 'medium',
        impact: 'medium',
        mitigation: 'Establish comprehensive preventive maintenance programs; maintain critical spares inventory; develop local technical training programs.',
      },
      {
        category: 'Political / Regulatory',
        description: 'Changes to the DRC mining code, royalty rates, or tax regime may materially impact operating margins.',
        likelihood: 'medium',
        impact: 'high',
        mitigation: 'Maintain active participation in the Chamber of Mines (FEC Mining Commission); leverage Mining Convention stability clauses where applicable.',
      },
    ],
    milestones: [
      'Nameplate production capacity achieved and sustained',
      'First full year of commercial production completed',
      'Cumulative gold production exceeds 1 million ounces',
      'Life-of-mine extension through successful near-mine exploration',
    ],
    drcSpecific: [
      'Gold dore exports require an export permit from the Division des Mines and must be processed through CEEC (Centre dExpertise, dEvaluation et de Certification) for valuation and certification.',
      'Quarterly royalty payments (10% of gold value at export) must be made to the DGRAD (Direction Generale des Recettes Administratives) with copies to the provincial government.',
      'The mine must contribute 0.3% of turnover to the Community Development Fund and submit annual reports on fund utilisation to provincial authorities.',
    ],
    icon: 'Factory',
    color: '#00FF88',
  },

  // --------------------------------------------------------------------------
  // Phase 10: Closure & Rehabilitation
  // --------------------------------------------------------------------------
  {
    id: 10,
    name: 'Closure & Rehabilitation',
    slug: 'closure-rehabilitation',
    durationRange: { min: '3 years', max: '10 years' },
    description:
      'Planned decommissioning of mining and processing facilities, rehabilitation of disturbed land, long-term management of tailings and waste facilities, and transition of the workforce and affected communities to post-mining livelihoods.',
    tasks: [
      {
        name: 'Implementation of Mine Closure Plan',
        department: 'Engineering / Environment',
        durationDays: { min: 365, max: 1095 },
        deliverable: 'Completed demolition, earthworks, and rehabilitation of mine and plant areas',
      },
      {
        name: 'Tailings Storage Facility closure and long-term stabilisation',
        department: 'Engineering',
        durationDays: { min: 365, max: 1825 },
        deliverable: 'TSF capped, vegetated, and certified for long-term physical and chemical stability',
      },
      {
        name: 'Environmental rehabilitation and revegetation',
        department: 'Environment',
        durationDays: { min: 730, max: 3650 },
        deliverable: 'Rehabilitation completion report with monitoring data demonstrating ecosystem recovery',
      },
      {
        name: 'Workforce transition and retrenchment program',
        department: 'Human Resources',
        durationDays: { min: 180, max: 365 },
        deliverable: 'Completed retrenchment process with skills training and placement support for affected workers',
      },
      {
        name: 'Post-closure environmental monitoring program',
        department: 'Environment',
        durationDays: { min: 1095, max: 3650 },
        deliverable: 'Annual post-closure monitoring reports demonstrating compliance with closure criteria',
      },
    ],
    documents: [
      {
        name: 'Mine Closure Plan (Updated)',
        type: 'plan',
        responsible: 'Closure Manager',
        drcSpecific: true,
      },
      {
        name: 'Environmental Rehabilitation Completion Report',
        type: 'report',
        responsible: 'Environmental Manager',
        drcSpecific: true,
      },
      {
        name: 'Closure Certificate Application',
        type: 'application',
        responsible: 'Legal Director',
        drcSpecific: true,
      },
      {
        name: 'Post-Mining Community Transition Plan',
        type: 'plan',
        responsible: 'Community Relations Manager',
        drcSpecific: true,
      },
    ],
    teamRequirements: [
      { role: 'Closure Manager', count: 1, localHire: false, estimatedCostPerMonth: 30000 },
      { role: 'Rehabilitation / Environmental Engineer', count: 2, localHire: false, estimatedCostPerMonth: 16000 },
      { role: 'TSF Closure Engineer', count: 1, localHire: false, estimatedCostPerMonth: 20000 },
      { role: 'Community Transition Coordinator', count: 1, localHire: true, estimatedCostPerMonth: 5000 },
      { role: 'Environmental Monitoring Technicians', count: 3, localHire: true, estimatedCostPerMonth: 3000 },
    ],
    estimatedCost: { min: 10000000, max: 100000000, currency: 'USD' },
    risks: [
      {
        category: 'Environmental',
        description: 'Acid mine drainage from waste dumps or TSF may require treatment for decades if not properly managed during closure.',
        likelihood: 'medium',
        impact: 'critical',
        mitigation: 'Design closure covers to minimise infiltration; implement passive treatment systems; provision adequate long-term closure funding.',
      },
      {
        category: 'Social',
        description: 'Communities economically dependent on the mine may face significant hardship post-closure without adequate transition support.',
        likelihood: 'high',
        impact: 'high',
        mitigation: 'Begin post-mining livelihood programs at least 5 years before closure; diversify local economy through agriculture and SME support.',
      },
      {
        category: 'Financial',
        description: 'Closure costs may exceed provisions if rehabilitation requirements are more extensive than initially estimated.',
        likelihood: 'medium',
        impact: 'high',
        mitigation: 'Update closure cost estimates every 3 years; maintain dedicated closure fund or financial guarantee as required by DRC regulations.',
      },
    ],
    milestones: [
      'All mining and processing operations permanently ceased',
      'Tailings Storage Facility closure construction completed',
      'Land rehabilitation signed off by ACE environmental inspectors',
      'Closure Certificate issued by Direction des Mines',
    ],
    drcSpecific: [
      'The 2018 Mining Code requires operators to provision for closure through a rehabilitation fund updated annually and approved by the Direction des Mines.',
      'A Closure Certificate from the Direction des Mines is required to release the operator from ongoing environmental liability; this requires ACE sign-off on rehabilitation outcomes.',
      'Workforce retrenchment must comply with DRC Labour Code requirements including severance pay (minimum 1 month per year of service) and consultation with union representatives.',
    ],
    icon: 'Leaf',
    color: '#8B7355',
  },
];

// ============================================================================
// Utility Functions
// ============================================================================

export function getPhaseById(id: number): MiningPhase | undefined {
  return MINING_PHASES.find(p => p.id === id);
}

export function getTotalProjectCost(): { min: number; max: number } {
  return MINING_PHASES.reduce(
    (acc, p) => ({
      min: acc.min + p.estimatedCost.min,
      max: acc.max + p.estimatedCost.max,
    }),
    { min: 0, max: 0 },
  );
}
