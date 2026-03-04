export interface DRCCulturalRule {
  id: string;
  category: 'greeting' | 'business' | 'mining' | 'religious' | 'social' | 'dining';
  rule: string;
  region: string;
  importanceLevel: 'critical' | 'important' | 'helpful';
  notes: string;
}

export const DRC_CULTURE: DRCCulturalRule[] = [
  {
    id: 'culture-001',
    category: 'greeting',
    rule: 'Always greet the senior-most person first, then work clockwise through the room.',
    region: 'National',
    importanceLevel: 'critical',
    notes: 'Skipping formal greetings is widely read as disrespectful, especially in provincial offices.',
  },
  {
    id: 'culture-002',
    category: 'business',
    rule: 'Use French for all formal documentation, agendas, and government-facing correspondence.',
    region: 'National',
    importanceLevel: 'critical',
    notes: 'English summaries are useful internally, but decision-makers expect French originals.',
  },
  {
    id: 'culture-003',
    category: 'mining',
    rule: 'Engage customary chiefs and community leaders before speaking about permits, drilling, or land access.',
    region: 'National',
    importanceLevel: 'critical',
    notes: 'Statutory rights do not replace customary legitimacy in community perception.',
  },
  {
    id: 'culture-004',
    category: 'social',
    rule: 'Budget time for extended introductions and relationship-building before commercial discussion.',
    region: 'National',
    importanceLevel: 'important',
    notes: 'Fast transitions into pricing or negotiations can reduce trust quickly.',
  },
  {
    id: 'culture-005',
    category: 'religious',
    rule: 'Avoid scheduling critical community meetings during major church services or prayer blocks.',
    region: 'National',
    importanceLevel: 'important',
    notes: 'Church networks often shape local influence and turnout.',
  },
  {
    id: 'culture-006',
    category: 'dining',
    rule: 'Accepting tea, water, or a light refreshment is often part of the trust-building ritual.',
    region: 'National',
    importanceLevel: 'helpful',
    notes: 'Declining without explanation can feel abrupt.',
  },
  {
    id: 'culture-007',
    category: 'business',
    rule: 'Carry printed business cards and hand them over with a brief, clear explanation of your role.',
    region: 'Kinshasa',
    importanceLevel: 'helpful',
    notes: 'This plays especially well in ministerial and investor-facing meetings.',
  },
  {
    id: 'culture-008',
    category: 'mining',
    rule: 'In South Kivu and Maniema, explain how artisanal miners and local cooperatives will be treated before discussing technical plans.',
    region: 'South Kivu / Maniema',
    importanceLevel: 'critical',
    notes: 'ASM displacement anxiety is one of the fastest ways to trigger resistance.',
  },
  {
    id: 'culture-009',
    category: 'social',
    rule: 'In Ituri, avoid language that appears to privilege one ethnic bloc over another.',
    region: 'Ituri',
    importanceLevel: 'critical',
    notes: 'Neutral phrasing matters because of Lendu-Hema conflict history.',
  },
  {
    id: 'culture-010',
    category: 'greeting',
    rule: 'In Haut-Uele and Ituri, local interpreters should introduce your team in both French and a locally dominant language when possible.',
    region: 'Haut-Uele / Ituri',
    importanceLevel: 'important',
    notes: 'It signals seriousness and lowers suspicion in remote sites.',
  },
  {
    id: 'culture-011',
    category: 'business',
    rule: 'Do not promise jobs, roads, or schools casually; verbal commitments are remembered as formal commitments.',
    region: 'National',
    importanceLevel: 'critical',
    notes: 'Overpromising creates long-tail reputational and security issues.',
  },
  {
    id: 'culture-012',
    category: 'religious',
    rule: 'Dress conservatively for church-linked guesthouses and mission compounds in remote areas.',
    region: 'South Kivu / Haut-Uele / Maniema',
    importanceLevel: 'important',
    notes: 'Mission properties are common accommodation fallback options near field zones.',
  },
  {
    id: 'culture-013',
    category: 'mining',
    rule: 'Use community liaison staff to explain environmental sampling, drone work, and photography before field deployment.',
    region: 'National',
    importanceLevel: 'important',
    notes: 'Unexplained imagery or technical equipment can trigger rumors quickly.',
  },
  {
    id: 'culture-014',
    category: 'social',
    rule: 'Small protocol gifts should be symbolic and transparent, never framed as personal compensation.',
    region: 'National',
    importanceLevel: 'important',
    notes: 'Think notebooks, refreshments, or community-fund contributions, not private cash handoffs.',
  },
  {
    id: 'culture-015',
    category: 'dining',
    rule: 'If invited to a local meal, wait to be shown your seat and avoid rushing the close of the meeting.',
    region: 'National',
    importanceLevel: 'helpful',
    notes: 'Patience during the exit ritual is part of maintaining respect.',
  },
];

function normalize(value: string) {
  return value.toLowerCase().trim();
}

export function getCultureByRegion(region: string) {
  const normalizedRegion = normalize(region);
  return DRC_CULTURE.filter((rule) => normalize(rule.region).includes(normalizedRegion) || rule.region === 'National');
}
