// ============================================================================
// Local Intelligence Agent — Regional intelligence gathering
// DRC Gold Mining Intelligence Platform
// ============================================================================

import { AgentMessage, generateMessageId } from './agent-framework';
import { getHotelsByProvince } from '../../data/drc-hotels';
import { getGovernmentByProvince } from '../../data/drc-government';
import { getCultureByRegion } from '../../data/drc-culture';
import { getSportsByProvince } from '../../data/drc-sports';

// ---------------------------------------------------------------------------
// Province intelligence summaries (inline; full data in src/data/drc-local-intel.ts)
// ---------------------------------------------------------------------------

interface ProvinceIntel {
  name: string;
  aliases: string[];
  capital: string;
  securityLevel: 'low' | 'medium' | 'high' | 'critical';
  armedGroups: string[];
  languages: string[];
  ethnicGroups: string[];
  infrastructure: {
    airports: string[];
    majorRoads: string[];
    power: string;
    telecom: string;
  };
  accommodation: string[];
  keyCompanies: string[];
  asmActivity: string;
  culturalNotes: string;
}

const PROVINCE_INTEL: ProvinceIntel[] = [
  {
    name: 'Haut-Uele',
    aliases: ['haut-uele', 'haut uele', 'upper uele'],
    capital: 'Isiro',
    securityLevel: 'medium',
    armedGroups: ['LRA remnants', 'Local Mai-Mai factions', 'Cross-border armed elements'],
    languages: ['French', 'Lingala', 'Zande', 'Lugbara', 'Swahili'],
    ethnicGroups: ['Zande', 'Lugbara', 'Mangbetu', 'Logo', 'Alur'],
    infrastructure: {
      airports: ['Isiro Airport (domestic)', 'Doko Airstrip (Kibali mine)'],
      majorRoads: ['RN4 (Kisangani-Isiro)', 'Mine-maintained road network around Kibali'],
      power: 'Kibali hydroelectric (Azambi/Ambarau — 42MW). Otherwise diesel generation.',
      telecom: 'Airtel and Vodacom coverage in main towns. Limited outside.',
    },
    accommodation: [
      'Kibali mine guesthouse (restricted)',
      'Hotels in Isiro (basic)',
      'Church/mission guesthouses in Durba/Watsa',
      'Camp setup required for remote exploration',
    ],
    keyCompanies: ['Barrick Gold (Kibali)', 'AngloGold Ashanti (Kibali JV)', 'SOKIMO (state entity)', 'DRC Gold Corp (Giro option)'],
    asmActivity: 'Moderate ASM around Durba, Watsa, and along Kilo-Moto belt. State gold buying expansion targeting artisanal miners. ~5,000 miners around Kibali concession periphery.',
    culturalNotes: 'Zande cultural dominance in northwest. Respect for traditional chiefs (chefs coutumiers) is essential. Gift-giving protocol expected during community visits. Palm wine often offered at meetings.',
  },
  {
    name: 'Ituri',
    aliases: ['ituri'],
    capital: 'Bunia',
    securityLevel: 'high',
    armedGroups: ['CODECO (Cooperative for the Development of Congo)', 'FPIC', 'ADF (Allied Democratic Forces)', 'Various Mai-Mai'],
    languages: ['French', 'Swahili', 'Lendu', 'Hema', 'Lingala', 'Alur', 'Bira'],
    ethnicGroups: ['Lendu', 'Hema', 'Alur', 'Bira', 'Lese', 'Mbuti (Pygmy)'],
    infrastructure: {
      airports: ['Bunia Airport (IATA: BUX — domestic, some charter international)'],
      majorRoads: ['RN4 (Bunia-Beni)', 'RN27 (Bunia-Mahagi)', 'Lateritic roads to mining areas'],
      power: 'Very limited. Diesel generation is standard. Some micro-hydro projects.',
      telecom: 'Airtel and Vodacom in Bunia. Patchy coverage elsewhere.',
    },
    accommodation: [
      'Hotel Ituri (Bunia)',
      'Cit Hotel Bunia',
      'MONUSCO-adjacent guesthouses',
      'Mission/NGO guesthouses in Mambasa, Mongbwalu',
    ],
    keyCompanies: ['Loncor Gold (Adumbi/Imbo)', 'Kimia Mining (Okapi area)', 'SOKIMO (historical)', 'AngloGold Ashanti (historical Mongbwalu JV)'],
    asmActivity: 'Extensive ASM across Kilo-Moto belt. Mongbwalu is one of the largest ASM centres (~15,000+ miners). Mambasa area has growing ASM activity. Gold trading networks through Bunia.',
    culturalNotes: 'Lendu-Hema ethnic tensions are historically significant and ongoing. Exercise extreme sensitivity. MONUSCO presence. Indigenous Mbuti (Pygmy) communities in rainforest areas require special FPIC protocols. Ituri is under state of siege since May 2021.',
  },
  {
    name: 'South Kivu',
    aliases: ['south kivu', 'sud-kivu', 'sud kivu'],
    capital: 'Bukavu',
    securityLevel: 'high',
    armedGroups: ['FDLR remnants', 'Various Mai-Mai (Raia Mutomboki, Yakutumba)', 'M23 (northern influence)', 'Twirwaneho'],
    languages: ['French', 'Swahili', 'Mashi', 'Kifuliru', 'Kilega', 'Kibembe'],
    ethnicGroups: ['Shi', 'Lega', 'Fuliru', 'Bembe', 'Vira', 'Banyamulenge'],
    infrastructure: {
      airports: ['Kavumu Airport (Bukavu, IATA: BKY)', 'Lake Kivu boat transport'],
      majorRoads: ['RN2 (Bukavu-Uvira)', 'RN5 (Bukavu-Shabunda)', 'Mine roads to Twangiza'],
      power: 'Ruzizi hydroelectric (shared with Rwanda/Burundi). SNEL grid unreliable. Diesel backup standard.',
      telecom: 'Good coverage in Bukavu. Vodacom, Airtel, Orange. Drops off quickly outside major towns.',
    },
    accommodation: [
      'Hotel Residence (Bukavu)',
      'Orchids Safari Club (Bukavu)',
      'La Roche Hotel (Bukavu)',
      'Mission guesthouses in Mwenga, Fizi',
      'Camp setup for Kamituga, Misisi areas',
    ],
    keyCompanies: ['Shomka Resources (Twangiza)', 'Avanti Gold (Misisi/Akyanga)', 'Various gold trading houses in Bukavu', 'Banro legacy entities'],
    asmActivity: 'Extremely active ASM across the province. Kamituga-Mobale is one of the world\'s largest ASM centres (~200,000 miners). Heavy ASM around Twangiza, Misisi, Shabunda. Gold trading through Bukavu and cross-border to Rwanda/Burundi.',
    culturalNotes: 'Complex ethnic landscape. Banyamulenge community is politically sensitive. Strong civil society organizations. NGO presence is significant. Lake Kivu cultural significance. Community engagement requires extensive consultation. Cross-border dynamics with Rwanda and Burundi are always a factor.',
  },
  {
    name: 'Maniema',
    aliases: ['maniema'],
    capital: 'Kindu',
    securityLevel: 'high',
    armedGroups: ['Mai-Mai factions', 'Armed bandits (coupeurs de routes)', 'Cross-border armed elements'],
    languages: ['French', 'Swahili', 'Kilega', 'Kibembe', 'Kitetela'],
    ethnicGroups: ['Lega', 'Bembe', 'Bangubangu', 'Tetela', 'Hombo'],
    infrastructure: {
      airports: ['Kindu Airport (IATA: KND — domestic)'],
      majorRoads: ['RN2 (Kindu-Bukavu — very poor condition)', 'Lateritic roads, largely degraded'],
      power: 'Very limited grid. Diesel generation. Some micro-hydro potential.',
      telecom: 'Airtel and Vodacom in Kindu. Very limited elsewhere.',
    },
    accommodation: [
      'Hotels in Kindu (very basic)',
      'Camp setup required for any mining area',
      'Namoya mine had own camp facilities (care & maintenance)',
    ],
    keyCompanies: ['Shomka Resources (Namoya)', 'Various ASM cooperatives'],
    asmActivity: 'Very active ASM, especially around Namoya (12,000+ miners). Kabambare territory is a major ASM hub. Limited state oversight creates complex operating environment.',
    culturalNotes: 'Remote and underdeveloped province. Lega cultural practices are dominant in southern areas. Very limited infrastructure means community expectations around employment and development are extremely high. Traditional authority structures are important.',
  },
  {
    name: 'North Kivu',
    aliases: ['north kivu', 'nord-kivu', 'nord kivu'],
    capital: 'Goma',
    securityLevel: 'critical',
    armedGroups: ['M23 (most significant threat)', 'FDLR', 'ADF', 'Nyatura', 'Mai-Mai Mazembe', 'NDC-Renove', 'Numerous other armed factions'],
    languages: ['French', 'Swahili', 'Kinyarwanda', 'Kinande', 'Lingala'],
    ethnicGroups: ['Nande', 'Hutu', 'Tutsi', 'Hunde', 'Nyanga', 'Tembo'],
    infrastructure: {
      airports: ['Goma International Airport (IATA: GOM — international)', 'Beni Airport'],
      majorRoads: ['RN2 (Goma-Bukavu)', 'RN4 (Beni-Butembo-Goma)', 'Most roads in poor condition'],
      power: 'Ruzizi/Matebe hydroelectric. Virunga micro-hydro. SNEL grid unreliable.',
      telecom: 'Good coverage in Goma/Beni. Vodacom, Airtel, Orange.',
    },
    accommodation: [
      'Ihusi Hotel (Goma)',
      'Serena Hotel (Goma)',
      'Hotel Karibu (Goma)',
      'Various guesthouses in Beni, Butembo',
    ],
    keyCompanies: ['Various coltan/cassiterite operators', 'Gold trading houses', 'Cross-border trading networks'],
    asmActivity: 'Extensive ASM across the province, particularly for gold, coltan, cassiterite, and wolframite. Conflict minerals tracing (iTSCi, RMI) is critical. Armed group involvement in mining is well-documented.',
    culturalNotes: 'Most active conflict zone in DRC. M23 occupation of territory is a dynamic situation. Humanitarian crisis is ongoing. Any mining or exploration activity requires extreme security planning. Cross-border dynamics with Rwanda are the dominant political factor. Volcanic activity (Nyiragongo) near Goma.',
  },
];

// ---------------------------------------------------------------------------
// Response generation
// ---------------------------------------------------------------------------

function findProvince(msg: string): ProvinceIntel | null {
  const lower = msg.toLowerCase();
  for (const prov of PROVINCE_INTEL) {
    if (lower.includes(prov.name.toLowerCase())) return prov;
    for (const alias of prov.aliases) {
      if (lower.includes(alias)) return prov;
    }
  }
  // Match by capital city
  for (const prov of PROVINCE_INTEL) {
    if (lower.includes(prov.capital.toLowerCase())) return prov;
  }
  return null;
}

function buildProvinceOverview(prov: ProvinceIntel): AgentMessage {
  const securityEmoji: Record<string, string> = {
    low: 'LOW',
    medium: 'MEDIUM',
    high: 'HIGH',
    critical: 'CRITICAL',
  };
  const hotels = getHotelsByProvince(prov.name).slice(0, 3);
  const offices = getGovernmentByProvince(prov.name).slice(0, 3);
  const culture = getCultureByRegion(prov.name).slice(0, 3);
  const sports = getSportsByProvince(prov.name).slice(0, 2);

  return {
    id: generateMessageId(),
    agentId: 'local-intel',
    role: 'agent',
    content:
      `## Regional Intelligence: ${prov.name} Province\n\n` +
      `**Capital:** ${prov.capital}\n` +
      `**Security Level:** ${securityEmoji[prov.securityLevel]}\n\n` +
      `### Security Assessment\n` +
      `**Active armed groups:** ${prov.armedGroups.join(', ')}\n\n` +
      `### Languages\n` +
      `${prov.languages.join(', ')}\n\n` +
      `### Ethnic Groups\n` +
      `${prov.ethnicGroups.join(', ')}\n\n` +
      `### Infrastructure\n` +
      `- **Airports:** ${prov.infrastructure.airports.join('; ')}\n` +
      `- **Major roads:** ${prov.infrastructure.majorRoads.join('; ')}\n` +
      `- **Power:** ${prov.infrastructure.power}\n` +
      `- **Telecom:** ${prov.infrastructure.telecom}\n\n` +
      `### Accommodation Options\n` +
      prov.accommodation.map((a) => `- ${a}`).join('\n') +
      (hotels.length > 0
        ? `\n\n### Hotel Shortlist\n${hotels.map((hotel) => `- ${hotel.name} (${hotel.city}, ${hotel.priceRange})`).join('\n')}`
        : '') +
      `\n\n### Key Mining Companies\n` +
      prov.keyCompanies.map((c) => `- ${c}`).join('\n') +
      `\n\n### Artisanal Mining Activity\n` +
      `${prov.asmActivity}\n\n` +
      (offices.length > 0
        ? `### Government / Regulator Contacts\n${offices.map((office) => `- ${office.office}: ${office.jurisdiction}`).join('\n')}\n\n`
        : '') +
      (sports.length > 0
        ? `### Sports & Civic Pulse\n${sports.map((club) => `- ${club.name} (${club.city})`).join('\n')}\n\n`
        : '') +
      (culture.length > 0
        ? `### Cultural Protocols\n${culture.map((rule) => `- ${rule.rule}`).join('\n')}\n\n`
        : '') +
      `### Cultural Notes\n` +
      `${prov.culturalNotes}`,
    data: {
      province: prov.name,
      capital: prov.capital,
      securityLevel: prov.securityLevel,
      armedGroups: prov.armedGroups,
      languages: prov.languages,
      companies: prov.keyCompanies,
    },
    timestamp: new Date().toISOString(),
    actions: [
      {
        id: `action_intel_security_${prov.name}`,
        label: 'Detailed security briefing',
        type: 'analyze',
        payload: { analysis: 'security_briefing', province: prov.name },
      },
      {
        id: `action_intel_trip_${prov.name}`,
        label: `Plan trip to ${prov.capital}`,
        type: 'dispatch',
        payload: { agentId: 'trip', query: `Plan a trip to ${prov.capital}, ${prov.name}` },
      },
      {
        id: `action_intel_language_${prov.name}`,
        label: 'Get language briefing',
        type: 'dispatch',
        payload: { agentId: 'language', query: `What languages are spoken in ${prov.name}?` },
      },
      {
        id: `action_intel_research_${prov.name}`,
        label: 'Dispatch local researcher',
        type: 'dispatch',
        payload: { agentId: 'research', query: `Dispatch a researcher to ${prov.name}` },
      },
    ],
  };
}

export function getLocalIntelResponse(
  message: string,
  context?: { province?: string; territory?: string },
): AgentMessage {
  const msg = message.toLowerCase();

  // ----- Province-specific query -----
  const prov = findProvince(msg) ?? (context?.province ? findProvince(context.province) : null);
  if (prov && (msg.includes('overview') || msg.includes('tell me about') || msg.includes('intelligence') || msg.includes('info') || msg.includes('briefing') || msg.length < 50)) {
    return buildProvinceOverview(prov);
  }

  // ----- Security queries -----
  if (msg.includes('security') || msg.includes('safe') || msg.includes('danger') || msg.includes('armed') || msg.includes('conflict') || msg.includes('threat')) {
    if (prov) {
      return {
        id: generateMessageId(),
        agentId: 'local-intel',
        role: 'agent',
        content:
          `## Security Assessment: ${prov.name} Province\n\n` +
          `**Threat Level:** ${prov.securityLevel.toUpperCase()}\n\n` +
          `### Active Armed Groups\n` +
          prov.armedGroups.map((g) => `- **${g}**`).join('\n') +
          `\n\n### Security Recommendations\n` +
          `- **Armed escort:** ${prov.securityLevel === 'critical' || prov.securityLevel === 'high' ? 'REQUIRED for all movement outside major towns' : 'Recommended for field visits'}\n` +
          `- **Travel hours:** Restrict movement to 0600-1600 hours\n` +
          `- **Communication:** Carry satellite phone (Thuraya/Iridium) — mobile coverage unreliable\n` +
          `- **Convoy:** Travel in minimum 2-vehicle convoys\n` +
          `- **Registration:** Register with your embassy and MONUSCO if present\n` +
          `- **Medical:** Carry comprehensive first aid kit. Nearest hospital: ${prov.capital}\n` +
          `- **Evacuation plan:** Pre-arrange air evacuation with charter operator\n\n` +
          `### Recent Security Trends\n` +
          `Intelligence assessments for ${prov.name} should be refreshed every 2 weeks. Contact local MONUSCO office and OCHA for current security updates before travel.`,
        data: {
          province: prov.name,
          threatLevel: prov.securityLevel,
          armedGroups: prov.armedGroups,
          escortRequired: prov.securityLevel === 'critical' || prov.securityLevel === 'high',
        },
        timestamp: new Date().toISOString(),
        actions: [
          {
            id: 'action_security_trip',
            label: 'Plan secure trip',
            type: 'dispatch',
            payload: { agentId: 'trip', query: `Plan a trip to ${prov.name} with security arrangements` },
          },
          {
            id: 'action_security_research',
            label: 'Dispatch security assessment team',
            type: 'dispatch',
            payload: { agentId: 'research', query: `Commission a ground-truth security assessment in ${prov.name}` },
          },
        ],
      };
    }

    // General DRC security overview
    return {
      id: generateMessageId(),
      agentId: 'local-intel',
      role: 'agent',
      content:
        `## DRC Security Overview for Mining Operations\n\n` +
        `### Province Security Levels\n\n` +
        `| Province | Security Level | Key Threats |\n` +
        `|----------|---------------|-------------|\n` +
        PROVINCE_INTEL.map((p) => `| ${p.name} | ${p.securityLevel.toUpperCase()} | ${p.armedGroups.slice(0, 2).join(', ')} |`).join('\n') +
        `\n\n### General Security Guidance\n` +
        `- **Eastern DRC (Kivu, Ituri, Maniema):** Highest risk zone. Multiple active armed groups. MONUSCO present. State of siege in Ituri and North Kivu since May 2021.\n` +
        `- **NE DRC (Haut-Uele):** Moderate risk. LRA remnants. Kibali mine provides stability anchor.\n` +
        `- **Western DRC:** Generally lower risk but petty crime and road banditry present.\n\n` +
        `### Key Security Providers (DRC Mining Sector)\n` +
        `- G4S Congo\n` +
        `- Gardien de la Paix\n` +
        `- Mine-specific private security forces\n` +
        `- FARDC military escort (via provincial military command)\n\n` +
        `Specify a province for a detailed security briefing.`,
      data: {
        provinces: PROVINCE_INTEL.map((p) => ({ name: p.name, level: p.securityLevel })),
      },
      timestamp: new Date().toISOString(),
      actions: PROVINCE_INTEL.map((p) => ({
        id: `action_sec_${p.name.replace(/\s/g, '_')}`,
        label: `${p.name} security brief`,
        type: 'analyze' as const,
        payload: { province: p.name },
      })),
    };
  }

  // ----- Culture / ethnic group queries -----
  if (msg.includes('culture') || msg.includes('ethnic') || msg.includes('custom') || msg.includes('tradition') || msg.includes('community') || msg.includes('engagement')) {
    if (prov) {
      return {
        id: generateMessageId(),
        agentId: 'local-intel',
        role: 'agent',
        content:
          `## Cultural Intelligence: ${prov.name} Province\n\n` +
          `### Ethnic Groups\n` +
          prov.ethnicGroups.map((e) => `- ${e}`).join('\n') +
          `\n\n### Languages\n` +
          prov.languages.map((l) => `- ${l}`).join('\n') +
          `\n\n### Cultural Considerations\n` +
          `${prov.culturalNotes}\n\n` +
          `### Community Engagement Protocol (DRC Best Practice)\n` +
          `1. **Identify authority structures:** Traditional chiefs (chefs coutumiers), religious leaders, women's groups, youth leaders\n` +
          `2. **Initial approach:** Always go through the chef coutumier first. Bring a small gift (non-monetary).\n` +
          `3. **Language:** Use local language for community meetings. French for formal government interactions.\n` +
          `4. **FPIC process:** Free, Prior and Informed Consent — required by DRC Mining Code for exploitation permits.\n` +
          `5. **Community development agreement:** Negotiate community benefits package (employment, infrastructure, revenue sharing).\n` +
          `6. **Documentation:** Record all community meetings in French. Provide community with written summaries.\n` +
          `7. **Ongoing engagement:** Regular community meetings (monthly minimum). Transparent reporting on commitments.`,
        data: {
          province: prov.name,
          ethnicGroups: prov.ethnicGroups,
          languages: prov.languages,
        },
        timestamp: new Date().toISOString(),
        actions: [
          {
            id: 'action_culture_language',
            label: 'Get translation support',
            type: 'dispatch',
            payload: { agentId: 'language', query: `Prepare community engagement phrases in ${prov.languages[1] || 'Swahili'}` },
          },
        ],
      };
    }

    return {
      id: generateMessageId(),
      agentId: 'local-intel',
      role: 'agent',
      content:
        `## DRC Cultural Intelligence for Mining Operations\n\n` +
        `### Key Cultural Principles\n` +
        `- **Respect for traditional authority:** Chefs coutumiers (traditional chiefs) hold significant influence in rural DRC. Always engage through them first.\n` +
        `- **Language matters:** French is the official language, but community engagement requires local languages. Over 200 languages spoken in DRC.\n` +
        `- **Gift-giving protocol:** Small, non-monetary gifts when visiting communities. Avoid cash gifts to chiefs as this can be seen as corruption.\n` +
        `- **Patience:** Decision-making is collective and takes time. Do not rush consultations.\n` +
        `- **Gender dynamics:** Include women's groups in all consultations. Women often manage household economies.\n` +
        `- **Youth engagement:** Youth unemployment is high. Employment expectations from mining operations are intense.\n\n` +
        `### Regional Cultural Diversity\n` +
        PROVINCE_INTEL.map((p) => `- **${p.name}:** ${p.ethnicGroups.slice(0, 3).join(', ')} — ${p.languages.slice(1, 3).join(', ')}`).join('\n') +
        `\n\nSpecify a province for detailed cultural intelligence.`,
      data: { provinces: PROVINCE_INTEL.map((p) => p.name) },
      timestamp: new Date().toISOString(),
      actions: [],
    };
  }

  // ----- Accommodation queries -----
  if (msg.includes('accommodat') || msg.includes('hotel') || msg.includes('stay') || msg.includes('lodge') || msg.includes('guesthouse') || msg.includes('camp')) {
    if (prov) {
      return {
        id: generateMessageId(),
        agentId: 'local-intel',
        role: 'agent',
        content:
          `## Accommodation Options: ${prov.name} Province\n\n` +
          `### Available Accommodation\n` +
          prov.accommodation.map((a, i) => `${i + 1}. ${a}`).join('\n') +
          `\n\n### DRC Accommodation Tips\n` +
          `- Confirm generator availability — power outages are frequent\n` +
          `- Bring your own bedding/mosquito net for basic accommodations\n` +
          `- Water supply may be intermittent — carry purification tablets\n` +
          `- Negotiate rates in advance — prices vary significantly for foreigners\n` +
          `- For remote mining areas, budget for full camp setup:\n` +
          `  - Camp rental: $15,000-30,000/month\n` +
          `  - Catering: $50-80/person/day\n` +
          `  - Generator + fuel: $5,000-10,000/month\n` +
          `  - Security: $3,000-8,000/month\n\n` +
          `### Booking\n` +
          `Most DRC accommodations outside Kinshasa/Lubumbashi do not have online booking. Contact directly or use a local fixer.`,
        data: {
          province: prov.name,
          options: prov.accommodation,
          campCosts: { rental: '$15-30K/mo', catering: '$50-80/person/day' },
        },
        timestamp: new Date().toISOString(),
        actions: [
          {
            id: 'action_accom_trip',
            label: 'Plan full trip logistics',
            type: 'dispatch',
            payload: { agentId: 'trip', query: `Arrange accommodation in ${prov.name}` },
          },
        ],
      };
    }

    return {
      id: generateMessageId(),
      agentId: 'local-intel',
      role: 'agent',
      content:
        `## DRC Accommodation Guide for Mining Professionals\n\n` +
        `### Accommodation Categories\n` +
        `1. **Major cities (Kinshasa, Lubumbashi, Goma, Bukavu):** International-standard hotels available ($100-300/night)\n` +
        `2. **Provincial capitals:** Basic hotels ($30-80/night), mission guesthouses ($20-40/night)\n` +
        `3. **Mining areas:** Mine camps ($100-200/person/day all-in) or self-setup camps\n` +
        `4. **Remote areas:** Full camp deployment required\n\n` +
        `Specify a province for specific options.`,
      data: {},
      timestamp: new Date().toISOString(),
      actions: [],
    };
  }

  // ----- Company / operator queries -----
  if (msg.includes('compan') || msg.includes('operator') || msg.includes('who is') || msg.includes('mining house') || msg.includes('player')) {
    return {
      id: generateMessageId(),
      agentId: 'local-intel',
      role: 'agent',
      content:
        `## Key Mining Companies in DRC Gold Sector\n\n` +
        `### Tier 1 Operators\n` +
        `- **Barrick Gold Corporation** — Kibali Gold Mine (45% JV). Largest gold mine in Africa. 750 Koz/yr.\n` +
        `- **AngloGold Ashanti** — Kibali Gold Mine (45% JV). Looking for DRC expansion opportunities.\n\n` +
        `### Development-Stage Companies\n` +
        `- **Loncor Gold Inc.** — Adumbi/Imbo project (3.97 Moz, 4.38 g/t). Going-private in 2026.\n` +
        `- **Avanti Gold Corp.** — Misisi/Akyanga project (3.11 Moz, NI 43-101). Active 42,000m drill program.\n` +
        `- **DRC Gold Corp.** — Giro and Nizi projects (option/JV). Near Kibali belt.\n\n` +
        `### Disrupted/Restarting\n` +
        `- **Shomka Resources** — Twangiza (3.7 Moz) and Namoya (2.1 Moz). Former Banro assets. Restart attempts ongoing.\n\n` +
        `### State Entities\n` +
        `- **SOKIMO (Societe Miniere de Kilo-Moto)** — State gold mining company. Historical Kilo-Moto belt operator. Holds 10% of Kibali.\n` +
        `- **SAEMAPE** — Service responsible for ASM oversight and formalization.\n\n` +
        `### ASM-Dominated Areas\n` +
        `- **Kamituga-Mobale** — Multiple cooperatives, ~200,000 miners\n` +
        `- **Mongbwalu** — SOKIMO legacy area, extensive ASM\n\n` +
        `### Gold Trading Houses\n` +
        `- Multiple gold buying comptoirs in Bukavu, Bunia, Butembo\n` +
        `- Cross-border trading through Rwanda, Burundi, Uganda, Kenya`,
      data: {
        tier1: ['Barrick Gold', 'AngloGold Ashanti'],
        development: ['Loncor Gold', 'Avanti Gold', 'DRC Gold Corp'],
        stateEntities: ['SOKIMO', 'SAEMAPE'],
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_company_projects',
          label: 'View all projects',
          type: 'navigate',
          payload: { route: '/projects' },
        },
      ],
    };
  }

  // ----- Artisanal mining queries -----
  if (msg.includes('artisanal') || msg.includes('asm') || msg.includes('creuseur') || msg.includes('small scale') || msg.includes('informal mining')) {
    return {
      id: generateMessageId(),
      agentId: 'local-intel',
      role: 'agent',
      content:
        `## Artisanal Mining Intelligence — DRC Gold Sector\n\n` +
        `### National Overview\n` +
        `- Estimated 500,000-2,000,000 artisanal gold miners nationally\n` +
        `- ASM accounts for an estimated 80-90% of DRC gold production by volume\n` +
        `- Most ASM gold exits informally through Uganda, Rwanda, Burundi, Tanzania\n` +
        `- Armed group involvement in ASM is well-documented in eastern provinces\n\n` +
        `### Major ASM Centres\n` +
        `| Location | Province | Estimated Miners | Scale |\n` +
        `|----------|----------|-----------------|-------|\n` +
        `| Kamituga-Mobale | South Kivu | ~200,000 | Extreme |\n` +
        `| Mongbwalu | Ituri | ~15,000 | Extreme |\n` +
        `| Namoya area | Maniema | ~12,000 | Heavy |\n` +
        `| Misisi | South Kivu | ~10,000 | Heavy |\n` +
        `| Twangiza area | South Kivu | ~8,000 | Heavy |\n` +
        `| Kibali periphery | Haut-Uele | ~5,000 | Moderate |\n` +
        `| Giro area | Haut-Uele | ~3,000 | Moderate |\n\n` +
        `### ASM Formalization Efforts\n` +
        `- **ZEA (Zones d'Exploitation Artisanale):** Designated ASM zones under Mining Code\n` +
        `- **SAEMAPE:** Government agency for ASM oversight\n` +
        `- **iTSCi:** Traceability program (primarily tin/tantalum, expanding to gold)\n` +
        `- **State gold buying:** Government programs to formalize gold purchases from ASM\n` +
        `- **Fair trade gold:** Emerging programs in South Kivu (ARM certification)`,
      data: {
        totalMiners: '500K-2M',
        centres: [
          { name: 'Kamituga', province: 'South Kivu', miners: 200000 },
          { name: 'Mongbwalu', province: 'Ituri', miners: 15000 },
          { name: 'Namoya', province: 'Maniema', miners: 12000 },
        ],
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_asm_survey',
          label: 'Commission ASM survey',
          type: 'dispatch',
          payload: { agentId: 'research', query: 'Dispatch team to survey artisanal mining activity' },
        },
        {
          id: 'action_asm_map',
          label: 'View ASM on map',
          type: 'navigate',
          payload: { route: '/map', layer: 'asm' },
        },
      ],
    };
  }

  // ----- Infrastructure queries -----
  if (msg.includes('infrastructure') || msg.includes('road') || msg.includes('airport') || msg.includes('power') || msg.includes('telecom') || msg.includes('logistics')) {
    if (prov) {
      return {
        id: generateMessageId(),
        agentId: 'local-intel',
        role: 'agent',
        content:
          `## Infrastructure Assessment: ${prov.name} Province\n\n` +
          `### Airports\n` +
          prov.infrastructure.airports.map((a) => `- ${a}`).join('\n') +
          `\n\n### Road Network\n` +
          prov.infrastructure.majorRoads.map((r) => `- ${r}`).join('\n') +
          `\n\n### Power Supply\n` +
          `${prov.infrastructure.power}\n\n` +
          `### Telecommunications\n` +
          `${prov.infrastructure.telecom}\n\n` +
          `### General Infrastructure Notes\n` +
          `- Road conditions deteriorate significantly during rainy season (Oct-Apr)\n` +
          `- Satellite communication (Thuraya/Iridium) recommended for remote areas\n` +
          `- VSAT internet available for permanent camp installations ($2,000-5,000/month)\n` +
          `- Fuel supply chains are fragile — maintain 2-week reserves at remote sites`,
        data: {
          province: prov.name,
          infrastructure: prov.infrastructure,
        },
        timestamp: new Date().toISOString(),
        actions: [
          {
            id: 'action_infra_trip',
            label: 'Plan logistics',
            type: 'dispatch',
            payload: { agentId: 'trip', query: `Plan ground transport in ${prov.name}` },
          },
        ],
      };
    }

    return {
      id: generateMessageId(),
      agentId: 'local-intel',
      role: 'agent',
      content:
        `## DRC Infrastructure Overview for Mining Operations\n\n` +
        `### Transport\n` +
        `- **Airports:** Major international (Kinshasa FIH, Lubumbashi FBM). Regional domestic (Goma, Bukavu, Bunia, Kisangani, Kindu).\n` +
        `- **Roads:** National road network largely degraded. Mine-maintained roads are best quality. 4x4 required for all mining areas.\n` +
        `- **Rail:** SNCC railway network (Katanga) — limited for gold areas. Not relevant for eastern DRC gold belt.\n` +
        `- **River:** Congo River and tributaries for bulk transport. Not practical for most gold mining areas.\n\n` +
        `### Power\n` +
        `- SNEL (national utility) grid unreliable outside major cities\n` +
        `- Diesel generation is standard for mining ($0.30-0.50/kWh)\n` +
        `- Hydroelectric potential significant but undeveloped\n` +
        `- Solar hybrid becoming viable for camp power\n\n` +
        `Specify a province for detailed infrastructure assessment.`,
      data: {},
      timestamp: new Date().toISOString(),
      actions: PROVINCE_INTEL.map((p) => ({
        id: `action_infra_${p.name.replace(/\s/g, '_')}`,
        label: `${p.name} infrastructure`,
        type: 'analyze' as const,
        payload: { province: p.name },
      })),
    };
  }

  // ----- Language queries (redirect) -----
  if (msg.includes('language') || msg.includes('speak') || msg.includes('translat')) {
    if (prov) {
      return {
        id: generateMessageId(),
        agentId: 'local-intel',
        role: 'agent',
        content:
          `## Languages in ${prov.name} Province\n\n` +
          `### Spoken Languages\n` +
          prov.languages.map((l, i) => `${i + 1}. **${l}**${i === 0 ? ' (official)' : ''}`).join('\n') +
          `\n\n**Primary local language for community engagement:** ${prov.languages[1] || prov.languages[0]}\n\n` +
          `For translation assistance and cultural communication templates, I recommend consulting the Language & Communication Agent.`,
        data: { province: prov.name, languages: prov.languages },
        timestamp: new Date().toISOString(),
        actions: [
          {
            id: 'action_lang_translate',
            label: 'Get translation support',
            type: 'dispatch',
            payload: { agentId: 'language', query: `Translate key phrases to ${prov.languages[1] || 'Swahili'}` },
          },
        ],
      };
    }
  }

  // ----- Default: province selection or general intelligence -----
  if (prov) {
    return buildProvinceOverview(prov);
  }

  return {
    id: generateMessageId(),
    agentId: 'local-intel',
    role: 'agent',
    content:
      `## Local Intelligence Agent — Ready\n\n` +
      `I provide regional intelligence for DRC gold mining provinces. I can brief you on:\n\n` +
      `- **Security assessments** — Armed group activity, threat levels, security recommendations\n` +
      `- **Cultural intelligence** — Ethnic groups, languages, community engagement protocols\n` +
      `- **Infrastructure analysis** — Airports, roads, power, telecommunications\n` +
      `- **Accommodation options** — Hotels, guesthouses, camp setup costs\n` +
      `- **Company identification** — Active operators and mining companies by region\n` +
      `- **Artisanal mining** — ASM scale, locations, formalization status\n\n` +
      `### Available Province Briefings\n` +
      PROVINCE_INTEL.map((p) => `- **${p.name}** (${p.capital}) — Security: ${p.securityLevel.toUpperCase()}`).join('\n') +
      `\n\nWhich province or topic would you like intelligence on?`,
    data: {
      availableProvinces: PROVINCE_INTEL.map((p) => ({ name: p.name, capital: p.capital, security: p.securityLevel })),
    },
    timestamp: new Date().toISOString(),
    actions: PROVINCE_INTEL.map((p) => ({
      id: `action_intel_${p.name.replace(/\s/g, '_')}`,
      label: `${p.name} briefing`,
      type: 'dispatch' as const,
      payload: { agentId: 'local-intel', query: `Give me a briefing on ${p.name}` },
    })),
  };
}
