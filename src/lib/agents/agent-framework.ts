// ============================================================================
// Agent Framework — Core types, definitions, and dispatch system
// DRC Gold Mining Intelligence Platform
// ============================================================================

// ---------------------------------------------------------------------------
// Core types
// ---------------------------------------------------------------------------

export type AgentId = 'pursuit' | 'local-intel' | 'research' | 'paperwork' | 'trip' | 'language';

export interface Agent {
  id: AgentId;
  name: string;
  role: string;
  avatar: string; // lucide icon name
  capabilities: string[];
  status: 'idle' | 'working' | 'dispatched';
  color: string;
}

export interface AgentMessage {
  id: string;
  agentId: AgentId;
  role: 'agent' | 'user' | 'system';
  content: string;
  data?: Record<string, unknown>;
  timestamp: string;
  actions?: AgentAction[];
}

export interface AgentAction {
  id: string;
  label: string;
  type: 'navigate' | 'dispatch' | 'generate' | 'analyze';
  payload: Record<string, unknown>;
}

export interface AgentTask {
  id: string;
  agentId: AgentId;
  type: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  results?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Agent roster
// ---------------------------------------------------------------------------

export const AGENTS: Agent[] = [
  {
    id: 'pursuit',
    name: 'Project Pursuit Agent',
    role: 'Mining lifecycle guidance and project pursuit simulation',
    avatar: 'Crosshair',
    capabilities: [
      'Phase-by-phase project guidance',
      'Cost estimation',
      'Timeline planning',
      'Risk assessment',
      'Milestone tracking',
    ],
    status: 'idle',
    color: '#D4AF37',
  },
  {
    id: 'local-intel',
    name: 'Local Intelligence Agent',
    role: 'Regional intelligence gathering and local data enrichment',
    avatar: 'Eye',
    capabilities: [
      'Regional security assessment',
      'Cultural intelligence',
      'Infrastructure analysis',
      'Accommodation finding',
      'Company identification',
      'Artisanal mining assessment',
    ],
    status: 'idle',
    color: '#4488FF',
  },
  {
    id: 'research',
    name: 'Research Dispatch Agent',
    role: 'Deploy and manage local research operatives',
    avatar: 'Radio',
    capabilities: [
      'Dispatch local researchers',
      'Manage field tasks',
      'Collect ground data',
      'Hire local translators',
      'Commission soil/water samples',
    ],
    status: 'idle',
    color: '#00FF88',
  },
  {
    id: 'paperwork',
    name: 'Regulatory & Paperwork Agent',
    role: 'DRC Mining Code compliance and permit navigation',
    avatar: 'FileCheck',
    capabilities: [
      'CAMI permit guidance',
      'Mining Code compliance',
      'ESIA requirements',
      'Tax obligation tracking',
      'Document preparation',
    ],
    status: 'idle',
    color: '#FF8800',
  },
  {
    id: 'trip',
    name: 'Trip Planning Agent',
    role: 'Travel logistics and meeting coordination',
    avatar: 'Plane',
    capabilities: [
      'Flight routing',
      'Ground transport',
      'Accommodation booking',
      'Meeting scheduling',
      'Security arrangements',
      'Equipment logistics',
    ],
    status: 'idle',
    color: '#A78BFA',
  },
  {
    id: 'language',
    name: 'Language & Communication Agent',
    role: 'Translation, cultural guidance, and local communication',
    avatar: 'Languages',
    capabilities: [
      'French/Swahili/Lingala translation',
      'Cultural etiquette',
      'Community engagement scripts',
      'Hiring communication',
      'Negotiation templates',
    ],
    status: 'idle',
    color: '#FF6B9D',
  },
];

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

export function getAgentById(id: AgentId): Agent | undefined {
  return AGENTS.find((a) => a.id === id);
}

// ---------------------------------------------------------------------------
// ID generators
// ---------------------------------------------------------------------------

export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function generateTaskId(): string {
  return `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

// ---------------------------------------------------------------------------
// Agent dispatch — route a user message to the correct agent handler
// ---------------------------------------------------------------------------

const AGENT_KEYWORDS: Record<AgentId, string[]> = {
  pursuit: [
    'phase', 'pursuit', 'lifecycle', 'milestone', 'timeline', 'cost',
    'budget', 'feasibility', 'bankable', 'scoping', 'prefeasibility',
    'construction', 'production', 'closure', 'exploration', 'drilling',
    'resource', 'estimate', 'next step', 'what phase', 'project plan',
  ],
  'local-intel': [
    'security', 'intelligence', 'local', 'region', 'province', 'territory',
    'accommodation', 'hotel', 'company', 'companies', 'artisanal', 'asm',
    'culture', 'ethnic', 'infrastructure', 'road', 'airport', 'power',
    'armed group', 'conflict', 'safe', 'danger', 'risk area',
  ],
  research: [
    'dispatch', 'researcher', 'field', 'survey', 'sample', 'soil',
    'water', 'hire', 'translator', 'operative', 'ground truth',
    'collect data', 'send team', 'commission', 'investigation',
  ],
  paperwork: [
    'permit', 'license', 'cami', 'mining code', 'regulation',
    'compliance', 'esia', 'environmental', 'tax', 'royalty',
    'cadastre', 'application', 'form', 'document', 'legal',
    'regulatory', 'government', 'ministry',
  ],
  trip: [
    'trip', 'travel', 'flight', 'transport', 'accommodation',
    'itinerary', 'visit', 'meeting', 'schedule', 'logistics',
    'book', 'arrange', 'plan trip', 'go to', 'fly to',
    'security arrangement', 'vehicle', 'driver',
  ],
  language: [
    'translate', 'translation', 'french', 'swahili', 'lingala',
    'tshiluba', 'kikongo', 'language', 'phrase', 'greeting',
    'communication', 'template', 'cultural', 'etiquette',
    'negotiate', 'community engagement',
  ],
};

/**
 * Determine the best agent to handle a user message.
 * Returns the AgentId with the highest keyword-match score, or 'pursuit'
 * as the default fallback.
 */
export function routeMessage(message: string): AgentId {
  const lower = message.toLowerCase();
  let bestAgent: AgentId = 'pursuit';
  let bestScore = 0;

  for (const [agentId, keywords] of Object.entries(AGENT_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestAgent = agentId as AgentId;
    }
  }

  return bestAgent;
}

// ---------------------------------------------------------------------------
// Conversation context helpers
// ---------------------------------------------------------------------------

export interface ConversationContext {
  projectId?: string;
  currentPhase?: number;
  province?: string;
  territory?: string;
  activeTaskCount?: number;
  permitType?: string;
  currentStep?: string;
  destination?: string;
  teamSize?: number;
  targetLanguage?: string;
}

/**
 * Extract contextual hints from a user message (project references,
 * province names, language targets, etc.).
 */
export function extractContext(message: string): ConversationContext {
  const lower = message.toLowerCase();
  const ctx: ConversationContext = {};

  // Project ID detection
  const projectMatch = lower.match(/drc_\w+_\d+/);
  if (projectMatch) {
    ctx.projectId = projectMatch[0];
  }

  // Named project detection
  const projectNames: Record<string, string> = {
    kibali: 'drc_kibali_001',
    twangiza: 'drc_twangiza_002',
    namoya: 'drc_namoya_003',
    misisi: 'drc_misisi_004',
    akyanga: 'drc_misisi_004',
    adumbi: 'drc_adumbi_005',
    imbo: 'drc_adumbi_005',
    loncor: 'drc_adumbi_005',
    giro: 'drc_giro_006',
    kebigada: 'drc_giro_006',
    nizi: 'drc_nizi_008',
    kamituga: 'drc_kamituga_009',
    mongbwalu: 'drc_mongbwalu_010',
  };

  for (const [name, id] of Object.entries(projectNames)) {
    if (lower.includes(name)) {
      ctx.projectId = id;
      break;
    }
  }

  // Phase number detection
  const phaseMatch = lower.match(/phase\s*(\d+)/);
  if (phaseMatch) {
    ctx.currentPhase = parseInt(phaseMatch[1], 10);
  }

  // Province detection
  const provinces = [
    'haut-uele', 'ituri', 'south kivu', 'sud-kivu', 'maniema',
    'nord-kivu', 'north kivu', 'tshopo', 'tanganyika', 'kasai',
    'kinshasa', 'katanga', 'haut-katanga', 'lualaba',
  ];
  for (const prov of provinces) {
    if (lower.includes(prov)) {
      ctx.province = prov;
      break;
    }
  }

  // Language detection
  const languages = ['french', 'swahili', 'lingala', 'tshiluba', 'kikongo'];
  for (const lang of languages) {
    if (lower.includes(lang)) {
      ctx.targetLanguage = lang;
      break;
    }
  }

  // Team size detection
  const teamMatch = lower.match(/(\d+)\s*(?:people|person|team members|members|geologists|engineers)/);
  if (teamMatch) {
    ctx.teamSize = parseInt(teamMatch[1], 10);
  }

  return ctx;
}
