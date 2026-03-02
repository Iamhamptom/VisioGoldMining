import { generateMessageId } from './agent-framework';
import type { AgentMessage } from './agent-framework';

interface TripContext {
  destination?: string;
  teamSize?: number;
}

const REGIONAL_AIRPORTS: Record<string, { name: string; code: string; airlines: string[]; flightTime: string; frequency: string }> = {
  bunia: { name: 'Bunia Airport', code: 'BUX', airlines: ['Congo Airways', 'CAA'], flightTime: '~3hrs from Kinshasa', frequency: '3-4 flights/week' },
  goma: { name: 'Goma International', code: 'GOM', airlines: ['Congo Airways', 'Ethiopian Airlines', 'RwandAir'], flightTime: '~3hrs from Kinshasa', frequency: 'Daily' },
  bukavu: { name: 'Kavumu Airport', code: 'BKY', airlines: ['Congo Airways'], flightTime: '~3.5hrs from Kinshasa', frequency: '2-3 flights/week' },
  lubumbashi: { name: 'Lubumbashi International', code: 'FBM', airlines: ['Congo Airways', 'Ethiopian Airlines', 'Kenya Airways'], flightTime: '~3hrs from Kinshasa', frequency: 'Daily' },
  kisangani: { name: 'Bangoka Airport', code: 'FKI', airlines: ['Congo Airways', 'CAA'], flightTime: '~2.5hrs from Kinshasa', frequency: '3-4 flights/week' },
  kalemie: { name: 'Kalemie Airport', code: 'FMI', airlines: ['Congo Airways'], flightTime: '~4hrs from Kinshasa', frequency: '1-2 flights/week' },
};

const SITE_ITINERARIES: Record<string, { route: string[]; groundTransport: string; totalDays: number; estimatedCost: string; securityLevel: string }> = {
  kibali: {
    route: ['Kinshasa', 'Bunia (flight)', 'Watsa (4x4, 5hrs)', 'Kibali mine site'],
    groundTransport: '4x4 convoy with security escort. Road paved to Watsa, deteriorates last 20km.',
    totalDays: 3,
    estimatedCost: '$15,000-$22,000 for 4-person team, 5 days',
    securityLevel: 'MEDIUM — ADF activity in broader region, mine site secure perimeter',
  },
  twangiza: {
    route: ['Kinshasa', 'Bukavu (flight)', 'Twangiza (4x4, 3hrs)'],
    groundTransport: '4x4 from Bukavu via Mwenga road. Road partially improved by Banro.',
    totalDays: 2,
    estimatedCost: '$12,000-$18,000 for 4-person team, 5 days',
    securityLevel: 'HIGH — Mai-Mai activity near Mwenga axis, security escort mandatory',
  },
  namoya: {
    route: ['Kinshasa', 'Kalemie (flight)', 'Namoya (4x4, 8hrs)'],
    groundTransport: 'Challenging overland from Kalemie. Alternative: charter flight to Namoya airstrip.',
    totalDays: 3,
    estimatedCost: '$20,000-$30,000 for 4-person team, 7 days',
    securityLevel: 'HIGH — Remote location, limited security infrastructure',
  },
  mongbwalu: {
    route: ['Kinshasa', 'Bunia (flight)', 'Mongbwalu (4x4, 4hrs)'],
    groundTransport: '4x4 from Bunia. Road quality variable, especially in rainy season.',
    totalDays: 2,
    estimatedCost: '$14,000-$20,000 for 4-person team, 5 days',
    securityLevel: 'HIGH — FRPI/Lendu militia history, improved recently',
  },
  kamituga: {
    route: ['Kinshasa', 'Bukavu (flight)', 'Kamituga (4x4, 4-5hrs)'],
    groundTransport: '4x4 via Mwenga. Road conditions poor in rainy season. Heavy artisanal traffic.',
    totalDays: 2,
    estimatedCost: '$13,000-$19,000 for 4-person team, 5 days',
    securityLevel: 'MEDIUM-HIGH — Artisanal mining tensions, periodic Mai-Mai incursions',
  },
};

export function getTripPlanningResponse(message: string, context?: TripContext): AgentMessage {
  const lower = message.toLowerCase();

  // ---- Specific site itinerary ----
  for (const [site, itin] of Object.entries(SITE_ITINERARIES)) {
    if (lower.includes(site)) {
      return {
        id: generateMessageId(),
        agentId: 'trip',
        role: 'agent',
        content:
          `## Trip Plan: ${site.charAt(0).toUpperCase() + site.slice(1)} Project Site\n\n` +
          `### Route\n` +
          itin.route.map((r, i) => `${i + 1}. ${r}`).join('\n') +
          `\n\n### Ground Transport\n${itin.groundTransport}\n\n` +
          `### Logistics\n` +
          `- **Travel days (one-way):** ${itin.totalDays} days\n` +
          `- **Estimated cost:** ${itin.estimatedCost}\n` +
          `- **Security level:** ${itin.securityLevel}\n\n` +
          `### Recommended Team\n` +
          `- Project Manager / Geologist\n` +
          `- Community Liaison Officer (French/Swahili speaker)\n` +
          `- Security Advisor\n` +
          `- Driver/Logistics Coordinator\n\n` +
          `### Essential Preparations\n` +
          `- [ ] Yellow fever certificate (mandatory)\n` +
          `- [ ] Malaria prophylaxis (Malarone recommended)\n` +
          `- [ ] DRC visa (VOA available at airports, $100)\n` +
          `- [ ] Satellite phone rental\n` +
          `- [ ] Cash USD (small denominations, post-2006 bills)\n` +
          `- [ ] Mining permits/authorization copies\n` +
          `- [ ] Travel insurance with evacuation coverage\n` +
          `- [ ] MONUSCO registration (if entering eastern DRC)\n\n` +
          `Shall I arrange accommodation or security escorts?`,
        data: { site, itinerary: itin },
        timestamp: new Date().toISOString(),
      };
    }
  }

  // ---- Flight queries ----
  if (lower.includes('flight') || lower.includes('fly') || lower.includes('airport') || lower.includes('airline')) {
    return {
      id: generateMessageId(),
      agentId: 'trip',
      role: 'agent',
      content:
        `## DRC Regional Flights\n\n` +
        `All major mining regions are accessible via domestic flights from **Kinshasa N'Djili Airport (FIH)**.\n\n` +
        Object.entries(REGIONAL_AIRPORTS).map(([, apt]) =>
          `### ${apt.name} (${apt.code})\n` +
          `- **Airlines:** ${apt.airlines.join(', ')}\n` +
          `- **Flight time:** ${apt.flightTime}\n` +
          `- **Frequency:** ${apt.frequency}\n`
        ).join('\n') +
        `\n### Booking Tips\n` +
        `- Book through airline offices in Kinshasa (online booking unreliable)\n` +
        `- Expect schedule changes — always confirm 24hrs before\n` +
        `- Luggage limit: 23kg checked, 8kg cabin\n` +
        `- Arrive 2hrs before domestic flights\n` +
        `- Alternative: charter flights via TMK Aviation or Safari Air\n\n` +
        `Which destination are you planning to fly to?`,
      timestamp: new Date().toISOString(),
    };
  }

  // ---- Accommodation queries ----
  if (lower.includes('hotel') || lower.includes('accommodation') || lower.includes('stay') || lower.includes('lodge')) {
    return {
      id: generateMessageId(),
      agentId: 'trip',
      role: 'agent',
      content:
        `## DRC Mining Region Accommodation\n\n` +
        `### Bunia (for Kibali/Mongbwalu/Ituri projects)\n` +
        `- **Hotel Ituri** — $85-$110/night, reliable power, WiFi, restaurant\n` +
        `- **Samaritan Lodge** — $120-$150/night, international standard, secure compound\n` +
        `- **Residence Bunia** — $60-$80/night, basic but clean\n\n` +
        `### Bukavu (for Twangiza/Kamituga/South Kivu projects)\n` +
        `- **Hotel Orchid** — $100-$140/night, lakefront, conference facilities\n` +
        `- **Hotel Résidence** — $70-$90/night, city center\n` +
        `- **La Roche Hotel** — $80-$120/night, good security\n\n` +
        `### Goma (for North Kivu projects)\n` +
        `- **Ihusi Hotel** — $130-$180/night, Lake Kivu views, pool, restaurant\n` +
        `- **Karibu Hotel** — $90-$120/night, central, reliable\n` +
        `- **Hotel Cap Kivu** — $100-$150/night, lakefront\n\n` +
        `### Lubumbashi (for Haut-Katanga projects)\n` +
        `- **Pullman Grand Karavia** — $180-$250/night, international standard\n` +
        `- **Hotel Memling** — $120-$160/night, business hotel\n\n` +
        `### Camp Setup (remote sites)\n` +
        `- Mobile camp: $500-$1,500/day for 4-person team\n` +
        `- Container camp (semi-permanent): $50,000-$100,000 setup\n\n` +
        `Which region would you like detailed accommodation options for?`,
      timestamp: new Date().toISOString(),
    };
  }

  // ---- Security ----
  if (lower.includes('security') || lower.includes('safe') || lower.includes('danger') || lower.includes('escort')) {
    return {
      id: generateMessageId(),
      agentId: 'trip',
      role: 'agent',
      content:
        `## DRC Travel Security Arrangements\n\n` +
        `### Essential Security Measures\n` +
        `1. **Security escort** — Armed escort mandatory for eastern DRC travel ($200-$500/day)\n` +
        `2. **MONUSCO registration** — Register with UN peacekeeping mission for eastern provinces\n` +
        `3. **Satellite phone** — Mobile coverage limited outside towns ($15/day rental)\n` +
        `4. **Tracking device** — GPS tracking for all vehicles\n` +
        `5. **Curfew compliance** — No road travel after dark in eastern provinces\n\n` +
        `### Security Providers\n` +
        `- **G4S DRC** — International provider, offices in Kinshasa, Lubumbashi, Goma\n` +
        `- **KK Security** — Regional provider, strong in eastern DRC\n` +
        `- **PNI (Police Nationale)** — Police escort arrangements via provincial command\n` +
        `- **FARDC escort** — Military escort for high-risk zones (provincial military command)\n\n` +
        `### No-Go Zones (as of latest intel)\n` +
        `- ADF-controlled areas in Beni territory (North Kivu)\n` +
        `- CODECO zones in Djugu (Ituri)\n` +
        `- Parts of Fizi/Uvira (South Kivu)\n` +
        `- Certain areas of Maniema/Kabambare axis\n\n` +
        `### Emergency Contacts\n` +
        `- MONUSCO: +243 81 890 5000\n` +
        `- Embassy (UK): +243 81 556 3220\n` +
        `- Embassy (US): +243 81 225 5872\n` +
        `- Medical evacuation: AAR/AMREF ($50,000 membership/year)\n\n` +
        `Need a security assessment for a specific route?`,
      timestamp: new Date().toISOString(),
    };
  }

  // ---- Equipment / logistics ----
  if (lower.includes('equipment') || lower.includes('freight') || lower.includes('import') || lower.includes('customs')) {
    return {
      id: generateMessageId(),
      agentId: 'trip',
      role: 'agent',
      content:
        `## Equipment & Logistics — DRC\n\n` +
        `### Import Requirements\n` +
        `- DGDA (customs) clearance for all mining equipment\n` +
        `- Mining convention may provide reduced import duties (2-5%)\n` +
        `- Import permit from Ministry of Mines for restricted items\n` +
        `- Pre-shipment inspection (BIVAC/Bureau Veritas)\n\n` +
        `### Shipping Routes\n` +
        `- **Sea freight:** Dar es Salaam (Tanzania) → overland to eastern DRC\n` +
        `- **Sea freight:** Matadi (DRC) → road/rail to sites\n` +
        `- **Air freight:** Direct to regional airports (max 5 tonnes per charter)\n\n` +
        `### Vehicle Procurement\n` +
        `- Toyota Land Cruiser 70-series recommended ($60,000-$80,000 new)\n` +
        `- Purchase in Kampala (Uganda) or Dar es Salaam and drive in\n` +
        `- DRC registration required within 30 days\n\n` +
        `### Fuel & Supplies\n` +
        `- Fuel available in major towns ($1.50-$2.00/liter diesel)\n` +
        `- Carry fuel for remote sites (200L minimum reserve)\n` +
        `- Generator fuel consumption budget: 40-60L/day for camp\n\n` +
        `Need help planning equipment logistics for a specific project?`,
      timestamp: new Date().toISOString(),
    };
  }

  // ---- Default ----
  return {
    id: generateMessageId(),
    agentId: 'trip',
    role: 'agent',
    content:
      `## Trip Planning Agent — Ready\n\n` +
      `I can plan complete travel logistics to any DRC mining project site. I handle:\n\n` +
      `- **Flight routing** — Domestic airlines, charter options, schedules\n` +
      `- **Ground transport** — 4x4 convoys, road conditions, driver arrangements\n` +
      `- **Accommodation** — Hotels, guesthouses, camp setup in mining regions\n` +
      `- **Security** — Escort arrangements, MONUSCO registration, emergency contacts\n` +
      `- **Team logistics** — Visas, health requirements, equipment, insurance\n` +
      `- **Equipment freight** — Import procedures, shipping routes, customs clearance\n\n` +
      `### Quick Itineraries Available\n` +
      Object.keys(SITE_ITINERARIES).map(s => `- **${s.charAt(0).toUpperCase() + s.slice(1)}** project site`).join('\n') +
      `\n\nWhere would you like to travel?`,
    timestamp: new Date().toISOString(),
    actions: Object.keys(SITE_ITINERARIES).map(s => ({
      id: `act_trip_${s}`,
      label: `Plan: ${s.charAt(0).toUpperCase() + s.slice(1)}`,
      type: 'generate' as const,
      payload: { query: `Plan a trip to ${s}` },
    })),
  };
}
