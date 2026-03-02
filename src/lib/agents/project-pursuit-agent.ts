// ============================================================================
// Project Pursuit Agent — Mining lifecycle guidance and project pursuit
// DRC Gold Mining Intelligence Platform
// ============================================================================

import { AgentMessage, generateMessageId } from './agent-framework';

// ---------------------------------------------------------------------------
// Phase reference data (inline summary; full data in src/data/mining-phases.ts)
// ---------------------------------------------------------------------------

interface PhaseSummary {
  phase: number;
  name: string;
  duration: string;
  costRange: string;
  keyActivities: string[];
  drcSpecific: string;
  risks: string[];
  teamNeeds: string[];
}

const PHASE_SUMMARIES: PhaseSummary[] = [
  {
    phase: 1,
    name: 'Reconnaissance & Target Generation',
    duration: '3-6 months',
    costRange: '$50K - $250K',
    keyActivities: [
      'Desktop geological review',
      'Satellite imagery analysis',
      'Historical data compilation',
      'Target ranking',
      'Initial stakeholder mapping',
    ],
    drcSpecific: 'Review CAMI cadastre for available permits. Assess artisanal mining activity as a pathfinder signal. Engage SOKIMO or provincial mining division for historical data.',
    risks: ['Incomplete historical data', 'Cadastre inaccuracies', 'Competitor claim staking'],
    teamNeeds: ['Senior geologist', 'GIS analyst', 'DRC legal advisor'],
  },
  {
    phase: 2,
    name: 'Permit Acquisition & Stakeholder Engagement',
    duration: '3-12 months',
    costRange: '$100K - $500K',
    keyActivities: [
      'CAMI permit application (PR or PE)',
      'Community consultation',
      'Provincial government engagement',
      'Environmental baseline scoping',
      'Land access agreements',
    ],
    drcSpecific: 'CAMI application requires French-language documentation. Community engagement must follow DRC Mining Code Chapter IX. Expect delays at cadastre level. Budget for facilitation.',
    risks: ['Permit delays at CAMI', 'Community opposition', 'Overlapping ASM claims', 'Political interference'],
    teamNeeds: ['DRC mining lawyer', 'Community liaison officer', 'French translator', 'Fixer/facilitator'],
  },
  {
    phase: 3,
    name: 'Early Exploration',
    duration: '6-18 months',
    costRange: '$500K - $3M',
    keyActivities: [
      'First-pass geochemical sampling',
      'Geological mapping (1:10,000)',
      'Geophysical surveys (magnetics, IP)',
      'Trenching and pitting',
      'Scout drilling (RC or diamond)',
    ],
    drcSpecific: 'Logistics dominate costs in DRC. Drill rig mobilization to remote sites can cost $200K+. Rainy season (Oct-Apr) severely limits field access in many provinces. Budget for security escorts in Kivu/Ituri.',
    risks: ['Logistics delays', 'Security incidents', 'Equipment theft', 'Rainy season shutdowns'],
    teamNeeds: ['Exploration geologist', 'Field geologist (x2)', 'Drill crew', 'Security team', 'Camp manager'],
  },
  {
    phase: 4,
    name: 'Resource Definition Drilling',
    duration: '12-24 months',
    costRange: '$5M - $25M',
    keyActivities: [
      'Systematic diamond drilling program',
      'Core logging and sampling',
      'Geological modelling',
      'Initial resource estimation (NI 43-101 or JORC)',
      'Metallurgical test work',
    ],
    drcSpecific: 'NI 43-101 or JORC compliance essential for international financing. DRC requires QP site visits. Diamond drilling in DRC costs $150-300/m depending on remoteness. Secure core storage is critical.',
    risks: ['Grade variability', 'Nugget effect in coarse gold', 'Core security', 'Cost overruns'],
    teamNeeds: ['Resource geologist', 'QP (Qualified Person)', 'Core technicians (x3)', 'Database manager', 'Metallurgist'],
  },
  {
    phase: 5,
    name: 'Scoping Study',
    duration: '4-8 months',
    costRange: '$500K - $2M',
    keyActivities: [
      'Preliminary mine plan',
      'Process flowsheet selection',
      'Infrastructure layout',
      'Preliminary capex/opex estimation',
      'Fatal flaw analysis',
    ],
    drcSpecific: 'DRC power availability is a critical factor — most sites lack grid access. Consider hybrid solar/diesel or hydroelectric options. Transport costs to site can double standard capex assumptions.',
    risks: ['Unfavorable economics', 'Infrastructure gaps identified', 'Power supply constraints'],
    teamNeeds: ['Mining engineer', 'Process engineer', 'Infrastructure planner', 'Economist'],
  },
  {
    phase: 6,
    name: 'Pre-Feasibility Study (PFS)',
    duration: '8-14 months',
    costRange: '$2M - $8M',
    keyActivities: [
      'Detailed resource model update',
      'Mine design optimization',
      'Process design and pilot testing',
      'Environmental and Social Impact Assessment (ESIA)',
      'Financial modelling (+/- 25%)',
    ],
    drcSpecific: 'ESIA must comply with DRC environmental regulations and is submitted to ACE (Agence Congolaise de l\'Environnement). Community development plan required. Factor in DRC-specific fiscal regime: 3.5% royalty, 30% corporate tax, 10% state equity.',
    risks: ['ESIA rejection or delays', 'Community resettlement requirements', 'Fiscal regime changes'],
    teamNeeds: ['PFS study manager', 'Environmental consultant', 'Social consultant', 'Financial modeller', 'Legal team'],
  },
  {
    phase: 7,
    name: 'Bankable Feasibility Study (BFS/DFS)',
    duration: '12-18 months',
    costRange: '$5M - $20M',
    keyActivities: [
      'Definitive engineering (+/- 15%)',
      'Detailed mine schedule',
      'Final process design',
      'Full financial model with sensitivity analysis',
      'Risk register and mitigation plan',
    ],
    drcSpecific: 'International lenders (IFC, DFIs) require high ESG standards for DRC projects. Political risk insurance (MIGA, OPIC) is strongly recommended. Factor sovereign risk premium into discount rate.',
    risks: ['Financing market conditions', 'Gold price sensitivity', 'Country risk premium', 'Partner disputes'],
    teamNeeds: ['BFS study director', 'Engineering firm', 'Legal counsel (international + DRC)', 'Investment banker'],
  },
  {
    phase: 8,
    name: 'Construction & Development',
    duration: '18-36 months',
    costRange: '$50M - $500M+',
    keyActivities: [
      'Detailed engineering and procurement',
      'Site preparation and earthworks',
      'Plant construction',
      'Infrastructure development (roads, power, water)',
      'Workforce recruitment and training',
    ],
    drcSpecific: 'DRC has limited local fabrication capacity — most equipment imported via Dar es Salaam or Mombasa corridors. Import duties and DGDA customs processes add time and cost. Community employment expectations are high.',
    risks: ['Cost overruns', 'Equipment delivery delays', 'Labor disputes', 'Security during construction'],
    teamNeeds: ['Construction manager', 'EPCM contractor', 'Procurement team', 'Community liaison (expanded)', 'Security force'],
  },
  {
    phase: 9,
    name: 'Production & Operations',
    duration: '10-20+ years',
    costRange: 'Opex: $800-$1,500/oz (DRC typical)',
    keyActivities: [
      'Steady-state mining and processing',
      'Grade control and reconciliation',
      'Ongoing exploration (brownfield)',
      'Community development programs',
      'Regulatory compliance and reporting',
    ],
    drcSpecific: 'Gold export requires CEEC certification. Royalties paid quarterly. Community development fund contributions mandatory. Regular CAMI and provincial reporting. SAEMAPE oversight of ASM zones.',
    risks: ['Gold price volatility', 'Operational disruptions', 'Tax regime changes', 'Community unrest', 'ASM encroachment'],
    teamNeeds: ['Mine manager', 'Operations team', 'Geology team', 'ESG/community team', 'Finance/compliance'],
  },
  {
    phase: 10,
    name: 'Closure & Rehabilitation',
    duration: '2-5 years (active closure)',
    costRange: '$10M - $100M',
    keyActivities: [
      'Progressive rehabilitation',
      'Tailings facility closure',
      'Water treatment (long-term)',
      'Community transition planning',
      'Asset disposal and site security',
    ],
    drcSpecific: 'DRC Mining Code requires closure plan and financial guarantee from exploitation stage. Rehabilitation standards are evolving. Community transition is critical — avoid creating ghost towns. ASM may reoccupy sites.',
    risks: ['Inadequate closure funding', 'Environmental liabilities', 'Community dependency', 'ASM reoccupation'],
    teamNeeds: ['Closure manager', 'Environmental engineer', 'Community transition team', 'Legal counsel'],
  },
];

// ---------------------------------------------------------------------------
// Response generation
// ---------------------------------------------------------------------------

function matchPhaseQuery(msg: string): PhaseSummary | null {
  const phaseMatch = msg.match(/phase\s*(\d+)/i);
  if (phaseMatch) {
    const num = parseInt(phaseMatch[1], 10);
    return PHASE_SUMMARIES.find((p) => p.phase === num) ?? null;
  }
  // Match by name keywords
  const nameMap: Record<string, number> = {
    reconnaissance: 1, target: 1,
    permit: 2, stakeholder: 2,
    'early exploration': 3, 'scout drilling': 3,
    'resource definition': 4, 'definition drilling': 4,
    scoping: 5, 'scoping study': 5,
    'pre-feasibility': 6, pfs: 6, prefeasibility: 6,
    'bankable feasibility': 7, bfs: 7, dfs: 7, 'feasibility study': 7,
    construction: 8, development: 8, build: 8,
    production: 9, operations: 9, operating: 9,
    closure: 10, rehabilitation: 10, rehab: 10,
  };
  for (const [kw, phase] of Object.entries(nameMap)) {
    if (msg.toLowerCase().includes(kw)) {
      return PHASE_SUMMARIES.find((p) => p.phase === phase) ?? null;
    }
  }
  return null;
}

function buildPhaseResponse(phase: PhaseSummary, projectRef?: string): AgentMessage {
  const projectNote = projectRef
    ? `\n\n**Project context:** This guidance applies to project \`${projectRef}\`. Adjust timelines and costs based on the specific project's location, infrastructure, and status.`
    : '';

  return {
    id: generateMessageId(),
    agentId: 'pursuit',
    role: 'agent',
    content:
      `## Phase ${phase.phase}: ${phase.name}\n\n` +
      `**Duration:** ${phase.duration}\n` +
      `**Estimated Cost:** ${phase.costRange}\n\n` +
      `### Key Activities\n${phase.keyActivities.map((a) => `- ${a}`).join('\n')}\n\n` +
      `### DRC-Specific Considerations\n${phase.drcSpecific}\n\n` +
      `### Key Risks\n${phase.risks.map((r) => `- ${r}`).join('\n')}\n\n` +
      `### Team Requirements\n${phase.teamNeeds.map((t) => `- ${t}`).join('\n')}` +
      projectNote,
    data: {
      phase: phase.phase,
      phaseName: phase.name,
      duration: phase.duration,
      costRange: phase.costRange,
      activities: phase.keyActivities,
      risks: phase.risks,
    },
    timestamp: new Date().toISOString(),
    actions: [
      {
        id: `action_phase_${phase.phase}_next`,
        label: phase.phase < 10 ? `View Phase ${phase.phase + 1}` : 'View Phase 1',
        type: 'dispatch',
        payload: { agentId: 'pursuit', query: `Tell me about phase ${phase.phase < 10 ? phase.phase + 1 : 1}` },
      },
      {
        id: `action_phase_${phase.phase}_cost`,
        label: 'Detailed cost breakdown',
        type: 'analyze',
        payload: { analysis: 'cost_breakdown', phase: phase.phase },
      },
      {
        id: `action_phase_${phase.phase}_paperwork`,
        label: 'Regulatory requirements',
        type: 'dispatch',
        payload: { agentId: 'paperwork', query: `What permits are needed for phase ${phase.phase}?` },
      },
    ],
  };
}

export function getProjectPursuitResponse(
  message: string,
  context?: { projectId?: string; currentPhase?: number },
): AgentMessage {
  const msg = message.toLowerCase();
  const projectRef = context?.projectId;

  // ----- Phase-specific query -----
  const phaseInfo = matchPhaseQuery(msg);
  if (phaseInfo) {
    return buildPhaseResponse(phaseInfo, projectRef);
  }

  // ----- "What's next" / next phase -----
  if ((msg.includes('next') || msg.includes("what's next") || msg.includes('whats next')) && context?.currentPhase) {
    const nextPhase = PHASE_SUMMARIES.find((p) => p.phase === (context.currentPhase ?? 0) + 1);
    if (nextPhase) {
      return buildPhaseResponse(nextPhase, projectRef);
    }
  }

  // ----- Cost / budget queries -----
  if (msg.includes('cost') || msg.includes('budget') || msg.includes('capex') || msg.includes('opex') || msg.includes('how much')) {
    return {
      id: generateMessageId(),
      agentId: 'pursuit',
      role: 'agent',
      content:
        `## DRC Gold Project Cost Estimation Guide\n\n` +
        `Gold mining in the DRC carries a cost premium of 25-50% over West African or Australian benchmarks due to logistics, security, and infrastructure gaps.\n\n` +
        `### Phase-by-Phase Cost Summary\n\n` +
        `| Phase | Activity | Cost Range |\n` +
        `|-------|---------|------------|\n` +
        PHASE_SUMMARIES.map((p) => `| ${p.phase} | ${p.name} | ${p.costRange} |`).join('\n') +
        `\n\n### Key DRC Cost Drivers\n` +
        `- **Logistics:** Remote site access adds $150-300/m to drilling costs\n` +
        `- **Security:** Armed escort requirements add $50-150K/year\n` +
        `- **Power:** Off-grid diesel generation costs $0.30-0.50/kWh\n` +
        `- **Import duties:** Equipment imports via Dar/Mombasa add 15-25% to procurement\n` +
        `- **Facilitation:** Permit processing, community engagement, government liaison\n\n` +
        `### DRC Fiscal Regime\n` +
        `- **Royalty:** 3.5% on gold (net smelter return)\n` +
        `- **Corporate tax:** 30%\n` +
        `- **State equity:** 10% free carry (may increase to 15% on strategic deposits)\n` +
        `- **Community development fund:** 0.3% of revenue\n` +
        `- **Export tax:** Applicable via CEEC certification\n` +
        (projectRef ? `\n**Note:** These are general estimates. For project \`${projectRef}\`, costs should be calibrated to its specific location and infrastructure profile.` : ''),
      data: {
        phases: PHASE_SUMMARIES.map((p) => ({ phase: p.phase, name: p.name, cost: p.costRange })),
        costDrivers: ['logistics', 'security', 'power', 'import_duties', 'facilitation'],
        fiscalRegime: { royalty: '3.5%', corporateTax: '30%', stateEquity: '10%', communityFund: '0.3%' },
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_cost_detail',
          label: 'Generate detailed cost model',
          type: 'generate',
          payload: { template: 'cost_model', projectId: projectRef },
        },
        {
          id: 'action_cost_compare',
          label: 'Compare with similar projects',
          type: 'analyze',
          payload: { analysis: 'cost_comparison' },
        },
      ],
    };
  }

  // ----- Team / personnel queries -----
  if (msg.includes('team') || msg.includes('personnel') || msg.includes('staff') || msg.includes('hire') || msg.includes('workforce')) {
    const phaseNum = context?.currentPhase ?? 3;
    const phase = PHASE_SUMMARIES.find((p) => p.phase === phaseNum) ?? PHASE_SUMMARIES[2];

    return {
      id: generateMessageId(),
      agentId: 'pursuit',
      role: 'agent',
      content:
        `## Team Requirements for DRC Gold Project\n\n` +
        `### Phase ${phase.phase}: ${phase.name}\n` +
        `**Core team:** ${phase.teamNeeds.map((t) => `${t}`).join(', ')}\n\n` +
        `### DRC Staffing Considerations\n` +
        `- **Expatriate vs. local:** DRC Mining Code requires preferential hiring of Congolese nationals. Expatriate work permits are required and take 4-8 weeks.\n` +
        `- **Security personnel:** Private security firms (e.g., G4S, local providers) are standard for remote operations.\n` +
        `- **Community liaison:** Essential from Day 1. Hire locally to build trust.\n` +
        `- **Language:** French is mandatory for all government interactions. Local languages (Swahili, Lingala, regional) needed for community work.\n` +
        `- **Salary benchmarks (DRC mining sector):**\n` +
        `  - Expatriate geologist: $8,000-15,000/month\n` +
        `  - Local geologist: $1,500-3,000/month\n` +
        `  - Community liaison officer: $800-1,500/month\n` +
        `  - Security guard: $200-400/month\n` +
        `  - Camp cook/support: $150-300/month\n\n` +
        `### All-Phase Team Overview\n` +
        PHASE_SUMMARIES.map((p) => `- **Phase ${p.phase} (${p.name}):** ${p.teamNeeds.join(', ')}`).join('\n'),
      data: {
        currentPhase: phase.phase,
        teamNeeds: phase.teamNeeds,
        salaryBenchmarks: {
          expatGeologist: '$8,000-15,000/mo',
          localGeologist: '$1,500-3,000/mo',
          communityLiaison: '$800-1,500/mo',
          securityGuard: '$200-400/mo',
        },
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_team_language',
          label: 'Get language requirements',
          type: 'dispatch',
          payload: { agentId: 'language', query: 'What languages do we need for our team?' },
        },
        {
          id: 'action_team_dispatch',
          label: 'Dispatch hiring researcher',
          type: 'dispatch',
          payload: { agentId: 'research', query: 'Find local geologists and community liaisons' },
        },
      ],
    };
  }

  // ----- Timeline queries -----
  if (msg.includes('timeline') || msg.includes('how long') || msg.includes('duration') || msg.includes('schedule')) {
    return {
      id: generateMessageId(),
      agentId: 'pursuit',
      role: 'agent',
      content:
        `## DRC Gold Project Timeline — Realistic Estimates\n\n` +
        `From reconnaissance to first gold pour, a DRC project typically takes **7-12 years** depending on scale, location, and complexity.\n\n` +
        `### Phase Timeline\n\n` +
        `| Phase | Activity | Duration | Cumulative |\n` +
        `|-------|---------|----------|------------|\n` +
        `| 1 | Reconnaissance | 3-6 mo | 6 mo |\n` +
        `| 2 | Permitting & Stakeholders | 3-12 mo | 18 mo |\n` +
        `| 3 | Early Exploration | 6-18 mo | 3 yr |\n` +
        `| 4 | Resource Definition | 12-24 mo | 5 yr |\n` +
        `| 5 | Scoping Study | 4-8 mo | 5.5 yr |\n` +
        `| 6 | Pre-Feasibility | 8-14 mo | 6.5 yr |\n` +
        `| 7 | Bankable Feasibility | 12-18 mo | 8 yr |\n` +
        `| 8 | Construction | 18-36 mo | 11 yr |\n` +
        `| 9 | Production | 10-20+ yr | — |\n` +
        `| 10 | Closure | 2-5 yr | — |\n\n` +
        `### DRC-Specific Delays\n` +
        `- **Rainy season:** Oct-Apr limits field access in most provinces (add 3-6 months per field phase)\n` +
        `- **Permit processing:** CAMI applications typically take 3-6 months minimum\n` +
        `- **Logistics:** Equipment mobilization to remote sites can take 2-4 months\n` +
        `- **Security disruptions:** Budget 1-3 months contingency per year for Kivu/Ituri operations\n` +
        `- **Political cycles:** Election years can slow government approvals`,
      data: {
        totalTimeline: '7-12 years',
        phases: PHASE_SUMMARIES.map((p) => ({ phase: p.phase, name: p.name, duration: p.duration })),
        delayFactors: ['rainy_season', 'permit_processing', 'logistics', 'security', 'political_cycles'],
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_timeline_gantt',
          label: 'Generate Gantt chart',
          type: 'generate',
          payload: { template: 'gantt_chart', projectId: projectRef },
        },
        {
          id: 'action_timeline_critical',
          label: 'Critical path analysis',
          type: 'analyze',
          payload: { analysis: 'critical_path' },
        },
      ],
    };
  }

  // ----- Risk queries -----
  if (msg.includes('risk') || msg.includes('danger') || msg.includes('threat') || msg.includes('challenge')) {
    return {
      id: generateMessageId(),
      agentId: 'pursuit',
      role: 'agent',
      content:
        `## DRC Gold Mining Risk Assessment\n\n` +
        `### Security Risks\n` +
        `- Armed group activity in eastern provinces (Kivu, Ituri, Maniema)\n` +
        `- Artisanal miner conflicts — competition for resources\n` +
        `- Road banditry and checkpoint extortion\n` +
        `- Equipment and supply theft\n\n` +
        `### Regulatory Risks\n` +
        `- Mining Code amendments (2018 revision increased royalties and state equity)\n` +
        `- Permit revocation or non-renewal threats\n` +
        `- Tax disputes and retroactive claims\n` +
        `- Export restrictions or certification delays (CEEC)\n\n` +
        `### Operational Risks\n` +
        `- Logistics costs 2-3x regional benchmarks\n` +
        `- Power supply unreliability (off-grid dependency)\n` +
        `- Rainy season access limitations (6 months/year in some areas)\n` +
        `- Skilled labor shortage locally\n\n` +
        `### Social & Environmental Risks\n` +
        `- Community opposition if engagement is inadequate\n` +
        `- Artisanal mining community displacement issues\n` +
        `- Environmental contamination legacy from historical operations\n` +
        `- NGO and media scrutiny (conflict minerals narrative)\n\n` +
        `### Political Risks\n` +
        `- Sovereign risk premium in financing\n` +
        `- Election-cycle uncertainty\n` +
        `- Provincial vs. national government tensions\n` +
        `- Currency instability (Congolese franc)\n\n` +
        `### Mitigation Strategies\n` +
        `- Political risk insurance (MIGA, OPIC/DFC)\n` +
        `- Strong community development programs from Day 1\n` +
        `- Local JV partners with government connections\n` +
        `- Diversified logistics corridors (Dar + Mombasa + Durban)\n` +
        `- International arbitration clauses in all agreements`,
      data: {
        riskCategories: ['security', 'regulatory', 'operational', 'social_environmental', 'political'],
        mitigationStrategies: ['insurance', 'community_engagement', 'local_partners', 'logistics_diversification'],
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_risk_intel',
          label: 'Get regional security intel',
          type: 'dispatch',
          payload: { agentId: 'local-intel', query: 'Security assessment for the project region' },
        },
        {
          id: 'action_risk_regulatory',
          label: 'Review regulatory risks',
          type: 'dispatch',
          payload: { agentId: 'paperwork', query: 'Current regulatory risks and compliance requirements' },
        },
      ],
    };
  }

  // ----- Overview / general project pursuit -----
  if (msg.includes('overview') || msg.includes('summary') || msg.includes('lifecycle') || msg.includes('all phases')) {
    return {
      id: generateMessageId(),
      agentId: 'pursuit',
      role: 'agent',
      content:
        `## DRC Gold Mining Project Lifecycle Overview\n\n` +
        `A gold mining project in the DRC follows a 10-phase lifecycle from initial reconnaissance to final closure. Each phase has distinct activities, costs, and regulatory requirements specific to the Congolese context.\n\n` +
        PHASE_SUMMARIES.map(
          (p) => `### Phase ${p.phase}: ${p.name}\n- **Duration:** ${p.duration}\n- **Cost:** ${p.costRange}\n- **Key:** ${p.keyActivities[0]}`
        ).join('\n\n') +
        `\n\n### Total Project Investment\n` +
        `- **Small project (<100Koz/yr):** $80M - $200M total\n` +
        `- **Mid-tier (100-250Koz/yr):** $200M - $600M total\n` +
        `- **Tier 1 (>250Koz/yr):** $500M - $2B+ total (e.g., Kibali)\n\n` +
        `Ask me about any specific phase for detailed guidance.`,
      data: {
        totalPhases: 10,
        phases: PHASE_SUMMARIES.map((p) => ({ phase: p.phase, name: p.name, cost: p.costRange })),
      },
      timestamp: new Date().toISOString(),
      actions: PHASE_SUMMARIES.slice(0, 5).map((p) => ({
        id: `action_overview_phase_${p.phase}`,
        label: `Phase ${p.phase}: ${p.name}`,
        type: 'dispatch' as const,
        payload: { agentId: 'pursuit', query: `Tell me about phase ${p.phase}` },
      })),
    };
  }

  // ----- Drilling queries -----
  if (msg.includes('drill') || msg.includes('drilling') || msg.includes('core') || msg.includes('rc')) {
    return {
      id: generateMessageId(),
      agentId: 'pursuit',
      role: 'agent',
      content:
        `## Drilling Programs in DRC Gold Projects\n\n` +
        `### DRC Drilling Cost Benchmarks\n` +
        `- **Diamond drilling (DD):** $150-300/m (varies by remoteness)\n` +
        `- **Reverse circulation (RC):** $80-150/m\n` +
        `- **Rig mobilization:** $100K-250K per rig to remote DRC sites\n` +
        `- **All-in cost per meter (DD):** $250-450/m including assays, logistics, camp\n\n` +
        `### Typical DRC Drilling Programs\n` +
        `- **Scout drilling (Phase 3):** 2,000-5,000m, 15-30 holes, $500K-1.5M\n` +
        `- **Resource definition (Phase 4):** 15,000-50,000m, 100-300 holes, $5M-15M\n` +
        `- **Infill/grade control:** 5,000-20,000m, focused on high-grade zones\n\n` +
        `### DRC-Specific Drilling Considerations\n` +
        `- Rig availability is limited — book 6+ months in advance\n` +
        `- Capital Drilling, Geodrill, and Boart Longyear operate in region\n` +
        `- Core security is critical — locked core sheds with 24/7 guards\n` +
        `- Assay labs: SGS Lubumbashi, ALS Mwanza (Tanzania), or ship to South Africa\n` +
        `- Rainy season (Oct-Apr) severely limits drill access in many areas\n` +
        `- Budget for drill pad construction and water supply logistics`,
      data: {
        costPerMeter: { diamond: '$150-300', rc: '$80-150', allIn: '$250-450' },
        mobilization: '$100K-250K',
        assayLabs: ['SGS Lubumbashi', 'ALS Mwanza', 'South Africa'],
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_drill_dispatch',
          label: 'Dispatch site survey team',
          type: 'dispatch',
          payload: { agentId: 'research', query: 'Survey drill site accessibility and logistics' },
        },
      ],
    };
  }

  // ----- Geology / deposit queries -----
  if (msg.includes('geolog') || msg.includes('deposit') || msg.includes('minerali') || msg.includes('belt') || msg.includes('greenstone')) {
    return {
      id: generateMessageId(),
      agentId: 'pursuit',
      role: 'agent',
      content:
        `## DRC Gold Geological Context\n\n` +
        `The DRC hosts world-class gold endowment across four principal metallogenic belts:\n\n` +
        `### Kilo-Moto Greenstone Belt (NE DRC)\n` +
        `- **Host:** Archaean mafic-ultramafic volcanic and metasedimentary sequences\n` +
        `- **Deposit types:** BIF-hosted, shear-zone controlled, quartz vein stockwork\n` +
        `- **Key projects:** Kibali (24 Moz), Mongbwalu (3.9 Moz), Giro\n` +
        `- **Historical production:** 11+ Moz since 1905\n\n` +
        `### Ngayu Greenstone Belt\n` +
        `- **Host:** BIF-associated ridge mineralization at volcanic/metasediment contacts\n` +
        `- **Key projects:** Adumbi/Imbo (3.97 Moz, 4.38 g/t)\n` +
        `- **Upside:** Kibali-style mineralization potential at depth\n\n` +
        `### Twangiza-Namoya Belt (South Kivu / Maniema)\n` +
        `- **Host:** Mesoproterozoic Itombwe Supergroup metasediments\n` +
        `- **Deposit types:** Shear-hosted quartz veins, laterite-hosted supergene enrichment\n` +
        `- **Key projects:** Twangiza (3.7 Moz), Namoya (2.1 Moz), Kamituga\n\n` +
        `### Kibara Belt\n` +
        `- **Host:** Proterozoic intracontinental mobile belt\n` +
        `- **Key projects:** Misisi/Akyanga (3.11 Moz, NI 43-101)\n\n` +
        `### Exploration Pathfinders for DRC Gold\n` +
        `- Artisanal mining activity as surface indicator\n` +
        `- BIF and volcano-sedimentary packages in magnetics\n` +
        `- Structural corridors and lineament density\n` +
        `- Geochemical soil anomalies (Au + As + Sb pathfinders)\n` +
        `- Historical colonial-era workings and production records`,
      data: {
        belts: ['Kilo-Moto', 'Ngayu', 'Twangiza-Namoya', 'Kibara'],
        totalEndowment: '40+ Moz known resources',
        pathfinders: ['ASM activity', 'BIF', 'structural corridors', 'geochemistry', 'historical workings'],
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_geo_map',
          label: 'View geological map',
          type: 'navigate',
          payload: { route: '/map', layer: 'geology' },
        },
        {
          id: 'action_geo_projects',
          label: 'View all projects by belt',
          type: 'navigate',
          payload: { route: '/projects', groupBy: 'belt' },
        },
      ],
    };
  }

  // ----- ASM / artisanal mining -----
  if (msg.includes('artisanal') || msg.includes('asm') || msg.includes('small scale') || msg.includes('creuseur')) {
    return {
      id: generateMessageId(),
      agentId: 'pursuit',
      role: 'agent',
      content:
        `## Artisanal Mining (ASM) in DRC Gold Projects\n\n` +
        `Artisanal and small-scale mining is a dominant feature of the DRC gold sector. An estimated 500,000-2,000,000 artisanal miners (creuseurs) operate across the country.\n\n` +
        `### ASM as a Pathfinder Signal\n` +
        `- Active ASM sites are strong indicators of gold presence\n` +
        `- Historical production data can guide exploration targeting\n` +
        `- ASM grade data (when available) provides preliminary grade indications\n\n` +
        `### ASM as a Risk Factor\n` +
        `- Community opposition to industrial displacement of ASM\n` +
        `- Security risks from ASM-armed group nexus\n` +
        `- Environmental contamination from mercury use\n` +
        `- Legal complexity — overlapping claims and customary rights\n\n` +
        `### ASM Integration Strategies\n` +
        `- Formal ASM zones (Zones d'Exploitation Artisanale — ZEA)\n` +
        `- Cooperative formation and capacity building\n` +
        `- Gold buying programs and fair-trade certification\n` +
        `- Alternative livelihood programs\n` +
        `- SAEMAPE (Service d'Assistance et d'Encadrement du Small-Scale Mining) coordination\n\n` +
        `### ASM Scale by Project Area\n` +
        `- Kamituga-Mobale: ~200,000 miners (extreme)\n` +
        `- Mongbwalu: ~15,000 miners (extreme)\n` +
        `- Namoya: ~12,000 miners (heavy)\n` +
        `- Misisi: ~10,000 miners (heavy)\n` +
        `- Twangiza: ~8,000 miners (heavy)\n` +
        `- Kibali area: ~5,000 miners (moderate)`,
      data: {
        totalEstimatedMiners: '500K-2M nationally',
        hotspots: [
          { name: 'Kamituga', miners: 200000 },
          { name: 'Mongbwalu', miners: 15000 },
          { name: 'Namoya', miners: 12000 },
          { name: 'Misisi', miners: 10000 },
        ],
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_asm_intel',
          label: 'Get ASM intelligence for specific area',
          type: 'dispatch',
          payload: { agentId: 'local-intel', query: 'Artisanal mining assessment' },
        },
        {
          id: 'action_asm_research',
          label: 'Commission ASM survey',
          type: 'dispatch',
          payload: { agentId: 'research', query: 'Dispatch team to survey artisanal mining activity' },
        },
      ],
    };
  }

  // ----- Gold price / economics -----
  if (msg.includes('gold price') || msg.includes('economics') || msg.includes('npv') || msg.includes('irr') || msg.includes('return')) {
    return {
      id: generateMessageId(),
      agentId: 'pursuit',
      role: 'agent',
      content:
        `## DRC Gold Project Economics\n\n` +
        `### Key Economic Parameters\n` +
        `- **Gold price assumption:** Use $2,000-2,200/oz for base case (conservative)\n` +
        `- **DRC AISC range:** $800-1,500/oz depending on scale and remoteness\n` +
        `- **Discount rate:** 8-12% (includes DRC country risk premium of 3-5%)\n` +
        `- **Typical IRR threshold:** >20% for DRC projects (risk-adjusted)\n\n` +
        `### DRC Fiscal Regime Impact\n` +
        `- Royalty: 3.5% of NSR\n` +
        `- Corporate tax: 30%\n` +
        `- State free carry: 10% (can increase to 15%)\n` +
        `- Community development: 0.3% of revenue\n` +
        `- **Effective government take:** ~45-50% of project economics\n\n` +
        `### Benchmarking\n` +
        `- Kibali AISC: ~$850-950/oz (Tier 1 efficiency)\n` +
        `- Typical DRC mid-tier: $1,100-1,400/oz\n` +
        `- Typical DRC small-scale: $1,300-1,600/oz\n\n` +
        `A project needs robust grade (>2.5 g/t), reasonable logistics, and >1 Moz resource to attract institutional capital for DRC development.`,
      data: {
        goldPriceAssumption: '$2,000-2,200/oz',
        aiscRange: '$800-1,500/oz',
        discountRate: '8-12%',
        effectiveGovTake: '45-50%',
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_econ_model',
          label: 'Generate economic model',
          type: 'generate',
          payload: { template: 'economic_model', projectId: projectRef },
        },
      ],
    };
  }

  // ----- Financing queries -----
  if (msg.includes('financ') || msg.includes('fund') || msg.includes('investor') || msg.includes('capital') || msg.includes('loan') || msg.includes('stream')) {
    return {
      id: generateMessageId(),
      agentId: 'pursuit',
      role: 'agent',
      content:
        `## Financing a DRC Gold Project\n\n` +
        `### Financing Stages\n` +
        `1. **Seed/exploration:** Private equity, high-net-worth individuals, junior mining listings (TSX-V, ASX, AIM)\n` +
        `2. **Development drilling:** Equity raises, strategic JV partnerships\n` +
        `3. **Feasibility:** Project finance, DFI engagement (IFC, AfDB, FMO)\n` +
        `4. **Construction:** Debt/equity mix, streaming/royalty deals, off-take agreements\n\n` +
        `### DRC-Specific Financing Considerations\n` +
        `- **Political risk insurance:** MIGA, DFC (formerly OPIC) — essential for debt financing\n` +
        `- **DFI engagement:** IFC, AfDB, and bilateral DFIs are active in DRC mining\n` +
        `- **Streaming/royalty:** Franco-Nevada, Wheaton, Royal Gold active in DRC\n` +
        `- **Chinese financing:** Chinese state-backed entities (e.g., Zijin, CITIC) increasingly active\n` +
        `- **Off-take:** Pre-sell gold production to fund construction\n\n` +
        `### Typical Capital Structure (DRC)\n` +
        `- Equity: 40-60%\n` +
        `- Debt: 30-50% (project finance with PRI)\n` +
        `- Streaming/royalty: 10-20% (top-up)\n\n` +
        `### Key Investor Concerns for DRC\n` +
        `- Resource confidence (NI 43-101 / JORC compliance)\n` +
        `- ESG track record and community relations\n` +
        `- Management team DRC experience\n` +
        `- Political risk mitigation strategy\n` +
        `- Exit strategy and liquidity`,
      data: {
        financingStages: ['seed', 'development', 'feasibility', 'construction'],
        typicalStructure: { equity: '40-60%', debt: '30-50%', streaming: '10-20%' },
        keyInvestorConcerns: ['resource_confidence', 'esg', 'management', 'political_risk', 'exit'],
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_finance_model',
          label: 'Build financing model',
          type: 'generate',
          payload: { template: 'financing_model' },
        },
      ],
    };
  }

  // ----- Milestone / progress tracking -----
  if (msg.includes('milestone') || msg.includes('progress') || msg.includes('track') || msg.includes('checklist')) {
    const phaseNum = context?.currentPhase ?? 1;
    const phase = PHASE_SUMMARIES.find((p) => p.phase === phaseNum) ?? PHASE_SUMMARIES[0];

    return {
      id: generateMessageId(),
      agentId: 'pursuit',
      role: 'agent',
      content:
        `## Project Milestones — Phase ${phase.phase}: ${phase.name}\n\n` +
        `### Key Milestones\n` +
        phase.keyActivities.map((a, i) => `- [ ] **Milestone ${i + 1}:** ${a}`).join('\n') +
        `\n\n### Phase Completion Criteria\n` +
        `- All key activities completed\n` +
        `- Risk register reviewed and mitigations in place\n` +
        `- Budget tracking within +/- 15% of estimates\n` +
        `- DRC regulatory requirements met for phase transition\n` +
        `- Stakeholder sign-off obtained\n\n` +
        `### Phase Transition Decision Points\n` +
        `- **Go/No-Go decision** based on results vs. expectations\n` +
        `- **Board approval** for next-phase budget allocation\n` +
        `- **Regulatory clearance** from CAMI/provincial authorities\n` +
        `- **Community consent** where required (FPIC principles)`,
      data: {
        phase: phase.phase,
        milestones: phase.keyActivities,
        completionCriteria: ['activities_complete', 'risk_reviewed', 'budget_on_track', 'regulatory_met'],
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_milestone_next',
          label: `View Phase ${phaseNum < 10 ? phaseNum + 1 : 1} milestones`,
          type: 'dispatch',
          payload: { agentId: 'pursuit', query: `Phase ${phaseNum < 10 ? phaseNum + 1 : 1} milestones` },
        },
      ],
    };
  }

  // ----- Default / welcome response -----
  return {
    id: generateMessageId(),
    agentId: 'pursuit',
    role: 'agent',
    content:
      `## Project Pursuit Agent — Ready\n\n` +
      `I guide you through the 10-phase mining lifecycle for DRC gold projects. I can help with:\n\n` +
      `- **Phase guidance** — Ask about any phase (1-10) or say "what's next"\n` +
      `- **Cost estimation** — Budget and capex/opex benchmarks for DRC\n` +
      `- **Timeline planning** — Realistic schedules with DRC-specific delays\n` +
      `- **Risk assessment** — Security, regulatory, operational, and social risks\n` +
      `- **Team requirements** — Staffing needs and salary benchmarks\n` +
      `- **Drilling programs** — DRC drilling costs and logistics\n` +
      `- **Geology** — Belt-by-belt deposit guidance\n` +
      `- **Economics** — NPV, IRR, and fiscal regime analysis\n` +
      `- **Financing** — Capital raising strategies for DRC\n` +
      `- **Milestones** — Progress tracking and checklists\n\n` +
      (projectRef
        ? `I see you're working on project \`${projectRef}\`. I'll tailor my guidance to that project's specific context.\n\n`
        : '') +
      `What would you like to explore?`,
    data: {
      capabilities: [
        'phase_guidance', 'cost_estimation', 'timeline', 'risk_assessment',
        'team_requirements', 'drilling', 'geology', 'economics', 'financing', 'milestones',
      ],
    },
    timestamp: new Date().toISOString(),
    actions: [
      { id: 'action_default_overview', label: 'Full lifecycle overview', type: 'dispatch', payload: { agentId: 'pursuit', query: 'Show me the full lifecycle overview' } },
      { id: 'action_default_phase1', label: 'Start with Phase 1', type: 'dispatch', payload: { agentId: 'pursuit', query: 'Tell me about phase 1' } },
      { id: 'action_default_costs', label: 'Cost estimation', type: 'dispatch', payload: { agentId: 'pursuit', query: 'What are the costs for a DRC gold project?' } },
      { id: 'action_default_risks', label: 'Risk assessment', type: 'dispatch', payload: { agentId: 'pursuit', query: 'What are the key risks?' } },
    ],
  };
}
