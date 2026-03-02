// ============================================================================
// Research Dispatch Agent — Deploy and manage local research operatives
// DRC Gold Mining Intelligence Platform
// ============================================================================

import { AgentMessage, AgentAction, generateMessageId, generateTaskId } from './agent-framework';

// ---------------------------------------------------------------------------
// Research task templates
// ---------------------------------------------------------------------------

interface ResearchTaskTemplate {
  type: string;
  name: string;
  description: string;
  estimatedDuration: string;
  estimatedCost: string;
  personnelRequired: string[];
  deliverables: string[];
  risks: string[];
}

const RESEARCH_TASK_TEMPLATES: ResearchTaskTemplate[] = [
  {
    type: 'ground_survey',
    name: 'Ground Survey & Site Assessment',
    description: 'Dispatch a local researcher to conduct a preliminary ground survey of a target area, including access routes, infrastructure, ASM activity, and general site conditions.',
    estimatedDuration: '5-10 days',
    estimatedCost: '$2,000 - $5,000',
    personnelRequired: ['Local researcher', 'Driver', 'Security escort (if high-risk area)'],
    deliverables: ['Photo report', 'GPS waypoints', 'Access route assessment', 'ASM activity log', 'Community contact list'],
    risks: ['Security incidents', 'Road access blocked', 'Community refusal', 'Weather delays'],
  },
  {
    type: 'soil_sampling',
    name: 'Soil/Stream Sediment Sampling',
    description: 'Commission geochemical sampling campaign including soil, stream sediment, and/or rock chip samples with GPS locations and field descriptions.',
    estimatedDuration: '10-21 days',
    estimatedCost: '$5,000 - $15,000',
    personnelRequired: ['Field geologist', 'Sample technicians (x2)', 'Driver', 'Porter team (if remote)', 'Security escort'],
    deliverables: ['Sample database with GPS', 'Field descriptions', 'Sample shipment to lab', 'Preliminary geological map', 'Photo log'],
    risks: ['Sample contamination', 'ASM interference', 'Access difficulties', 'Rainy season delays', 'Sample transport challenges'],
  },
  {
    type: 'community_assessment',
    name: 'Community & Stakeholder Assessment',
    description: 'Map community structures, identify key stakeholders, assess community sentiment toward mining, and document any existing land use conflicts.',
    estimatedDuration: '7-14 days',
    estimatedCost: '$3,000 - $8,000',
    personnelRequired: ['Social researcher', 'Local translator', 'Community liaison', 'Driver'],
    deliverables: ['Stakeholder map', 'Community profile', 'Sentiment assessment report', 'Land use conflict register', 'Communication recommendations'],
    risks: ['Community hostility', 'Misinformation about project intentions', 'Language barriers', 'Security restrictions'],
  },
  {
    type: 'asm_survey',
    name: 'Artisanal Mining (ASM) Survey',
    description: 'Survey artisanal mining activity in and around a target concession: miner counts, methods, production estimates, supply chains, and armed group involvement.',
    estimatedDuration: '7-14 days',
    estimatedCost: '$3,000 - $10,000',
    personnelRequired: ['ASM researcher (specialized)', 'Local translator', 'Driver', 'Security assessment'],
    deliverables: ['ASM activity map (GPS)', 'Miner count estimates', 'Mining method documentation', 'Supply chain analysis', 'Armed group involvement assessment', 'Photo/video documentation'],
    risks: ['Researcher safety', 'ASM hostility to outsiders', 'Armed group interference', 'Misleading information', 'Legal sensitivities'],
  },
  {
    type: 'security_assessment',
    name: 'Ground-Truth Security Assessment',
    description: 'Commission a local security assessment with current on-ground threat information, travel route risks, checkpoint mapping, and emergency evacuation options.',
    estimatedDuration: '5-10 days',
    estimatedCost: '$3,000 - $8,000',
    personnelRequired: ['Security consultant (local)', 'Driver', 'Military/police contacts'],
    deliverables: ['Security assessment report', 'Checkpoint map', 'Armed group activity log', 'Evacuation route plan', 'Security provider recommendations', 'Communication protocol'],
    risks: ['Researcher exposure to conflict', 'Rapidly changing security situation', 'Information reliability'],
  },
  {
    type: 'infrastructure_survey',
    name: 'Infrastructure & Logistics Survey',
    description: 'Assess road conditions, bridge capacities, water sources, power availability, and potential camp/laydown sites for a mining project.',
    estimatedDuration: '5-10 days',
    estimatedCost: '$2,000 - $6,000',
    personnelRequired: ['Engineer/technician', 'Driver', 'GPS operator'],
    deliverables: ['Road condition report (GPS-tagged photos)', 'Bridge capacity assessment', 'Water source identification', 'Power availability assessment', 'Camp site options', 'Logistics cost model inputs'],
    risks: ['Road access limitations', 'Security constraints', 'Rainy season inaccessibility'],
  },
  {
    type: 'legal_due_diligence',
    name: 'Legal & Permit Due Diligence',
    description: 'Conduct in-country due diligence on permit status, title chain, CAMI records, and any disputes or overlapping claims.',
    estimatedDuration: '10-21 days',
    estimatedCost: '$5,000 - $15,000',
    personnelRequired: ['DRC mining lawyer', 'CAMI liaison', 'Provincial mining division contact'],
    deliverables: ['Title chain report', 'CAMI record verification', 'Dispute/conflict check', 'Permit status summary', 'Regulatory compliance checklist'],
    risks: ['Incomplete CAMI records', 'Conflicting information', 'Bureaucratic delays', 'Facilitation expectations'],
  },
  {
    type: 'translator_hire',
    name: 'Local Translator Recruitment',
    description: 'Identify and hire qualified local translators for specific language pairs needed for community engagement and field operations.',
    estimatedDuration: '3-7 days',
    estimatedCost: '$500 - $2,000',
    personnelRequired: ['HR/recruitment contact', 'Local network'],
    deliverables: ['Translator candidate list', 'Language assessment results', 'Availability and rates', 'Reference checks'],
    risks: ['Limited qualified candidates in remote areas', 'Reliability concerns', 'Security vetting required'],
  },
];

// ---------------------------------------------------------------------------
// Response generation
// ---------------------------------------------------------------------------

function matchTaskTemplate(msg: string): ResearchTaskTemplate | null {
  const lower = msg.toLowerCase();

  const typeKeywords: Record<string, string[]> = {
    ground_survey: ['survey', 'ground survey', 'site assessment', 'site visit', 'reconnaissance', 'scout'],
    soil_sampling: ['soil', 'sample', 'sampling', 'geochemical', 'stream sediment', 'rock chip', 'assay'],
    community_assessment: ['community', 'stakeholder', 'sentiment', 'social', 'land use', 'community assessment'],
    asm_survey: ['artisanal', 'asm', 'creuseur', 'small scale miner', 'informal mining'],
    security_assessment: ['security assessment', 'threat assessment', 'security survey', 'checkpoint', 'evacuation'],
    infrastructure_survey: ['infrastructure', 'road condition', 'bridge', 'water source', 'camp site', 'logistics survey'],
    legal_due_diligence: ['legal', 'due diligence', 'title', 'permit check', 'cami record', 'claim'],
    translator_hire: ['translator', 'interpreter', 'hire translator', 'language support', 'recruit translator'],
  };

  let bestMatch: string | null = null;
  let bestScore = 0;

  for (const [type, keywords] of Object.entries(typeKeywords)) {
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) score += 1;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMatch = type;
    }
  }

  if (bestMatch && bestScore > 0) {
    return RESEARCH_TASK_TEMPLATES.find((t) => t.type === bestMatch) ?? null;
  }
  return null;
}

function buildTaskDispatchResponse(template: ResearchTaskTemplate, location?: string): AgentMessage {
  const taskId = generateTaskId();
  const locationNote = location ? ` in ${location}` : '';

  return {
    id: generateMessageId(),
    agentId: 'research',
    role: 'agent',
    content:
      `## Research Task Created: ${template.name}\n\n` +
      `**Task ID:** \`${taskId}\`\n` +
      `**Location:** ${location || 'To be specified'}\n` +
      `**Status:** PENDING — Awaiting dispatch confirmation\n\n` +
      `### Task Description\n` +
      `${template.description}\n\n` +
      `### Estimated Timeline & Cost\n` +
      `- **Duration:** ${template.estimatedDuration}\n` +
      `- **Estimated cost:** ${template.estimatedCost}\n\n` +
      `### Personnel Required\n` +
      template.personnelRequired.map((p) => `- ${p}`).join('\n') +
      `\n\n### Expected Deliverables\n` +
      template.deliverables.map((d) => `- ${d}`).join('\n') +
      `\n\n### Risk Factors\n` +
      template.risks.map((r) => `- ${r}`).join('\n') +
      `\n\n### Next Steps\n` +
      `1. Confirm location and specific requirements\n` +
      `2. Identify and brief local research operative${locationNote}\n` +
      `3. Arrange logistics (transport, accommodation, security)\n` +
      `4. Dispatch team and begin data collection\n` +
      `5. Receive and review deliverables\n\n` +
      `**Shall I proceed with dispatch confirmation?**`,
    data: {
      taskId,
      taskType: template.type,
      taskName: template.name,
      location: location || null,
      estimatedDuration: template.estimatedDuration,
      estimatedCost: template.estimatedCost,
      personnel: template.personnelRequired,
      deliverables: template.deliverables,
      status: 'pending',
    },
    timestamp: new Date().toISOString(),
    actions: [
      {
        id: `action_confirm_${taskId}`,
        label: 'Confirm & dispatch',
        type: 'dispatch',
        payload: { taskId, action: 'confirm_dispatch' },
      },
      {
        id: `action_modify_${taskId}`,
        label: 'Modify requirements',
        type: 'generate',
        payload: { taskId, action: 'modify' },
      },
      {
        id: `action_cost_${taskId}`,
        label: 'Detailed cost breakdown',
        type: 'analyze',
        payload: { taskId, analysis: 'cost_breakdown' },
      },
      {
        id: `action_intel_${taskId}`,
        label: 'Get area intelligence first',
        type: 'dispatch',
        payload: { agentId: 'local-intel', query: `Intelligence briefing for ${location || 'the target area'}` },
      },
    ],
  };
}

export function getResearchDispatchResponse(
  message: string,
  context?: { activeTaskCount?: number },
): AgentMessage {
  const msg = message.toLowerCase();
  const activeCount = context?.activeTaskCount ?? 0;

  // Extract location from message
  const locationPatterns = [
    /(?:in|at|to|near|around)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/,
    /(?:kibali|twangiza|namoya|misisi|adumbi|giro|kamituga|mongbwalu|bukavu|bunia|kindu|isiro|goma)/i,
  ];
  let location: string | undefined;
  for (const pattern of locationPatterns) {
    const match = message.match(pattern);
    if (match) {
      location = match[1] || match[0];
      break;
    }
  }

  // ----- Task template match -----
  const template = matchTaskTemplate(msg);
  if (template) {
    return buildTaskDispatchResponse(template, location);
  }

  // ----- Generic dispatch request -----
  if (msg.includes('dispatch') || msg.includes('send') || msg.includes('deploy')) {
    return {
      id: generateMessageId(),
      agentId: 'research',
      role: 'agent',
      content:
        `## Research Dispatch — Task Selection\n\n` +
        `I can dispatch local research operatives for the following task types:\n\n` +
        RESEARCH_TASK_TEMPLATES.map(
          (t, i) => `### ${i + 1}. ${t.name}\n${t.description}\n- **Duration:** ${t.estimatedDuration} | **Cost:** ${t.estimatedCost}`
        ).join('\n\n') +
        `\n\n${activeCount > 0 ? `**Active tasks:** ${activeCount} currently in progress.\n\n` : ''}` +
        `Which type of research task would you like to commission${location ? ` for ${location}` : ''}?`,
      data: {
        availableTasks: RESEARCH_TASK_TEMPLATES.map((t) => ({
          type: t.type,
          name: t.name,
          cost: t.estimatedCost,
          duration: t.estimatedDuration,
        })),
        activeTaskCount: activeCount,
        suggestedLocation: location,
      },
      timestamp: new Date().toISOString(),
      actions: RESEARCH_TASK_TEMPLATES.slice(0, 4).map((t) => ({
        id: `action_select_${t.type}`,
        label: t.name,
        type: 'dispatch' as const,
        payload: { agentId: 'research', query: `Dispatch ${t.name}${location ? ` to ${location}` : ''}` },
      })),
    };
  }

  // ----- Task status queries -----
  if (msg.includes('status') || msg.includes('progress') || msg.includes('update') || msg.includes('active task')) {
    if (activeCount === 0) {
      return {
        id: generateMessageId(),
        agentId: 'research',
        role: 'agent',
        content:
          `## Research Task Status\n\n` +
          `No active research tasks at this time.\n\n` +
          `Would you like to commission a new research task? I can dispatch local operatives for surveys, sampling, community assessments, security evaluations, and more.`,
        data: { activeTaskCount: 0 },
        timestamp: new Date().toISOString(),
        actions: [
          {
            id: 'action_new_task',
            label: 'Create new research task',
            type: 'dispatch',
            payload: { agentId: 'research', query: 'What research tasks can you dispatch?' },
          },
        ],
      };
    }

    return {
      id: generateMessageId(),
      agentId: 'research',
      role: 'agent',
      content:
        `## Research Task Status\n\n` +
        `**Active tasks:** ${activeCount}\n\n` +
        `### Task Management\n` +
        `Research tasks typically run for 5-21 days depending on type and complexity. I can provide:\n` +
        `- Progress updates from field operatives\n` +
        `- Interim deliverables as they become available\n` +
        `- Risk alerts and security updates\n` +
        `- Cost tracking against budget\n\n` +
        `Would you like to see details on a specific task, or commission a new one?`,
      data: { activeTaskCount: activeCount },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_task_details',
          label: 'View task details',
          type: 'analyze',
          payload: { analysis: 'task_details' },
        },
        {
          id: 'action_new_task',
          label: 'Commission new task',
          type: 'dispatch',
          payload: { agentId: 'research', query: 'What research tasks can you dispatch?' },
        },
      ],
    };
  }

  // ----- Cost / budget queries -----
  if (msg.includes('cost') || msg.includes('budget') || msg.includes('price') || msg.includes('how much')) {
    return {
      id: generateMessageId(),
      agentId: 'research',
      role: 'agent',
      content:
        `## Research Task Cost Guide\n\n` +
        `### Task Cost Summary\n\n` +
        `| Task Type | Duration | Cost Range |\n` +
        `|-----------|----------|------------|\n` +
        RESEARCH_TASK_TEMPLATES.map((t) => `| ${t.name} | ${t.estimatedDuration} | ${t.estimatedCost} |`).join('\n') +
        `\n\n### Cost Components\n` +
        `- **Personnel daily rates:**\n` +
        `  - Local researcher/geologist: $100-200/day\n` +
        `  - Security escort: $50-100/day\n` +
        `  - Driver + vehicle: $80-150/day\n` +
        `  - Translator: $50-80/day\n` +
        `  - Porters (remote areas): $15-25/day each\n\n` +
        `- **Logistics:**\n` +
        `  - 4x4 vehicle rental: $100-180/day (with driver)\n` +
        `  - Fuel (remote areas): $2-3/liter (higher in remote locations)\n` +
        `  - Accommodation (field): $30-80/night\n` +
        `  - Communication (satellite phone): $5-10/minute\n\n` +
        `- **Lab/Analysis:**\n` +
        `  - Soil sample assay: $25-40/sample (Au fire assay)\n` +
        `  - Multi-element ICP: $30-50/sample\n` +
        `  - Sample shipping to lab: $500-2,000/batch\n\n` +
        `### Payment Notes\n` +
        `- Cash is dominant in rural DRC — plan for significant cash handling\n` +
        `- Mobile money (M-Pesa, Airtel Money) increasingly accepted in towns\n` +
        `- Budget 10-15% contingency for unexpected expenses\n` +
        `- Facilitation costs (informal) should be factored into budgets`,
      data: {
        tasks: RESEARCH_TASK_TEMPLATES.map((t) => ({
          name: t.name,
          cost: t.estimatedCost,
          duration: t.estimatedDuration,
        })),
        dailyRates: {
          researcher: '$100-200',
          security: '$50-100',
          driver: '$80-150',
          translator: '$50-80',
        },
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_cost_commission',
          label: 'Commission a task',
          type: 'dispatch',
          payload: { agentId: 'research', query: 'I want to dispatch a research task' },
        },
      ],
    };
  }

  // ----- Researcher network / hiring -----
  if (msg.includes('researcher') || msg.includes('operative') || msg.includes('field team') || msg.includes('find someone') || msg.includes('local expert')) {
    return {
      id: generateMessageId(),
      agentId: 'research',
      role: 'agent',
      content:
        `## Research Operative Network — DRC\n\n` +
        `### Available Researcher Profiles\n\n` +
        `**Geologists/Technical:**\n` +
        `- Kinshasa-based: University of Kinshasa and University of Lubumbashi geology graduates\n` +
        `- Field-experienced geologists with DRC exploration backgrounds\n` +
        `- Available for soil sampling, mapping, and site assessment\n\n` +
        `**Social Researchers:**\n` +
        `- Community engagement specialists with NGO backgrounds\n` +
        `- Experienced in FPIC processes and stakeholder mapping\n` +
        `- Local language capabilities (Swahili, Lingala, regional languages)\n\n` +
        `**Security Consultants:**\n` +
        `- Former military/police with current intelligence networks\n` +
        `- UN/MONUSCO veteran consultants\n` +
        `- Risk assessment and evacuation planning specialists\n\n` +
        `**Legal/Regulatory:**\n` +
        `- DRC mining lawyers with CAMI experience\n` +
        `- Due diligence investigators\n` +
        `- Permit expeditors with government connections\n\n` +
        `### Researcher Vetting Process\n` +
        `1. Background check and reference verification\n` +
        `2. Security clearance assessment\n` +
        `3. Skills and language assessment\n` +
        `4. Confidentiality agreement signing\n` +
        `5. Briefing on project scope and safety protocols\n\n` +
        `### Deployment Regions\n` +
        `We can deploy researchers to all major gold mining provinces:\n` +
        `- Haut-Uele (Kibali area)\n` +
        `- Ituri (Bunia, Mambasa, Mongbwalu)\n` +
        `- South Kivu (Bukavu, Mwenga, Fizi)\n` +
        `- Maniema (Kindu, Kabambare)\n` +
        `- North Kivu (Goma, Beni — high security risk)`,
      data: {
        researcherTypes: ['geologist', 'social_researcher', 'security_consultant', 'legal'],
        deploymentRegions: ['Haut-Uele', 'Ituri', 'South Kivu', 'Maniema', 'North Kivu'],
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_hire_geologist',
          label: 'Hire field geologist',
          type: 'dispatch',
          payload: { agentId: 'research', query: 'Hire a local field geologist' },
        },
        {
          id: 'action_hire_community',
          label: 'Hire community liaison',
          type: 'dispatch',
          payload: { agentId: 'research', query: 'Hire a community engagement researcher' },
        },
        {
          id: 'action_hire_translator',
          label: 'Hire translator',
          type: 'dispatch',
          payload: { agentId: 'research', query: 'Dispatch translator hire task' },
        },
      ],
    };
  }

  // ----- Data collection / ground truth -----
  if (msg.includes('data') || msg.includes('ground truth') || msg.includes('verify') || msg.includes('confirm') || msg.includes('validate')) {
    return {
      id: generateMessageId(),
      agentId: 'research',
      role: 'agent',
      content:
        `## Ground Truth Data Collection\n\n` +
        `I can commission field verification of any data point in the intelligence platform. Common ground-truth tasks include:\n\n` +
        `### Geological Verification\n` +
        `- Confirm ASM activity locations and scale\n` +
        `- Verify historical workings and production claims\n` +
        `- Collect rock chip and soil samples for assay confirmation\n` +
        `- Ground-truth satellite imagery anomalies\n\n` +
        `### Access & Infrastructure Verification\n` +
        `- Road condition assessment with GPS-tagged photos\n` +
        `- Bridge capacity testing for heavy equipment\n` +
        `- Water source identification and flow measurement\n` +
        `- Camp site feasibility assessment\n\n` +
        `### Social & Security Verification\n` +
        `- Community sentiment toward mining (structured interviews)\n` +
        `- Armed group presence and activity confirmation\n` +
        `- Checkpoint mapping and toll costs\n` +
        `- Local authority identification and contact\n\n` +
        `### Data Quality Standards\n` +
        `- All locations GPS-tagged (WGS84)\n` +
        `- Photographic documentation mandatory\n` +
        `- Standardized reporting templates used\n` +
        `- Chain of custody for all physical samples\n\n` +
        `What data would you like verified on the ground?`,
      data: {
        verificationTypes: ['geological', 'infrastructure', 'social', 'security'],
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_verify_asm',
          label: 'Verify ASM activity',
          type: 'dispatch',
          payload: { agentId: 'research', query: 'Dispatch ASM survey' },
        },
        {
          id: 'action_verify_road',
          label: 'Verify road access',
          type: 'dispatch',
          payload: { agentId: 'research', query: 'Dispatch infrastructure survey' },
        },
        {
          id: 'action_verify_security',
          label: 'Verify security situation',
          type: 'dispatch',
          payload: { agentId: 'research', query: 'Dispatch security assessment' },
        },
      ],
    };
  }

  // ----- Default response -----
  return {
    id: generateMessageId(),
    agentId: 'research',
    role: 'agent',
    content:
      `## Research Dispatch Agent — Ready\n\n` +
      `I deploy and manage local research operatives across DRC gold mining provinces. I can commission:\n\n` +
      RESEARCH_TASK_TEMPLATES.map(
        (t, i) => `${i + 1}. **${t.name}** — ${t.estimatedDuration}, ${t.estimatedCost}`
      ).join('\n') +
      `\n\n${activeCount > 0 ? `**Currently active tasks:** ${activeCount}\n\n` : ''}` +
      `### How to Use\n` +
      `- Tell me what you need investigated and where\n` +
      `- I will create a task with timeline, cost, and personnel estimates\n` +
      `- Confirm dispatch to deploy the research operative\n` +
      `- Receive deliverables upon task completion\n\n` +
      `What research would you like to commission?`,
    data: {
      availableTasks: RESEARCH_TASK_TEMPLATES.map((t) => t.type),
      activeTaskCount: activeCount,
    },
    timestamp: new Date().toISOString(),
    actions: [
      {
        id: 'action_default_survey',
        label: 'Ground survey',
        type: 'dispatch',
        payload: { agentId: 'research', query: 'Dispatch a ground survey' },
      },
      {
        id: 'action_default_sampling',
        label: 'Soil sampling',
        type: 'dispatch',
        payload: { agentId: 'research', query: 'Commission soil sampling' },
      },
      {
        id: 'action_default_security',
        label: 'Security assessment',
        type: 'dispatch',
        payload: { agentId: 'research', query: 'Commission security assessment' },
      },
      {
        id: 'action_default_community',
        label: 'Community assessment',
        type: 'dispatch',
        payload: { agentId: 'research', query: 'Commission community assessment' },
      },
    ],
  };
}
