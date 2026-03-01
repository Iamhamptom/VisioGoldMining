export interface TaskTemplate {
  name: string;
  department: string;
  duration_days: { min: number; p50: number; max: number };
  required_docs: string[];
}

export interface PhaseTemplate {
  phase: number;
  name: string;
  tasks: TaskTemplate[];
}

const COMMON_PHASES: PhaseTemplate[] = [
  {
    phase: 1,
    name: 'Targeting + Data Intake',
    tasks: [
      { name: 'Desktop geological review', department: 'mapping_and_remote_sensing', duration_days: { min: 7, p50: 14, max: 30 }, required_docs: ['Literature review report'] },
      { name: 'Satellite imagery analysis', department: 'mapping_and_remote_sensing', duration_days: { min: 5, p50: 10, max: 21 }, required_docs: ['Remote sensing report'] },
      { name: 'Historical data compilation', department: 'mapping_and_remote_sensing', duration_days: { min: 3, p50: 7, max: 14 }, required_docs: [] },
      { name: 'Target polygon delineation', department: 'mapping_and_remote_sensing', duration_days: { min: 2, p50: 5, max: 10 }, required_docs: ['Target map'] },
    ],
  },
  {
    phase: 2,
    name: 'Company Setup + Compliance',
    tasks: [
      { name: 'DRC entity registration (SARL)', department: 'legal_and_tenure', duration_days: { min: 14, p50: 30, max: 60 }, required_docs: ['Certificate of incorporation', 'RCCM registration'] },
      { name: 'Tax registration (NIF/Impot)', department: 'legal_and_tenure', duration_days: { min: 7, p50: 14, max: 30 }, required_docs: ['Tax registration certificate'] },
      { name: 'Bank account establishment', department: 'legal_and_tenure', duration_days: { min: 7, p50: 21, max: 45 }, required_docs: ['Bank account confirmation'] },
      { name: 'Local counsel engagement', department: 'legal_and_tenure', duration_days: { min: 3, p50: 7, max: 14 }, required_docs: ['Retainer agreement'] },
      { name: 'Anti-corruption compliance setup', department: 'legal_and_tenure', duration_days: { min: 5, p50: 10, max: 21 }, required_docs: ['Compliance policy', 'KYC procedures'] },
    ],
  },
  {
    phase: 3,
    name: 'Licensing Workflow',
    tasks: [
      { name: 'CAMI permit application (PR/PE)', department: 'licensing_and_filing', duration_days: { min: 30, p50: 90, max: 180 }, required_docs: ['Permit application', 'Technical program', 'Environmental commitment letter'] },
      { name: 'Surface rights fee payment', department: 'licensing_and_filing', duration_days: { min: 1, p50: 3, max: 7 }, required_docs: ['Payment receipt'] },
      { name: 'Provincial government notification', department: 'licensing_and_filing', duration_days: { min: 7, p50: 14, max: 30 }, required_docs: ['Notification letter'] },
      { name: 'Boundary survey and demarcation', department: 'licensing_and_filing', duration_days: { min: 14, p50: 30, max: 60 }, required_docs: ['Survey report', 'GPS coordinates'] },
    ],
  },
  {
    phase: 7,
    name: 'Permitting + ESG',
    tasks: [
      { name: 'Environmental Impact Assessment (EIES)', department: 'environmental_and_esg', duration_days: { min: 30, p50: 90, max: 180 }, required_docs: ['EIES report', 'Mitigation plan'] },
      { name: 'Community consultation', department: 'community_engagement', duration_days: { min: 14, p50: 30, max: 60 }, required_docs: ['Consultation minutes', 'Community agreement'] },
      { name: 'Cahier des charges agreement', department: 'community_engagement', duration_days: { min: 14, p50: 45, max: 90 }, required_docs: ['Cahier des charges signed copy'] },
      { name: 'Water use permit', department: 'environmental_and_esg', duration_days: { min: 14, p50: 30, max: 60 }, required_docs: ['Water permit'] },
    ],
  },
];

const EXPLORATION_PHASES: PhaseTemplate[] = [
  {
    phase: 4,
    name: 'Exploration (Mapping/Sampling/Labs)',
    tasks: [
      { name: 'Geological mapping campaign', department: 'mapping_and_remote_sensing', duration_days: { min: 14, p50: 30, max: 60 }, required_docs: ['Geological map', 'Field notes'] },
      { name: 'Soil geochemistry sampling', department: 'sampling_and_fieldwork', duration_days: { min: 14, p50: 30, max: 60 }, required_docs: ['Sample register', 'Chain of custody'] },
      { name: 'Stream sediment sampling', department: 'sampling_and_fieldwork', duration_days: { min: 7, p50: 14, max: 30 }, required_docs: ['Sample location map'] },
      { name: 'Trenching program', department: 'sampling_and_fieldwork', duration_days: { min: 14, p50: 30, max: 60 }, required_docs: ['Trench logs', 'Sample assay results'] },
      { name: 'Sample preparation and shipping', department: 'laboratory_assays', duration_days: { min: 7, p50: 14, max: 21 }, required_docs: ['Shipping manifest'] },
      { name: 'Laboratory analysis', department: 'laboratory_assays', duration_days: { min: 21, p50: 45, max: 90 }, required_docs: ['Assay certificates', 'QA/QC report'] },
      { name: 'Camp establishment', department: 'camp_and_logistics', duration_days: { min: 7, p50: 14, max: 30 }, required_docs: ['Camp layout plan'] },
      { name: 'Security arrangements', department: 'security', duration_days: { min: 7, p50: 14, max: 21 }, required_docs: ['Security plan'] },
    ],
  },
  {
    phase: 5,
    name: 'Drilling + Resource Model',
    tasks: [
      { name: 'Drill pad preparation', department: 'drilling_campaign', duration_days: { min: 7, p50: 14, max: 30 }, required_docs: ['Drill plan map'] },
      { name: 'Drilling contractor mobilization', department: 'drilling_campaign', duration_days: { min: 14, p50: 30, max: 60 }, required_docs: ['Mobilization contract'] },
      { name: 'RC/Diamond drilling campaign', department: 'drilling_campaign', duration_days: { min: 30, p50: 90, max: 180 }, required_docs: ['Drill logs', 'Core photos'] },
      { name: 'Core/chip logging and sampling', department: 'drilling_campaign', duration_days: { min: 14, p50: 30, max: 60 }, required_docs: ['Logging database'] },
      { name: 'Drill sample assaying', department: 'laboratory_assays', duration_days: { min: 21, p50: 45, max: 90 }, required_docs: ['Drill assay certificates'] },
      { name: 'Resource estimation (if data permits)', department: 'technical_studies_pea', duration_days: { min: 30, p50: 60, max: 120 }, required_docs: ['Resource estimate report'] },
    ],
  },
];

const SMALL_MINE_EXTRA_PHASES: PhaseTemplate[] = [
  ...EXPLORATION_PHASES,
  {
    phase: 6,
    name: 'Feasibility',
    tasks: [
      { name: 'Preliminary Economic Assessment (PEA)', department: 'technical_studies_pea', duration_days: { min: 30, p50: 60, max: 120 }, required_docs: ['PEA report'] },
      { name: 'Metallurgical test work', department: 'technical_studies_pea', duration_days: { min: 21, p50: 45, max: 90 }, required_docs: ['Met test report'] },
      { name: 'Mining method selection', department: 'technical_studies_pea', duration_days: { min: 7, p50: 14, max: 30 }, required_docs: ['Mining method memo'] },
    ],
  },
  {
    phase: 8,
    name: 'Construction + Mobilization',
    tasks: [
      { name: 'Processing plant procurement', department: 'camp_and_logistics', duration_days: { min: 60, p50: 120, max: 240 }, required_docs: ['Equipment purchase orders'] },
      { name: 'Site civil works', department: 'camp_and_logistics', duration_days: { min: 30, p50: 60, max: 120 }, required_docs: ['Construction drawings'] },
      { name: 'Plant installation and commissioning', department: 'camp_and_logistics', duration_days: { min: 30, p50: 60, max: 120 }, required_docs: ['Commissioning report'] },
    ],
  },
  {
    phase: 9,
    name: 'Operations Readiness',
    tasks: [
      { name: 'Operations team recruitment', department: 'camp_and_logistics', duration_days: { min: 14, p50: 30, max: 60 }, required_docs: ['Org chart', 'Employment contracts'] },
      { name: 'Safety training', department: 'security', duration_days: { min: 7, p50: 14, max: 21 }, required_docs: ['Training records'] },
      { name: 'Operations manual development', department: 'reporting_and_disclosure', duration_days: { min: 14, p50: 30, max: 60 }, required_docs: ['Operations manual'] },
    ],
  },
];

const INDUSTRIAL_EXTRA_PHASES: PhaseTemplate[] = [
  ...EXPLORATION_PHASES,
  {
    phase: 6,
    name: 'Feasibility',
    tasks: [
      { name: 'Pre-Feasibility Study (PFS)', department: 'technical_studies_pea', duration_days: { min: 60, p50: 120, max: 240 }, required_docs: ['PFS report'] },
      { name: 'Definitive Feasibility Study (DFS)', department: 'technical_studies_pea', duration_days: { min: 90, p50: 180, max: 365 }, required_docs: ['DFS report'] },
      { name: 'Metallurgical test work (detailed)', department: 'technical_studies_pea', duration_days: { min: 30, p50: 60, max: 120 }, required_docs: ['Detailed met report'] },
      { name: 'Geotechnical studies', department: 'technical_studies_pea', duration_days: { min: 30, p50: 60, max: 120 }, required_docs: ['Geotech report'] },
      { name: 'Hydrogeological studies', department: 'technical_studies_pea', duration_days: { min: 21, p50: 45, max: 90 }, required_docs: ['Hydrogeo report'] },
      { name: 'NI 43-101 / JORC Technical Report', department: 'reporting_and_disclosure', duration_days: { min: 30, p50: 60, max: 120 }, required_docs: ['NI 43-101 / JORC report'] },
    ],
  },
  {
    phase: 8,
    name: 'Construction + Mobilization',
    tasks: [
      { name: 'Detailed engineering design', department: 'technical_studies_pea', duration_days: { min: 60, p50: 120, max: 240 }, required_docs: ['Engineering drawings'] },
      { name: 'EPC contractor selection', department: 'camp_and_logistics', duration_days: { min: 30, p50: 60, max: 120 }, required_docs: ['EPC contract'] },
      { name: 'Site earthworks', department: 'camp_and_logistics', duration_days: { min: 90, p50: 180, max: 365 }, required_docs: ['Progress reports'] },
      { name: 'Processing plant construction', department: 'camp_and_logistics', duration_days: { min: 120, p50: 240, max: 480 }, required_docs: ['Construction milestones'] },
      { name: 'Infrastructure (roads, power, water)', department: 'camp_and_logistics', duration_days: { min: 60, p50: 120, max: 240 }, required_docs: ['Infrastructure plans'] },
      { name: 'Commissioning', department: 'camp_and_logistics', duration_days: { min: 30, p50: 60, max: 120 }, required_docs: ['Commissioning protocol', 'Test run results'] },
    ],
  },
  {
    phase: 9,
    name: 'Operations Readiness',
    tasks: [
      { name: 'Management team recruitment', department: 'camp_and_logistics', duration_days: { min: 30, p50: 60, max: 120 }, required_docs: ['Org chart', 'Employment contracts'] },
      { name: 'Workforce training program', department: 'security', duration_days: { min: 14, p50: 30, max: 60 }, required_docs: ['Training curriculum', 'Certificates'] },
      { name: 'HSE management system', department: 'environmental_and_esg', duration_days: { min: 14, p50: 30, max: 60 }, required_docs: ['HSE manual'] },
      { name: 'Supply chain establishment', department: 'camp_and_logistics', duration_days: { min: 21, p50: 45, max: 90 }, required_docs: ['Vendor list', 'Supply agreements'] },
      { name: 'Community development program launch', department: 'community_engagement', duration_days: { min: 14, p50: 30, max: 60 }, required_docs: ['CDP plan'] },
    ],
  },
];

export function getTaskTemplates(projectType: string): PhaseTemplate[] {
  const phases = [...COMMON_PHASES];

  switch (projectType) {
    case 'exploration':
      phases.push(...EXPLORATION_PHASES);
      break;
    case 'small_mine':
      phases.push(...SMALL_MINE_EXTRA_PHASES);
      break;
    case 'industrial':
      phases.push(...INDUSTRIAL_EXTRA_PHASES);
      break;
    default:
      phases.push(...EXPLORATION_PHASES);
  }

  return phases.sort((a, b) => a.phase - b.phase);
}
