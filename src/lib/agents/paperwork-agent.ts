// ============================================================================
// Regulatory & Paperwork Agent — DRC Mining Code compliance and permits
// DRC Gold Mining Intelligence Platform
// ============================================================================

import { AgentMessage, generateMessageId } from './agent-framework';

// ---------------------------------------------------------------------------
// Regulatory reference data (inline; full data in src/data/drc-regulatory.ts)
// ---------------------------------------------------------------------------

interface PermitInfo {
  type: string;
  code: string;
  fullName: string;
  frenchName: string;
  authority: string;
  duration: string;
  renewalTerms: string;
  requirements: string[];
  fees: string;
  processingTime: string;
  notes: string;
}

const PERMIT_REFERENCE: PermitInfo[] = [
  {
    type: 'PR',
    code: 'Permis de Recherches',
    fullName: 'Research Permit (Exploration License)',
    frenchName: 'Permis de Recherches (PR)',
    authority: 'CAMI (Cadastre Minier)',
    duration: '5 years initial',
    renewalTerms: 'Renewable twice for 5 years each (total 15 years). Must relinquish 50% of area at each renewal.',
    requirements: [
      'Application form (Form 01)',
      'Technical and financial capability proof',
      'Work program with minimum expenditure commitments',
      'Environmental protection plan',
      'Company registration in DRC (RCCM)',
      'Tax registration (NIF)',
      'Payment of application fee and surface rent',
    ],
    fees: 'Application fee: $500/carre. Annual surface rent: $4.27/hectare (year 1-5), increasing on renewal.',
    processingTime: '3-6 months (CAMI processing)',
    notes: 'Most common starting permit for exploration. Does not grant mining rights — only research/exploration. Must convert to PE before production.',
  },
  {
    type: 'PE',
    code: 'Permis d\'Exploitation',
    fullName: 'Exploitation Permit (Mining License)',
    frenchName: 'Permis d\'Exploitation (PE)',
    authority: 'CAMI (Cadastre Minier)',
    duration: '25 years initial',
    renewalTerms: 'Renewable for 15-year periods. Requires demonstrated compliance and continued viability.',
    requirements: [
      'Feasibility study (bankable or pre-feasibility)',
      'Environmental and Social Impact Assessment (ESIA)',
      'Approved Environmental Management Plan (EMP)',
      'Proof of financial capacity for development',
      'Community consultation documentation',
      'Conversion from PR (must hold valid PR first)',
      'Payment of conversion fee and surface rent',
      'DRC state 10% free carry equity acceptance',
    ],
    fees: 'Conversion fee: variable. Annual surface rent: higher than PR. Surface rent increases over time.',
    processingTime: '6-18 months (complex process with multiple government sign-offs)',
    notes: 'Required for any industrial mining production. Triggers DRC state 10% free carry equity participation. Carries significant ongoing compliance obligations.',
  },
  {
    type: 'PEPM',
    code: 'Permis d\'Exploitation de Petite Mine',
    fullName: 'Small-Scale Mining Permit',
    frenchName: 'Permis d\'Exploitation de Petite Mine (PEPM)',
    authority: 'CAMI (Cadastre Minier)',
    duration: '10 years initial',
    renewalTerms: 'Renewable for 5-year periods.',
    requirements: [
      'Simplified feasibility study',
      'Environmental impact notice (simplified ESIA)',
      'Proof of financial capacity',
      'Company registration in DRC',
      'Community consultation',
    ],
    fees: 'Lower than PE. Application fee and surface rent applicable.',
    processingTime: '3-6 months',
    notes: 'For operations below specific tonnage thresholds. Lower regulatory burden than PE but limited scale.',
  },
  {
    type: 'ZEA',
    code: 'Zone d\'Exploitation Artisanale',
    fullName: 'Artisanal Mining Zone',
    frenchName: 'Zone d\'Exploitation Artisanale (ZEA)',
    authority: 'Provincial Governor (on recommendation of Minister of Mines)',
    duration: 'Indefinite (can be revoked)',
    renewalTerms: 'N/A — declared by administrative act.',
    requirements: [
      'Area must not be covered by PR or PE',
      'Geological evidence of mineable deposits',
      'Sufficient artisanal mining population',
      'Provincial government recommendation',
    ],
    fees: 'No direct fee for zone declaration. ASM card fees for individual miners.',
    processingTime: 'Variable — political process',
    notes: 'Declares an area exclusively for artisanal mining. Can conflict with or protect areas from industrial permits.',
  },
];

interface TaxObligation {
  name: string;
  rate: string;
  basis: string;
  frequency: string;
  authority: string;
  notes: string;
}

const TAX_OBLIGATIONS: TaxObligation[] = [
  { name: 'Mining Royalty', rate: '3.5%', basis: 'Net smelter return (NSR) on gold', frequency: 'Quarterly', authority: 'DGRAD (Direction Generale des Recettes Administratives)', notes: '2018 Mining Code revision increased from 2.5% to 3.5%. Strategic substances rate is 10%.' },
  { name: 'Corporate Income Tax', rate: '30%', basis: 'Net taxable income', frequency: 'Annual (with provisional payments)', authority: 'DGI (Direction Generale des Impots)', notes: 'Standard rate. Mining companies subject to general tax code provisions.' },
  { name: 'State Free Carry Equity', rate: '10%', basis: 'Equity in mining company', frequency: 'At PE grant', authority: 'State (via Gecamines or SOKIMO)', notes: 'Non-dilutable 10% free carry. Can increase to 15% for strategic deposits. Does not contribute to capex.' },
  { name: 'Community Development Fund', rate: '0.3%', basis: 'Annual revenue', frequency: 'Annual', authority: 'Local community development committee', notes: '2018 Mining Code requirement. Must be used for community infrastructure (schools, clinics, water).' },
  { name: 'Surface Rent', rate: 'Variable', basis: 'Per hectare per year', frequency: 'Annual', authority: 'CAMI', notes: 'Increases over permit life. Rate depends on permit type and area size.' },
  { name: 'Export Tax', rate: 'Variable', basis: 'Gold export value', frequency: 'Per shipment', authority: 'CEEC / DGDA', notes: 'Gold exports require CEEC certification. DGDA handles customs clearance.' },
  { name: 'Withholding Tax', rate: '10-20%', basis: 'Dividends, interest, management fees', frequency: 'Per payment', authority: 'DGI', notes: 'May be reduced by bilateral investment treaties (BIT). France, Belgium, South Africa BITs relevant.' },
];

interface RegulatoryBody {
  acronym: string;
  fullName: string;
  frenchName: string;
  role: string;
  website: string;
  keyContacts: string;
}

const REGULATORY_BODIES: RegulatoryBody[] = [
  { acronym: 'CAMI', fullName: 'Mining Cadastre', frenchName: 'Cadastre Minier', role: 'Manages mining titles, permit applications, renewals, transfers. Central repository of all mining rights.', website: 'https://cami.cd', keyContacts: 'Director General, Provincial offices' },
  { acronym: 'Ministry of Mines', fullName: 'Ministry of Mines', frenchName: 'Ministere des Mines', role: 'Policy oversight, Mining Code enforcement, mine inspection, ASM regulation.', website: 'https://mines.gouv.cd', keyContacts: 'Minister, Secretary General, Director of Mines' },
  { acronym: 'ACE', fullName: 'Congolese Environment Agency', frenchName: 'Agence Congolaise de l\'Environnement', role: 'ESIA review and approval. Environmental compliance monitoring.', website: '', keyContacts: 'Director General' },
  { acronym: 'CEEC', fullName: 'Centre for Evaluation, Expertise and Certification', frenchName: 'Centre d\'Evaluation, d\'Expertise et de Certification', role: 'Mineral evaluation and certification for export. Quality control and valuation.', website: '', keyContacts: 'Director General' },
  { acronym: 'SAEMAPE', fullName: 'Artisanal Mining Assistance and Supervision Service', frenchName: 'Service d\'Assistance et d\'Encadrement du Small-Scale Mining', role: 'ASM oversight, formalization, ZEA management.', website: '', keyContacts: 'Director General, Provincial heads' },
  { acronym: 'DGRAD', fullName: 'General Directorate of Administrative Revenue', frenchName: 'Direction Generale des Recettes Administratives', role: 'Collection of mining royalties and administrative fees.', website: '', keyContacts: 'Director General' },
  { acronym: 'DGDA', fullName: 'General Directorate of Customs and Excise', frenchName: 'Direction Generale des Douanes et Accises', role: 'Import/export customs clearance. Equipment import duty collection.', website: '', keyContacts: 'Regional customs offices' },
];

// ---------------------------------------------------------------------------
// Response generation
// ---------------------------------------------------------------------------

export function getPaperworkResponse(
  message: string,
  context?: { permitType?: string; currentStep?: string },
): AgentMessage {
  const msg = message.toLowerCase();

  // ----- CAMI / permit application -----
  if (msg.includes('cami') || msg.includes('cadastre') || msg.includes('apply') || msg.includes('application') || msg.includes('how to get')) {
    return {
      id: generateMessageId(),
      agentId: 'paperwork',
      role: 'agent',
      content:
        `## CAMI Permit Application Process\n\n` +
        `The Cadastre Minier (CAMI) is the central authority for all mining title applications in DRC.\n\n` +
        `### Step-by-Step Application Process\n\n` +
        `**1. Pre-Application Preparation**\n` +
        `- Register company in DRC (RCCM at Tribunal de Commerce)\n` +
        `- Obtain tax identification number (NIF) from DGI\n` +
        `- Prepare technical documentation in French\n` +
        `- Identify available perimeters on CAMI cadastre map (https://drclicences.cami.cd/)\n\n` +
        `**2. Application Submission (Form 01 for PR)**\n` +
        `- Complete application form in French\n` +
        `- Attach technical and financial capability documents\n` +
        `- Submit work program with minimum expenditure commitments\n` +
        `- Pay application fee ($500/carre)\n` +
        `- Submit at CAMI head office (Kinshasa) or provincial office\n\n` +
        `**3. CAMI Processing**\n` +
        `- CAMI verifies no overlapping titles\n` +
        `- Technical review of work program\n` +
        `- Financial capacity assessment\n` +
        `- Processing time: 3-6 months (often longer)\n\n` +
        `**4. Permit Grant**\n` +
        `- Minister of Mines signs arrête (decree)\n` +
        `- CAMI issues permit certificate\n` +
        `- Permit registered in mining cadastre\n` +
        `- Annual surface rent payments begin\n\n` +
        `### Key CAMI Portal\n` +
        `- Main site: https://cami.cd/\n` +
        `- Cadastre map: https://drclicences.cami.cd/\n` +
        `- Application guidance: https://cami.cd/conditions-de-demande/\n\n` +
        `### Common Pitfalls\n` +
        `- Incomplete French documentation\n` +
        `- Failing to check for overlapping claims before applying\n` +
        `- Inadequate financial capacity evidence\n` +
        `- Not engaging a DRC mining lawyer\n` +
        `- Underestimating processing times`,
      data: {
        process: ['pre_application', 'submission', 'cami_processing', 'permit_grant'],
        urls: {
          cami: 'https://cami.cd/',
          cadastre: 'https://drclicences.cami.cd/',
          guidance: 'https://cami.cd/conditions-de-demande/',
        },
        processingTime: '3-6 months',
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_cami_pr',
          label: 'PR permit details',
          type: 'dispatch',
          payload: { agentId: 'paperwork', query: 'Tell me about the Research Permit (PR)' },
        },
        {
          id: 'action_cami_pe',
          label: 'PE permit details',
          type: 'dispatch',
          payload: { agentId: 'paperwork', query: 'Tell me about the Exploitation Permit (PE)' },
        },
        {
          id: 'action_cami_legal',
          label: 'Find DRC mining lawyer',
          type: 'dispatch',
          payload: { agentId: 'research', query: 'Find a DRC mining lawyer with CAMI experience' },
        },
      ],
    };
  }

  // ----- Specific permit type queries -----
  if (msg.includes('research permit') || msg.includes('pr ') || msg.includes('exploration license') || msg.includes('permis de recherche')) {
    const pr = PERMIT_REFERENCE.find((p) => p.type === 'PR')!;
    return buildPermitResponse(pr);
  }

  if (msg.includes('exploitation') || msg.includes('mining license') || msg.includes('pe ') || msg.includes('permis d\'exploitation') || (msg.includes('permit') && msg.includes('mine'))) {
    const pe = PERMIT_REFERENCE.find((p) => p.type === 'PE')!;
    return buildPermitResponse(pe);
  }

  if (msg.includes('small scale') || msg.includes('petite mine') || msg.includes('pepm')) {
    const pepm = PERMIT_REFERENCE.find((p) => p.type === 'PEPM')!;
    return buildPermitResponse(pepm);
  }

  if (msg.includes('artisanal zone') || msg.includes('zea') || msg.includes('zone d\'exploitation')) {
    const zea = PERMIT_REFERENCE.find((p) => p.type === 'ZEA')!;
    return buildPermitResponse(zea);
  }

  // ----- Mining Code queries -----
  if (msg.includes('mining code') || msg.includes('code minier') || msg.includes('law') || msg.includes('legislation')) {
    return {
      id: generateMessageId(),
      agentId: 'paperwork',
      role: 'agent',
      content:
        `## DRC Mining Code Overview\n\n` +
        `The DRC Mining Code (Code Minier) is the primary legislation governing mining operations. The current version was amended in 2018 (Law No. 18/001).\n\n` +
        `### Key Provisions\n\n` +
        `**Title & Permit System (Titre I-III)**\n` +
        `- Research Permit (PR): 5 years, renewable twice\n` +
        `- Exploitation Permit (PE): 25 years, renewable for 15 years\n` +
        `- Small-Scale Mining Permit (PEPM): 10 years, renewable\n` +
        `- Artisanal Mining Zones (ZEA): Designated by provincial governor\n\n` +
        `**State Participation (2018 Amendment)**\n` +
        `- 10% free carry equity (non-dilutable) for all PE holders\n` +
        `- Can increase to 15% for strategic or high-value deposits\n` +
        `- State does not contribute to capex\n\n` +
        `**Fiscal Regime**\n` +
        `- Royalty: 3.5% (gold), 10% (strategic substances)\n` +
        `- Corporate tax: 30%\n` +
        `- Community development fund: 0.3% of revenue\n` +
        `- Stability clause: 10-year fiscal stability period (from 2018 amendment date)\n\n` +
        `**Environmental (Chapter VII)**\n` +
        `- ESIA required before PE grant\n` +
        `- Environmental Management Plan (EMP) mandatory\n` +
        `- Closure plan and financial guarantee required\n` +
        `- ACE (Agence Congolaise de l'Environnement) review\n\n` +
        `**Community Relations (Chapter IX)**\n` +
        `- Community consultation mandatory before PE\n` +
        `- Free, Prior and Informed Consent (FPIC) principles\n` +
        `- Community development agreements\n` +
        `- 0.3% revenue contribution to local development fund\n\n` +
        `### Key Reference Documents\n` +
        `- Mining Code consolidated text: https://www.icnl.org/wp-content/uploads/miningcode.pdf\n` +
        `- Mining Regulation (Decret 18/024): https://faolex.fao.org/docs/pdf/cng212783.pdf\n` +
        `- CAMI application procedures: https://cami.cd/conditions-de-demande/`,
      data: {
        codeVersion: 'Law No. 18/001 (2018 amendment)',
        keyProvisions: ['permits', 'state_participation', 'fiscal', 'environmental', 'community'],
        references: [
          { name: 'Mining Code', url: 'https://www.icnl.org/wp-content/uploads/miningcode.pdf' },
          { name: 'Mining Regulation', url: 'https://faolex.fao.org/docs/pdf/cng212783.pdf' },
        ],
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_code_permits',
          label: 'Permit details',
          type: 'dispatch',
          payload: { agentId: 'paperwork', query: 'What permits are available?' },
        },
        {
          id: 'action_code_tax',
          label: 'Tax obligations',
          type: 'dispatch',
          payload: { agentId: 'paperwork', query: 'What are the tax obligations?' },
        },
        {
          id: 'action_code_esia',
          label: 'ESIA requirements',
          type: 'dispatch',
          payload: { agentId: 'paperwork', query: 'What are the ESIA requirements?' },
        },
      ],
    };
  }

  // ----- ESIA / environmental queries -----
  if (msg.includes('esia') || msg.includes('environmental') || msg.includes('impact assessment') || msg.includes('ace') || msg.includes('environmental management')) {
    return {
      id: generateMessageId(),
      agentId: 'paperwork',
      role: 'agent',
      content:
        `## Environmental & Social Impact Assessment (ESIA) — DRC\n\n` +
        `### ESIA Requirements\n` +
        `The DRC Mining Code requires an ESIA before any Exploitation Permit (PE) can be granted. The ESIA is reviewed and approved by ACE (Agence Congolaise de l'Environnement).\n\n` +
        `### ESIA Process\n\n` +
        `**1. Scoping Phase (1-2 months)**\n` +
        `- Define study area and project boundaries\n` +
        `- Identify key environmental and social receptors\n` +
        `- Stakeholder identification and initial consultation\n` +
        `- Submit Terms of Reference (TOR) to ACE\n` +
        `- ACE approves TOR\n\n` +
        `**2. Baseline Studies (6-12 months)**\n` +
        `- Biodiversity assessment (flora, fauna)\n` +
        `- Water quality and hydrology\n` +
        `- Air quality baseline\n` +
        `- Noise baseline\n` +
        `- Soil and land use assessment\n` +
        `- Socio-economic baseline (demographics, livelihoods, health)\n` +
        `- Cultural heritage assessment\n` +
        `- Note: DRC requires at least one rainy season and one dry season of baseline data\n\n` +
        `**3. Impact Assessment (2-4 months)**\n` +
        `- Identify and assess potential impacts\n` +
        `- Develop mitigation measures\n` +
        `- Residual impact assessment\n` +
        `- Cumulative impact assessment\n\n` +
        `**4. Environmental Management Plan (EMP)**\n` +
        `- Detailed mitigation commitments\n` +
        `- Monitoring plan\n` +
        `- Emergency response plan\n` +
        `- Closure and rehabilitation plan\n` +
        `- Financial provision for closure\n\n` +
        `**5. Public Consultation & Disclosure**\n` +
        `- Public hearings in affected communities\n` +
        `- Document disclosure (in French and local languages)\n` +
        `- Written record of all consultations and responses\n\n` +
        `**6. ACE Review & Approval (3-6 months)**\n` +
        `- ACE technical review\n` +
        `- May require additional information or studies\n` +
        `- Environmental Certificate issued upon approval\n\n` +
        `### ESIA Costs (DRC)\n` +
        `- Small project: $200,000 - $500,000\n` +
        `- Medium project: $500,000 - $1,500,000\n` +
        `- Large project: $1,000,000 - $3,000,000+\n\n` +
        `### International Standards\n` +
        `For international financing (IFC, DFIs), the ESIA must also comply with:\n` +
        `- IFC Performance Standards (PS1-PS8)\n` +
        `- Equator Principles\n` +
        `- ICMM Mining Principles (if member)`,
      data: {
        phases: ['scoping', 'baseline', 'impact_assessment', 'emp', 'consultation', 'review'],
        totalDuration: '12-24 months',
        costRange: '$200K - $3M+',
        approvalAuthority: 'ACE',
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_esia_research',
          label: 'Commission baseline studies',
          type: 'dispatch',
          payload: { agentId: 'research', query: 'Commission environmental baseline studies' },
        },
        {
          id: 'action_esia_community',
          label: 'Plan community consultation',
          type: 'dispatch',
          payload: { agentId: 'language', query: 'Prepare community consultation templates' },
        },
      ],
    };
  }

  // ----- Tax / fiscal queries -----
  if (msg.includes('tax') || msg.includes('royalty') || msg.includes('fiscal') || msg.includes('payment') || msg.includes('fee') || msg.includes('obligation')) {
    return {
      id: generateMessageId(),
      agentId: 'paperwork',
      role: 'agent',
      content:
        `## DRC Mining Tax & Fiscal Obligations\n\n` +
        `### Tax Summary\n\n` +
        `| Obligation | Rate | Basis | Frequency | Authority |\n` +
        `|-----------|------|-------|-----------|----------|\n` +
        TAX_OBLIGATIONS.map((t) => `| ${t.name} | ${t.rate} | ${t.basis} | ${t.frequency} | ${t.authority} |`).join('\n') +
        `\n\n### Key Tax Notes\n\n` +
        TAX_OBLIGATIONS.map((t) => `**${t.name}:** ${t.notes}`).join('\n\n') +
        `\n\n### Effective Government Take\n` +
        `The combination of royalties, corporate tax, state equity, and community contributions results in an effective government take of approximately **45-50%** of project economics.\n\n` +
        `### Tax Optimization Strategies (Legal)\n` +
        `- Bilateral Investment Treaty (BIT) benefits for withholding tax\n` +
        `- Accelerated depreciation provisions in Mining Code\n` +
        `- Carry-forward of exploration expenditure\n` +
        `- VAT exemptions during construction phase\n` +
        `- Import duty exemptions for mining equipment (first 5 years)\n\n` +
        `### Tax Compliance Calendar\n` +
        `- **Monthly:** Payroll taxes, withholding taxes\n` +
        `- **Quarterly:** Mining royalty payments\n` +
        `- **Annual:** Corporate income tax, surface rent, community development fund\n` +
        `- **Per shipment:** Export taxes (CEEC certification)`,
      data: {
        obligations: TAX_OBLIGATIONS,
        effectiveGovTake: '45-50%',
        optimizations: ['BIT', 'depreciation', 'carry_forward', 'VAT_exemption', 'import_duty_exemption'],
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_tax_model',
          label: 'Generate tax model',
          type: 'generate',
          payload: { template: 'tax_model' },
        },
        {
          id: 'action_tax_pursuit',
          label: 'View project economics',
          type: 'dispatch',
          payload: { agentId: 'pursuit', query: 'What are the project economics including DRC fiscal regime?' },
        },
      ],
    };
  }

  // ----- Compliance / reporting queries -----
  if (msg.includes('compliance') || msg.includes('reporting') || msg.includes('report') || msg.includes('obligation') || msg.includes('requirement')) {
    return {
      id: generateMessageId(),
      agentId: 'paperwork',
      role: 'agent',
      content:
        `## DRC Mining Compliance & Reporting Requirements\n\n` +
        `### Ongoing Compliance Obligations\n\n` +
        `**CAMI Reporting:**\n` +
        `- Annual work program and expenditure report\n` +
        `- Geological data submissions\n` +
        `- Permit area relinquishment at renewal\n` +
        `- Surface rent payments\n\n` +
        `**Ministry of Mines:**\n` +
        `- Quarterly production reports\n` +
        `- Annual report (Rapport Annuel)\n` +
        `- Mine inspection compliance\n` +
        `- Safety incident reporting\n\n` +
        `**ACE (Environment):**\n` +
        `- Annual environmental monitoring report\n` +
        `- Incident/spill reporting (immediate)\n` +
        `- Closure plan updates (every 5 years)\n\n` +
        `**CEEC:**\n` +
        `- Export certification for each shipment\n` +
        `- Gold quality and quantity documentation\n\n` +
        `**Tax Authorities (DGI/DGRAD):**\n` +
        `- Monthly payroll tax returns\n` +
        `- Quarterly royalty payments\n` +
        `- Annual corporate tax return\n` +
        `- Transfer pricing documentation\n\n` +
        `**Provincial Government:**\n` +
        `- Community development fund reporting\n` +
        `- Local content and employment reporting\n` +
        `- Social impact monitoring\n\n` +
        `### Document Retention\n` +
        `All geological data, financial records, and compliance documents must be retained for the life of the permit plus 10 years.`,
      data: {
        reportingBodies: ['CAMI', 'Ministry of Mines', 'ACE', 'CEEC', 'DGI', 'DGRAD', 'Provincial Government'],
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_compliance_calendar',
          label: 'Generate compliance calendar',
          type: 'generate',
          payload: { template: 'compliance_calendar' },
        },
      ],
    };
  }

  // ----- Regulatory bodies -----
  if (msg.includes('government') || msg.includes('ministry') || msg.includes('authority') || msg.includes('regulatory body') || msg.includes('who to contact') || msg.includes('institution')) {
    return {
      id: generateMessageId(),
      agentId: 'paperwork',
      role: 'agent',
      content:
        `## DRC Mining Regulatory Bodies\n\n` +
        REGULATORY_BODIES.map(
          (b) =>
            `### ${b.acronym} — ${b.fullName}\n` +
            `**French:** ${b.frenchName}\n` +
            `**Role:** ${b.role}\n` +
            (b.website ? `**Website:** ${b.website}\n` : '') +
            `**Key contacts:** ${b.keyContacts}`
        ).join('\n\n') +
        `\n\n### Engagement Strategy\n` +
        `- Always engage through a qualified DRC mining lawyer\n` +
        `- All formal communications must be in French\n` +
        `- In-person meetings are essential — do not rely on email/phone alone\n` +
        `- Budget for multiple visits to Kinshasa for CAMI and Ministry engagement\n` +
        `- Provincial mining divisions handle local-level oversight\n` +
        `- ANAPI (Investment Promotion Agency) can facilitate initial introductions`,
      data: {
        bodies: REGULATORY_BODIES.map((b) => ({ acronym: b.acronym, name: b.fullName, role: b.role })),
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_bodies_trip',
          label: 'Plan Kinshasa regulatory trip',
          type: 'dispatch',
          payload: { agentId: 'trip', query: 'Plan a trip to Kinshasa for regulatory meetings with CAMI and Ministry of Mines' },
        },
        {
          id: 'action_bodies_language',
          label: 'Prepare formal French correspondence',
          type: 'dispatch',
          payload: { agentId: 'language', query: 'Prepare formal French letter templates for CAMI and Ministry of Mines' },
        },
      ],
    };
  }

  // ----- Document / form queries -----
  if (msg.includes('document') || msg.includes('form') || msg.includes('prepare') || msg.includes('template') || msg.includes('what do i need')) {
    return {
      id: generateMessageId(),
      agentId: 'paperwork',
      role: 'agent',
      content:
        `## Required Documents for DRC Mining Operations\n\n` +
        `### Company Registration Documents\n` +
        `- RCCM (Registre du Commerce et du Credit Mobilier) — company registration\n` +
        `- NIF (Numero d'Identification Fiscale) — tax identification\n` +
        `- Company statutes (statuts) — notarized\n` +
        `- Board resolution authorizing mining activities\n` +
        `- Proof of registered address in DRC\n\n` +
        `### Permit Application Documents (PR)\n` +
        `- Form 01 (Demande de Droit de Recherches)\n` +
        `- Technical capability statement\n` +
        `- Financial capability proof (bank statements, audited accounts)\n` +
        `- Work program (programme de travaux)\n` +
        `- Environmental protection plan (plan de protection environnementale)\n` +
        `- Map showing requested perimeter\n` +
        `- Payment receipts for application fees\n\n` +
        `### Permit Conversion Documents (PR to PE)\n` +
        `- Feasibility study (etude de faisabilite)\n` +
        `- ESIA and Environmental Management Plan\n` +
        `- Community consultation records\n` +
        `- Proof of financial capacity for development\n` +
        `- Mine development plan\n` +
        `- Closure plan with financial guarantee\n\n` +
        `### Operational Documents\n` +
        `- Expatriate work permits (Carte de Travail pour Etranger)\n` +
        `- Import permits for equipment\n` +
        `- Explosives permits (if applicable)\n` +
        `- Environmental monitoring reports\n` +
        `- CEEC export certification\n\n` +
        `**All documents must be prepared in French.** I recommend engaging a DRC mining lawyer for document preparation.`,
      data: {
        categories: ['company_registration', 'permit_application', 'permit_conversion', 'operational'],
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_docs_language',
          label: 'French document templates',
          type: 'dispatch',
          payload: { agentId: 'language', query: 'Prepare French templates for mining permit applications' },
        },
        {
          id: 'action_docs_legal',
          label: 'Find DRC mining lawyer',
          type: 'dispatch',
          payload: { agentId: 'research', query: 'Find a qualified DRC mining lawyer' },
        },
      ],
    };
  }

  // ----- All permits overview -----
  if (msg.includes('permit') || msg.includes('license') || msg.includes('licence') || msg.includes('title')) {
    return {
      id: generateMessageId(),
      agentId: 'paperwork',
      role: 'agent',
      content:
        `## DRC Mining Permit Types\n\n` +
        PERMIT_REFERENCE.map(
          (p) =>
            `### ${p.fullName}\n` +
            `**Code:** ${p.frenchName}\n` +
            `**Authority:** ${p.authority}\n` +
            `**Duration:** ${p.duration}\n` +
            `**Renewal:** ${p.renewalTerms}\n` +
            `**Processing time:** ${p.processingTime}\n` +
            `**Key note:** ${p.notes}`
        ).join('\n\n') +
        `\n\n### Permit Hierarchy\n` +
        `1. **PR (Research)** -> exploration and resource definition\n` +
        `2. **PR -> PE conversion** -> requires ESIA and feasibility study\n` +
        `3. **PE (Exploitation)** -> industrial mining production\n` +
        `4. **PEPM** -> small-scale alternative to PE\n` +
        `5. **ZEA** -> artisanal mining zones (separate system)`,
      data: {
        permits: PERMIT_REFERENCE.map((p) => ({
          type: p.type,
          name: p.fullName,
          duration: p.duration,
          authority: p.authority,
        })),
      },
      timestamp: new Date().toISOString(),
      actions: PERMIT_REFERENCE.map((p) => ({
        id: `action_permit_${p.type}`,
        label: `${p.type} details`,
        type: 'dispatch' as const,
        payload: { agentId: 'paperwork', query: `Tell me about the ${p.fullName}` },
      })),
    };
  }

  // ----- Default response -----
  return {
    id: generateMessageId(),
    agentId: 'paperwork',
    role: 'agent',
    content:
      `## Regulatory & Paperwork Agent — Ready\n\n` +
      `I navigate DRC Mining Code compliance and permit processes. I can help with:\n\n` +
      `- **CAMI permit applications** — Step-by-step guidance for PR, PE, PEPM\n` +
      `- **Mining Code** — Key provisions, 2018 amendments, fiscal regime\n` +
      `- **ESIA requirements** — Environmental and social impact assessment process\n` +
      `- **Tax obligations** — Royalties, corporate tax, community fund, export taxes\n` +
      `- **Compliance** — Ongoing reporting requirements and deadlines\n` +
      `- **Regulatory bodies** — CAMI, Ministry of Mines, ACE, CEEC, SAEMAPE\n` +
      `- **Document preparation** — Required forms and supporting documentation\n\n` +
      `What regulatory guidance do you need?`,
    data: {
      capabilities: ['cami_permits', 'mining_code', 'esia', 'tax', 'compliance', 'regulatory_bodies', 'documents'],
    },
    timestamp: new Date().toISOString(),
    actions: [
      { id: 'action_default_cami', label: 'CAMI application process', type: 'dispatch', payload: { agentId: 'paperwork', query: 'How do I apply for a permit at CAMI?' } },
      { id: 'action_default_code', label: 'Mining Code overview', type: 'dispatch', payload: { agentId: 'paperwork', query: 'Give me an overview of the DRC Mining Code' } },
      { id: 'action_default_tax', label: 'Tax obligations', type: 'dispatch', payload: { agentId: 'paperwork', query: 'What are the tax obligations?' } },
      { id: 'action_default_esia', label: 'ESIA requirements', type: 'dispatch', payload: { agentId: 'paperwork', query: 'What are the ESIA requirements?' } },
    ],
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildPermitResponse(permit: PermitInfo): AgentMessage {
  return {
    id: generateMessageId(),
    agentId: 'paperwork',
    role: 'agent',
    content:
      `## ${permit.fullName}\n\n` +
      `**French name:** ${permit.frenchName}\n` +
      `**Issuing authority:** ${permit.authority}\n` +
      `**Duration:** ${permit.duration}\n` +
      `**Renewal:** ${permit.renewalTerms}\n` +
      `**Processing time:** ${permit.processingTime}\n\n` +
      `### Requirements\n` +
      permit.requirements.map((r) => `- ${r}`).join('\n') +
      `\n\n### Fees\n` +
      `${permit.fees}\n\n` +
      `### Important Notes\n` +
      `${permit.notes}`,
    data: {
      permitType: permit.type,
      permitName: permit.fullName,
      authority: permit.authority,
      duration: permit.duration,
      requirements: permit.requirements,
      fees: permit.fees,
    },
    timestamp: new Date().toISOString(),
    actions: [
      {
        id: `action_permit_${permit.type}_apply`,
        label: 'Start application process',
        type: 'dispatch',
        payload: { agentId: 'paperwork', query: 'How do I apply at CAMI?' },
      },
      {
        id: `action_permit_${permit.type}_docs`,
        label: 'Document checklist',
        type: 'dispatch',
        payload: { agentId: 'paperwork', query: 'What documents do I need?' },
      },
      {
        id: `action_permit_${permit.type}_legal`,
        label: 'Find mining lawyer',
        type: 'dispatch',
        payload: { agentId: 'research', query: 'Find a DRC mining lawyer' },
      },
    ],
  };
}
