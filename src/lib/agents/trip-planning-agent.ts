// ============================================================================
// Trip Planning Agent — Travel logistics and meeting coordination
// DRC Gold Mining Intelligence Platform
// ============================================================================

import { AgentMessage, generateMessageId } from './agent-framework';
import { getHotelsByCity, getHotelsByProvince } from '../../data/drc-hotels';

// ---------------------------------------------------------------------------
// DRC travel reference data
// ---------------------------------------------------------------------------

interface DRCDestination {
  city: string;
  province: string;
  iata: string | null;
  hasInternational: boolean;
  airlines: string[];
  hotelOptions: string[];
  securityLevel: 'low' | 'medium' | 'high' | 'critical';
  groundTransport: string;
  medicalFacilities: string;
  visaNotes: string;
}

const DRC_DESTINATIONS: DRCDestination[] = [
  {
    city: 'Kinshasa',
    province: 'Kinshasa',
    iata: 'FIH',
    hasInternational: true,
    airlines: ['Ethiopian Airlines', 'Kenya Airways', 'RwandAir', 'Brussels Airlines', 'Turkish Airlines', 'Air France', 'Congo Airways'],
    hotelOptions: [
      'Pullman Kinshasa Grand Hotel ($200-350/night)',
      'Fleuve Congo Hotel ($180-300/night)',
      'Hotel Memling ($150-250/night)',
      'Beatrice Hotel ($100-180/night)',
    ],
    securityLevel: 'medium',
    groundTransport: 'Taxis, private car hire with driver ($80-150/day). Avoid public minibuses. Traffic congestion is severe. Pre-arrange airport pickup.',
    medicalFacilities: 'Centre Medical de Kinshasa, Clinique Ngaliema, various private clinics. Medevac to South Africa or Kenya if needed.',
    visaNotes: 'DRC visa required for most nationalities. E-visa available at https://evisa.gouv.cd/. Also possible on arrival at FIH ($100-200 depending on nationality). Bring passport photos and invitation letter.',
  },
  {
    city: 'Lubumbashi',
    province: 'Haut-Katanga',
    iata: 'FBM',
    hasInternational: true,
    airlines: ['Ethiopian Airlines', 'Kenya Airways', 'South African Airways (code-share)', 'Congo Airways', 'Fly CAA'],
    hotelOptions: [
      'Pullman Lubumbashi Grand Karavia ($180-300/night)',
      'Hotel Kempinski (opening soon)',
      'Hotel Memoire ($80-150/night)',
    ],
    securityLevel: 'low',
    groundTransport: 'Taxis, private car hire ($60-120/day). Road from Lubumbashi to Likasi and Kolwezi is paved. Southern DRC has better road infrastructure.',
    medicalFacilities: 'Clinique Don Bosco, GCM Hospital, private clinics. Better medical infrastructure than eastern DRC.',
    visaNotes: 'Same visa requirements as Kinshasa. FBM airport processes visas on arrival.',
  },
  {
    city: 'Goma',
    province: 'North Kivu',
    iata: 'GOM',
    hasInternational: true,
    airlines: ['RwandAir (from Kigali)', 'Congo Airways', 'Fly CAA', 'Various charter operators'],
    hotelOptions: [
      'Ihusi Hotel ($100-180/night)',
      'Serena Hotel ($120-200/night)',
      'Hotel Karibu ($80-150/night)',
      'Lake Kivu Lodge ($80-120/night)',
    ],
    securityLevel: 'critical',
    groundTransport: 'Private car with driver essential. Armed escort required outside city. Road to Bukavu paved but checkpoints frequent. Border crossing to Gisenyi (Rwanda) available.',
    medicalFacilities: 'HEAL Africa Hospital, Docs Hospital. MONUSCO medical facilities (restricted). Medevac to Kigali (30 min flight) or Nairobi.',
    visaNotes: 'Can enter via Kigali (Rwanda) and cross at Grande Barriere border post. DRC visa required. Rwanda transit visa may be needed.',
  },
  {
    city: 'Bukavu',
    province: 'South Kivu',
    iata: 'BKY',
    hasInternational: false,
    airlines: ['Congo Airways', 'Fly CAA', 'Charter flights'],
    hotelOptions: [
      'Orchids Safari Club ($100-180/night)',
      'Hotel Residence ($80-150/night)',
      'La Roche Hotel ($60-120/night)',
      'Coco Lodge ($50-100/night)',
    ],
    securityLevel: 'high',
    groundTransport: 'Private car with driver essential. Road to Goma poor and insecure. Lake Kivu speedboat to Goma available (1.5 hours). Road to Twangiza mine ~3 hours (mine-maintained).',
    medicalFacilities: 'Panzi Hospital (Dr. Mukwege), General Hospital, MSF presence. Limited surgical capacity. Medevac to Kigali or Nairobi.',
    visaNotes: 'Can enter via Cyangugu (Rwanda) border crossing. DRC visa required.',
  },
  {
    city: 'Bunia',
    province: 'Ituri',
    iata: 'BUX',
    hasInternational: false,
    airlines: ['Congo Airways (from Kinshasa via Kisangani)', 'UNHAS (humanitarian flights)', 'Charter flights'],
    hotelOptions: [
      'Hotel Ituri ($50-100/night)',
      'Cit Hotel ($40-80/night)',
      'MONUSCO-adjacent guesthouses',
      'NGO/mission guesthouses ($30-60/night)',
    ],
    securityLevel: 'high',
    groundTransport: 'Private car with driver and armed escort required. Road from Bunia to Mambasa (Adumbi) rough laterite, 4-6 hours. Road to Mongbwalu 3-4 hours, poor condition.',
    medicalFacilities: 'General Hospital Bunia, MONUSCO medical. Very limited surgical capacity. Medevac to Entebbe (Uganda) is fastest option.',
    visaNotes: 'Can enter via Entebbe (Uganda) and cross at Mahagi or fly direct to Bunia. DRC visa required.',
  },
  {
    city: 'Isiro',
    province: 'Haut-Uele',
    iata: null,
    hasInternational: false,
    airlines: ['Charter flights only', 'UNHAS (when available)'],
    hotelOptions: [
      'Basic hotels in Isiro ($20-50/night)',
      'Church/mission guesthouses ($15-30/night)',
      'Camp setup for mining areas',
    ],
    securityLevel: 'medium',
    groundTransport: 'Private car with driver required. Road from Isiro to Durba/Watsa (Kibali area) 4-6 hours. Mine-maintained roads near Kibali are good quality. Doko airstrip serves Kibali.',
    medicalFacilities: 'Very limited. Kibali mine has medical facilities (restricted). Medevac planning essential.',
    visaNotes: 'Fly via Kinshasa or Kisangani, then charter to Isiro/Doko.',
  },
];

// ---------------------------------------------------------------------------
// Itinerary templates
// ---------------------------------------------------------------------------

interface ItineraryTemplate {
  name: string;
  destination: string;
  duration: string;
  purpose: string;
  dayByDay: string[];
  estimatedCost: string;
  securityNotes: string;
  packingList: string[];
}

const ITINERARY_TEMPLATES: ItineraryTemplate[] = [
  {
    name: 'Kinshasa Regulatory Trip',
    destination: 'Kinshasa',
    duration: '4-5 days',
    purpose: 'Government meetings, CAMI engagement, regulatory liaison',
    dayByDay: [
      'Day 1: Arrive FIH. Airport pickup. Hotel check-in. Evening preparation for meetings.',
      'Day 2: CAMI head office meeting (morning). Ministry of Mines (afternoon). Prepare follow-up documents.',
      'Day 3: DGRAD/DGI tax office meetings. Mining lawyer consultation. Provincial mining division (if applicable).',
      'Day 4: Follow-up meetings. ANAPI if needed. Document submission. Reserve for rescheduled meetings.',
      'Day 5: Buffer day / departure. Morning meetings if needed. Depart FIH.',
    ],
    estimatedCost: '$3,000 - $6,000 (excl. flights)',
    securityNotes: 'Kinshasa is generally safe in business districts. Avoid displaying wealth. Use hotel-arranged transport. Keep copies of all documents.',
    packingList: ['Business attire', 'Passport + copies', 'Invitation letters', 'Business cards (bilingual French/English)', 'Documents in French', 'Laptop + charger', 'USD cash ($2,000-5,000 for expenses)'],
  },
  {
    name: 'South Kivu Site Visit',
    destination: 'Bukavu / Twangiza / Misisi',
    duration: '7-10 days',
    purpose: 'Project site visit, community engagement, geological assessment',
    dayByDay: [
      'Day 1: Fly to Kigali (Rwanda). Transfer to Bukavu via Cyangugu border crossing. Hotel check-in.',
      'Day 2: Provincial mining division meeting (Bukavu). Logistics preparation. Security briefing.',
      'Day 3: Drive to Twangiza site (3 hours). Site inspection. Camp overnight.',
      'Day 4: Twangiza geological assessment. Community meetings. Return to Bukavu.',
      'Day 5: Drive to Misisi/Fizi area (if planned) or rest day in Bukavu. Preparation.',
      'Day 6: Field work day 2. Community engagement. Data collection.',
      'Day 7: Return to Bukavu. Debrief. Report preparation.',
      'Day 8: Buffer day. Follow-up meetings in Bukavu. Gold trading market visit (optional).',
      'Day 9: Transfer to Kigali. Depart.',
    ],
    estimatedCost: '$8,000 - $15,000 (excl. international flights)',
    securityNotes: 'Armed escort required outside Bukavu. Travel only during daylight (0600-1600). Satellite phone mandatory. Register with embassy. Pre-arrange evacuation plan.',
    packingList: ['Field clothing', 'Sturdy boots', 'Rain gear', 'First aid kit', 'Malaria prophylaxis', 'Water purification', 'Satellite phone', 'GPS device', 'Camera', 'Sleeping bag', 'Mosquito net', 'USD cash ($3,000-5,000)', 'Passport + copies', 'Security briefing documents'],
  },
  {
    name: 'NE DRC Exploration Trip',
    destination: 'Bunia / Mambasa / Kibali area',
    duration: '8-12 days',
    purpose: 'Exploration site visit, Adumbi/Kibali area assessment',
    dayByDay: [
      'Day 1: Fly to Entebbe (Uganda). Overnight in Entebbe/Kampala.',
      'Day 2: Charter flight or drive to Bunia (via Mahagi border). Check-in.',
      'Day 3: Provincial mining division meetings in Bunia. Security briefing. Logistics prep.',
      'Day 4: Drive to Mambasa (Adumbi area). 4-6 hours on laterite roads. Camp setup.',
      'Day 5-6: Field work at Adumbi/Imbo site. Geological assessment. Community engagement.',
      'Day 7: Drive to Watsa/Durba area (Kibali region). 6-8 hours.',
      'Day 8-9: Kibali area assessment. Giro project area if accessible. Community meetings.',
      'Day 10: Return to Bunia. Debrief.',
      'Day 11: Buffer day. Follow-up meetings. Report preparation.',
      'Day 12: Charter flight to Entebbe. Depart.',
    ],
    estimatedCost: '$12,000 - $25,000 (excl. international flights)',
    securityNotes: 'ADF and CODECO active in Ituri. Armed escort mandatory. MONUSCO registration recommended. Travel in convoy (minimum 2 vehicles). Emergency evacuation plan to Entebbe.',
    packingList: ['Full field kit', 'Camping gear', 'Water supply (5L/person/day minimum)', 'Satellite phone', 'GPS + spare batteries', 'Medical kit (including snake bite kit)', 'Malaria prophylaxis', 'Insect repellent', 'Sunscreen', 'Head torch', 'Tool kit for vehicles', 'Spare fuel jerry cans', 'USD cash ($5,000-8,000)', 'DRC visa', 'Uganda visa'],
  },
];

// ---------------------------------------------------------------------------
// Response generation
// ---------------------------------------------------------------------------

function findDestination(msg: string): DRCDestination | null {
  const lower = msg.toLowerCase();
  for (const dest of DRC_DESTINATIONS) {
    if (lower.includes(dest.city.toLowerCase())) return dest;
    if (dest.iata && lower.includes(dest.iata.toLowerCase())) return dest;
    if (lower.includes(dest.province.toLowerCase())) return dest;
  }
  // Match by project area
  const areaMap: Record<string, string> = {
    kibali: 'Isiro',
    twangiza: 'Bukavu',
    namoya: 'Bukavu',
    misisi: 'Bukavu',
    akyanga: 'Bukavu',
    adumbi: 'Bunia',
    imbo: 'Bunia',
    loncor: 'Bunia',
    giro: 'Isiro',
    kamituga: 'Bukavu',
    mongbwalu: 'Bunia',
  };
  for (const [area, city] of Object.entries(areaMap)) {
    if (lower.includes(area)) {
      return DRC_DESTINATIONS.find((d) => d.city === city) ?? null;
    }
  }
  return null;
}

function findItinerary(msg: string): ItineraryTemplate | null {
  const lower = msg.toLowerCase();
  if (lower.includes('kinshasa') || lower.includes('regulatory') || lower.includes('government') || lower.includes('cami meeting')) {
    return ITINERARY_TEMPLATES[0];
  }
  if (lower.includes('south kivu') || lower.includes('bukavu') || lower.includes('twangiza') || lower.includes('misisi')) {
    return ITINERARY_TEMPLATES[1];
  }
  if (lower.includes('bunia') || lower.includes('ituri') || lower.includes('adumbi') || lower.includes('kibali') || lower.includes('northeast') || lower.includes('north east') || lower.includes('haut-uele')) {
    return ITINERARY_TEMPLATES[2];
  }
  return null;
}

export function getTripPlanningResponse(
  message: string,
  context?: { destination?: string; teamSize?: number },
): AgentMessage {
  const msg = message.toLowerCase();
  const teamSize = context?.teamSize ?? 3;

  const dest = findDestination(msg) ?? (context?.destination ? findDestination(context.destination) : null);

  // ----- Full itinerary request -----
  if (msg.includes('itinerary') || msg.includes('plan') || msg.includes('trip') || msg.includes('visit') || msg.includes('schedule')) {
    const itin = findItinerary(msg);
    if (itin) {
      return {
        id: generateMessageId(),
        agentId: 'trip',
        role: 'agent',
        content:
          `## Trip Itinerary: ${itin.name}\n\n` +
          `**Destination:** ${itin.destination}\n` +
          `**Duration:** ${itin.duration}\n` +
          `**Purpose:** ${itin.purpose}\n` +
          `**Estimated cost:** ${itin.estimatedCost} (for team of ${teamSize})\n\n` +
          `### Day-by-Day Plan\n` +
          itin.dayByDay.map((d) => `- ${d}`).join('\n') +
          `\n\n### Security Notes\n` +
          `${itin.securityNotes}\n\n` +
          `### Packing List\n` +
          itin.packingList.map((item) => `- ${item}`).join('\n') +
          `\n\n### Pre-Trip Checklist\n` +
          `- [ ] DRC visa obtained\n` +
          `- [ ] Flights booked\n` +
          `- [ ] Hotel/accommodation confirmed\n` +
          `- [ ] Ground transport arranged\n` +
          `- [ ] Security escort confirmed\n` +
          `- [ ] Satellite phone rented\n` +
          `- [ ] Medical kit prepared\n` +
          `- [ ] Travel insurance (including medevac) confirmed\n` +
          `- [ ] Embassy registration completed\n` +
          `- [ ] Emergency contacts shared with home office\n` +
          `- [ ] Cash USD withdrawn\n` +
          `- [ ] Meeting appointments confirmed`,
        data: {
          itinerary: itin.name,
          destination: itin.destination,
          duration: itin.duration,
          estimatedCost: itin.estimatedCost,
          teamSize,
          days: itin.dayByDay,
          packingList: itin.packingList,
        },
        timestamp: new Date().toISOString(),
        actions: [
          {
            id: 'action_trip_security',
            label: 'Get security briefing',
            type: 'dispatch',
            payload: { agentId: 'local-intel', query: `Security briefing for ${itin.destination}` },
          },
          {
            id: 'action_trip_language',
            label: 'Get language briefing',
            type: 'dispatch',
            payload: { agentId: 'language', query: `Key phrases for travel to ${itin.destination}` },
          },
          {
            id: 'action_trip_research',
            label: 'Dispatch advance team',
            type: 'dispatch',
            payload: { agentId: 'research', query: `Dispatch advance team to prepare for visit to ${itin.destination}` },
          },
        ],
      };
    }

    // Generic trip planning with destination
    if (dest) {
      return buildDestinationBrief(dest, teamSize);
    }
  }

  // ----- Flight / air travel queries -----
  if (msg.includes('flight') || msg.includes('fly') || msg.includes('airline') || msg.includes('airport')) {
    if (dest) {
      return {
        id: generateMessageId(),
        agentId: 'trip',
        role: 'agent',
        content:
          `## Flight Options to ${dest.city}\n\n` +
          `**Airport:** ${dest.city} ${dest.iata ? `(${dest.iata})` : '(no IATA code — charter only)'}\n` +
          `**International:** ${dest.hasInternational ? 'Yes' : 'No — connect via Kinshasa, Kigali, or Entebbe'}\n\n` +
          `### Airlines Serving ${dest.city}\n` +
          dest.airlines.map((a) => `- ${a}`).join('\n') +
          `\n\n### Routing Options\n` +
          (dest.hasInternational
            ? `- Direct international flights available to ${dest.iata}\n`
            : '') +
          `- Via Kinshasa (FIH): Connect on Congo Airways or Fly CAA\n` +
          `- Via Kigali (KGL): RwandAir, then charter or ground\n` +
          `- Via Entebbe (EBB): Then charter to ${dest.city}\n` +
          `- Via Addis Ababa (ADD): Ethiopian Airlines hub, connect to Kinshasa/Lubumbashi\n\n` +
          `### Flight Cost Estimates\n` +
          `- International to Kinshasa: $800-2,500 return (economy/business)\n` +
          `- Kinshasa domestic to ${dest.city}: $300-600 one-way\n` +
          `- Charter flight to ${dest.city}: $2,000-8,000 depending on route and aircraft\n\n` +
          `### Booking Tips\n` +
          `- Book domestic flights well in advance — limited capacity\n` +
          `- Confirm domestic flights 48 hours before departure (cancellations common)\n` +
          `- Carry booking confirmation printout — airport systems sometimes offline\n` +
          `- Baggage allowance on domestic flights: 20-30kg (strict enforcement)\n` +
          `- Consider charter for team travel to remote destinations — often cost-effective for groups`,
        data: {
          destination: dest.city,
          iata: dest.iata,
          airlines: dest.airlines,
          hasInternational: dest.hasInternational,
        },
        timestamp: new Date().toISOString(),
        actions: [
          {
            id: 'action_flight_full',
            label: 'Full trip itinerary',
            type: 'dispatch',
            payload: { agentId: 'trip', query: `Plan a complete trip to ${dest.city}` },
          },
        ],
      };
    }

    // General flight info
    return {
      id: generateMessageId(),
      agentId: 'trip',
      role: 'agent',
      content:
        `## DRC Flight Network\n\n` +
        `### International Gateways\n` +
        `- **Kinshasa (FIH):** Main international hub. Ethiopian, Kenya Airways, Brussels Airlines, Turkish, Air France.\n` +
        `- **Lubumbashi (FBM):** Southern hub. Ethiopian, Kenya Airways, South African.\n` +
        `- **Goma (GOM):** Eastern hub. RwandAir (from Kigali), Congo Airways.\n\n` +
        `### Domestic Airlines\n` +
        `- **Congo Airways:** National carrier. Kinshasa hub. Serves major cities.\n` +
        `- **Fly CAA:** Private carrier. Growing domestic network.\n` +
        `- **UNHAS:** UN humanitarian flights (restricted to registered organizations).\n\n` +
        `### Charter Operators\n` +
        `- Various operators based in Kinshasa, Lubumbashi, Goma\n` +
        `- Cessna Caravan, King Air, and helicopter available\n` +
        `- Essential for remote mining sites without scheduled service\n\n` +
        `### Key Routing for Gold Mining Areas\n` +
        `| Destination | Best Route | Duration |\n` +
        `|------------|-----------|----------|\n` +
        `| Kibali (Haut-Uele) | FIH > Kisangani > Charter to Doko | 8-12 hours |\n` +
        `| Adumbi (Ituri) | EBB > Charter to Bunia > Drive | 6-8 hours |\n` +
        `| Twangiza (South Kivu) | KGL > Bukavu (ground) > Drive | 4-6 hours |\n` +
        `| Misisi (South Kivu) | KGL > Bukavu > Drive to Fizi | 8-12 hours |\n` +
        `| Namoya (Maniema) | FIH > Kindu > Charter | 8-14 hours |\n\n` +
        `Specify your destination for detailed flight options.`,
      data: {
        gateways: ['FIH', 'FBM', 'GOM'],
        airlines: ['Congo Airways', 'Fly CAA', 'Ethiopian', 'Kenya Airways', 'RwandAir'],
      },
      timestamp: new Date().toISOString(),
      actions: DRC_DESTINATIONS.filter((d) => d.iata).map((d) => ({
        id: `action_flight_${d.city.replace(/\s/g, '_')}`,
        label: `Flights to ${d.city}`,
        type: 'dispatch' as const,
        payload: { agentId: 'trip', query: `What flights go to ${d.city}?` },
      })),
    };
  }

  // ----- Ground transport queries -----
  if (msg.includes('transport') || msg.includes('drive') || msg.includes('vehicle') || msg.includes('road') || msg.includes('car') || msg.includes('driver')) {
    return {
      id: generateMessageId(),
      agentId: 'trip',
      role: 'agent',
      content:
        `## DRC Ground Transport Guide\n\n` +
        `### Vehicle Requirements\n` +
        `- **4x4 mandatory** for all mining area travel\n` +
        `- Toyota Land Cruiser 70-series or Hilux are the standard\n` +
        `- Minimum 2-vehicle convoy for remote areas\n` +
        `- Carry 2 spare tires, jack, basic tools, tow rope\n\n` +
        `### Vehicle Hire Costs\n` +
        `- 4x4 with driver (Kinshasa): $100-180/day\n` +
        `- 4x4 with driver (provincial): $80-150/day\n` +
        `- Fuel: $1.50-3.00/liter (higher in remote areas)\n` +
        `- Driver daily allowance: $30-50/day\n\n` +
        `### Road Conditions by Region\n` +
        `- **Mine-maintained roads:** Good quality. Kibali, Twangiza areas.\n` +
        `- **National routes (RN):** Variable. Paved sections near major cities, degraded elsewhere.\n` +
        `- **Provincial roads:** Mostly unpaved laterite. Impassable in rainy season (Oct-Apr).\n` +
        `- **Mining area tracks:** 4x4 only. Often require bush clearance.\n\n` +
        `### Checkpoint Protocol\n` +
        `- Carry all vehicle documentation and permits\n` +
        `- Passport/visa copies for all passengers\n` +
        `- Company authorization letter (in French)\n` +
        `- Be polite and patient — checkpoints are routine\n` +
        `- Small denomination USD/CDF for unofficial tolls (budget $5-20/checkpoint)\n` +
        `- DO NOT carry weapons documentation or sensitive materials openly\n\n` +
        `### Travel Time Estimates (Dry Season)\n` +
        `| Route | Distance | Time | Condition |\n` +
        `|-------|----------|------|----------|\n` +
        `| Bukavu > Twangiza | 85 km | 3 hours | Mine road, good |\n` +
        `| Bukavu > Kamituga | 190 km | 6-8 hours | Poor, unpaved |\n` +
        `| Bunia > Mambasa | 120 km | 4-6 hours | Laterite, rough |\n` +
        `| Bunia > Mongbwalu | 75 km | 3-4 hours | Poor, seasonal |\n` +
        `| Isiro > Durba/Watsa | 150 km | 4-6 hours | Variable |\n\n` +
        `**Rainy season (Oct-Apr):** Add 50-100% to all travel times. Some routes become impassable.`,
      data: {
        vehicleType: 'Toyota Land Cruiser / Hilux 4x4',
        hireCost: '$80-180/day',
        fuelCost: '$1.50-3.00/liter',
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_ground_security',
          label: 'Security arrangements for travel',
          type: 'dispatch',
          payload: { agentId: 'local-intel', query: 'Security assessment for ground travel' },
        },
      ],
    };
  }

  // ----- Meeting / schedule queries -----
  if (msg.includes('meeting') || msg.includes('schedule') || msg.includes('appointment') || msg.includes('arrange')) {
    return {
      id: generateMessageId(),
      agentId: 'trip',
      role: 'agent',
      content:
        `## Meeting Coordination — DRC\n\n` +
        `### Meeting Preparation\n` +
        `- **Confirm 48 hours before:** Meetings are frequently rescheduled in DRC\n` +
        `- **Arrive 15 minutes early:** But expect to wait — punctuality norms differ\n` +
        `- **Bring documents:** All documentation in French, printed copies\n` +
        `- **Business cards:** Bilingual (French/English) essential\n` +
        `- **Gifts:** Small company-branded items appropriate for government meetings\n\n` +
        `### Government Meeting Protocol\n` +
        `- Request meetings through formal letter (in French) sent 2-4 weeks in advance\n` +
        `- Include company profile and purpose of meeting\n` +
        `- Dress code: Business formal\n` +
        `- Begin with pleasantries before business discussion\n` +
        `- Take notes and confirm action items in writing afterward\n\n` +
        `### Community Meeting Protocol\n` +
        `- Always go through the chef coutumier (traditional chief) first\n` +
        `- Local language translator essential\n` +
        `- Public meeting format preferred (transparency)\n` +
        `- Allow ample time for questions and discussion\n` +
        `- Provide refreshments (water, soft drinks)\n` +
        `- Document attendance and key points\n\n` +
        `### Key Meeting Types for Mining Projects\n` +
        `1. **CAMI (Kinshasa):** Permit applications, renewals, queries\n` +
        `2. **Ministry of Mines:** Policy discussions, mine inspection arrangements\n` +
        `3. **Provincial Governor's Office:** Provincial authorization, security support\n` +
        `4. **Provincial Mining Division:** Local oversight, ASM coordination\n` +
        `5. **Community leaders:** FPIC, community development agreements\n` +
        `6. **Military/police command:** Security arrangements, escort requests\n` +
        `7. **MONUSCO (if applicable):** Security briefing, humanitarian coordination`,
      data: {
        meetingTypes: ['CAMI', 'Ministry', 'Governor', 'Mining Division', 'Community', 'Military', 'MONUSCO'],
        protocolNotes: ['confirm_48h', 'french_documents', 'business_cards', 'formal_dress'],
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_meeting_language',
          label: 'Prepare French meeting documents',
          type: 'dispatch',
          payload: { agentId: 'language', query: 'Prepare formal French meeting request letters' },
        },
        {
          id: 'action_meeting_paperwork',
          label: 'Check permit status before meeting',
          type: 'dispatch',
          payload: { agentId: 'paperwork', query: 'What documents do I need for CAMI meetings?' },
        },
      ],
    };
  }

  // ----- Security arrangement queries -----
  if (msg.includes('security') || msg.includes('escort') || msg.includes('safe') || msg.includes('evacuation')) {
    return {
      id: generateMessageId(),
      agentId: 'trip',
      role: 'agent',
      content:
        `## Travel Security Arrangements — DRC\n\n` +
        `### Security Planning Checklist\n` +
        `- [ ] Pre-trip security briefing from local intelligence\n` +
        `- [ ] Armed escort arranged (for high-risk areas)\n` +
        `- [ ] Vehicle GPS tracking activated\n` +
        `- [ ] Satellite phone rented and tested\n` +
        `- [ ] Emergency evacuation plan documented\n` +
        `- [ ] Medical evacuation insurance confirmed\n` +
        `- [ ] Embassy registration completed\n` +
        `- [ ] Daily check-in protocol established with home office\n` +
        `- [ ] Safe room / fall-back location identified\n` +
        `- [ ] Cash stored in multiple locations (not all in one bag)\n\n` +
        `### Security Provider Options\n` +
        `- **G4S Congo:** Established provider, can arrange escorts\n` +
        `- **Mine security:** Kibali, Twangiza have own security teams (may assist visitors)\n` +
        `- **FARDC military escort:** Available via provincial military command (costs vary)\n` +
        `- **PNP police escort:** Available in some areas\n` +
        `- **Private security firms:** Multiple local operators\n\n` +
        `### Emergency Evacuation Options\n` +
        `- **Air evacuation:** Charter to Kigali (from East DRC), Entebbe (from NE DRC), or Lubumbashi\n` +
        `- **AMREF Flying Doctors:** Medevac service from East Africa\n` +
        `- **SOS International:** Global evacuation coordination\n` +
        `- **Overland evacuation:** Pre-identified routes to borders (Rwanda, Uganda, Zambia)\n\n` +
        `### Security Cost Estimates\n` +
        `- Armed escort (per day): $200-500\n` +
        `- Security risk assessment: $3,000-8,000\n` +
        `- Satellite phone rental: $50-100/week\n` +
        `- Travel insurance with medevac: $200-500/person/trip\n` +
        `- GPS tracker rental: $50-100/trip`,
      data: {
        providers: ['G4S Congo', 'Mine security', 'FARDC', 'PNP', 'Private firms'],
        evacuationOptions: ['Air charter', 'AMREF', 'SOS International', 'Overland'],
        costEstimates: { escort: '$200-500/day', satPhone: '$50-100/week', insurance: '$200-500/person' },
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_sec_intel',
          label: 'Get latest security intel',
          type: 'dispatch',
          payload: { agentId: 'local-intel', query: 'Current security situation assessment' },
        },
        {
          id: 'action_sec_research',
          label: 'Commission security assessment',
          type: 'dispatch',
          payload: { agentId: 'research', query: 'Dispatch security assessment team' },
        },
      ],
    };
  }

  // ----- Visa / entry queries -----
  if (msg.includes('visa') || msg.includes('entry') || msg.includes('passport') || msg.includes('immigration') || msg.includes('vaccin') || msg.includes('health') || msg.includes('yellow fever') || msg.includes('preparation')) {
    return {
      id: generateMessageId(),
      agentId: 'trip',
      role: 'agent',
      content:
        `## DRC Visa & Entry Requirements\n\n` +
        `### Visa Types\n` +
        `- **E-Visa:** Available at https://evisa.gouv.cd/ for most nationalities\n` +
        `- **Visa on Arrival:** Available at FIH and some border posts ($100-200)\n` +
        `- **Embassy visa:** Apply in advance at DRC embassy in your country\n\n` +
        `### Required Documents\n` +
        `- Passport valid for 6+ months beyond travel date\n` +
        `- Completed visa application form\n` +
        `- Passport-size photos (2)\n` +
        `- Invitation letter from DRC-based company or organization\n` +
        `- Yellow fever vaccination certificate (MANDATORY)\n` +
        `- Return/onward flight booking\n` +
        `- Hotel reservation\n` +
        `- Payment of visa fee ($100-300 depending on nationality and type)\n\n` +
        `### Health Requirements\n` +
        `- **Yellow fever:** Vaccination MANDATORY. Carry certificate.\n` +
        `- **Malaria:** Prophylaxis essential (Malarone, doxycycline, or mefloquine)\n` +
        `- **COVID-19:** Check current requirements (may change)\n` +
        `- **Recommended vaccines:** Hepatitis A/B, typhoid, tetanus, polio\n` +
        `- **Water:** Drink only bottled or purified water\n` +
        `- **Medical insurance:** Ensure covers medevac to Kenya or South Africa\n\n` +
        `### Communications\n` +
        `- Thuraya satellite phone (rent: $100/week)\n` +
        `- Local SIM cards: Airtel or Vodacom\n` +
        `- VPN service for internet access\n\n` +
        `### Money\n` +
        `- Cash USD (small denominations: $1, $5, $10, $20)\n` +
        `- Bills must be post-2006, no tears or marks\n` +
        `- No ATMs outside major cities\n` +
        `- Budget: $100-$200/person/day for field operations\n\n` +
        `### Entry Points for Mining Professionals\n` +
        `- **Kinshasa (FIH):** Main international entry\n` +
        `- **Lubumbashi (FBM):** Southern entry (flights from Johannesburg, Addis)\n` +
        `- **Goma (GOM):** Eastern entry (flights from Kigali)\n` +
        `- **Bukavu/Cyangugu:** Land border from Rwanda\n` +
        `- **Mahagi:** Land border from Uganda (for NE DRC)`,
      data: {
        evisaUrl: 'https://evisa.gouv.cd/',
        mandatoryVaccines: ['Yellow fever'],
        recommendedVaccines: ['Hepatitis A/B', 'Typhoid', 'Tetanus', 'Polio'],
      },
      timestamp: new Date().toISOString(),
      actions: [
        {
          id: 'action_visa_trip',
          label: 'Plan full trip',
          type: 'dispatch',
          payload: { agentId: 'trip', query: 'Plan a complete trip to DRC' },
        },
      ],
    };
  }

  // ----- Destination brief (if destination found) -----
  if (dest) {
    return buildDestinationBrief(dest, teamSize);
  }

  // ----- Default response -----
  return {
    id: generateMessageId(),
    agentId: 'trip',
    role: 'agent',
    content:
      `## Trip Planning Agent — Ready\n\n` +
      `I plan travel logistics for DRC gold mining operations. I can help with:\n\n` +
      `- **Trip itineraries** — Day-by-day plans for regulatory, site visit, or exploration trips\n` +
      `- **Flight routing** — Best connections to DRC mining areas\n` +
      `- **Ground transport** — Vehicle hire, road conditions, travel times\n` +
      `- **Accommodation** — Hotels, guesthouses, camp setup\n` +
      `- **Meeting coordination** — Government, community, and partner meetings\n` +
      `- **Security arrangements** — Escorts, evacuation plans, satellite communications\n` +
      `- **Visa & entry** — DRC visa process and health requirements\n\n` +
      `### Available Itinerary Templates\n` +
      ITINERARY_TEMPLATES.map((i) => `- **${i.name}** (${i.duration}) — ${i.purpose}`).join('\n') +
      `\n\nWhere are you planning to travel?`,
    data: {
      destinations: DRC_DESTINATIONS.map((d) => d.city),
      itineraryTemplates: ITINERARY_TEMPLATES.map((i) => i.name),
    },
    timestamp: new Date().toISOString(),
    actions: ITINERARY_TEMPLATES.map((i) => ({
      id: `action_itin_${i.destination.replace(/[\s/]/g, '_')}`,
      label: i.name,
      type: 'dispatch' as const,
      payload: { agentId: 'trip', query: `Plan a ${i.name}` },
    })),
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildDestinationBrief(dest: DRCDestination, teamSize: number): AgentMessage {
  const hotelMatches = [
    ...getHotelsByCity(dest.city),
    ...getHotelsByProvince(dest.province),
  ].slice(0, 4);
  const hotelLines = hotelMatches.length > 0
    ? hotelMatches.map((hotel) => `${hotel.name} (${hotel.priceRange}; security ${hotel.securityRating}/5)`)
    : dest.hotelOptions;

  return {
    id: generateMessageId(),
    agentId: 'trip',
    role: 'agent',
    content:
      `## Travel Brief: ${dest.city}, ${dest.province}\n\n` +
      `**Airport:** ${dest.iata ? `${dest.city} (${dest.iata})` : 'No scheduled service — charter required'}\n` +
      `**Security Level:** ${dest.securityLevel.toUpperCase()}\n` +
      `**Team Size:** ${teamSize} persons\n\n` +
      `### Getting There\n` +
      `**Airlines:** ${dest.airlines.join(', ')}\n\n` +
      `### Accommodation\n` +
      hotelLines.map((hotel) => `- ${hotel}`).join('\n') +
      `\n\n### Ground Transport\n` +
      `${dest.groundTransport}\n\n` +
      `### Medical Facilities\n` +
      `${dest.medicalFacilities}\n\n` +
      `### Visa & Entry\n` +
      `${dest.visaNotes}\n\n` +
      `### Estimated Trip Costs (${teamSize} persons, 5 days)\n` +
      `- Flights: $${(1500 * teamSize).toLocaleString()} - $${(4000 * teamSize).toLocaleString()}\n` +
      `- Accommodation: $${(80 * 5 * teamSize).toLocaleString()} - $${(200 * 5 * teamSize).toLocaleString()}\n` +
      `- Ground transport: $${(100 * 5).toLocaleString()} - $${(200 * 5).toLocaleString()}\n` +
      `- Meals & incidentals: $${(50 * 5 * teamSize).toLocaleString()} - $${(100 * 5 * teamSize).toLocaleString()}\n` +
      `- Security: $${(200 * 5).toLocaleString()} - $${(500 * 5).toLocaleString()}\n` +
      `- **Total estimate:** $${(2000 * teamSize + 1500).toLocaleString()} - $${(5000 * teamSize + 3500).toLocaleString()}`,
    data: {
      destination: dest.city,
      province: dest.province,
      iata: dest.iata,
      securityLevel: dest.securityLevel,
      teamSize,
      airlines: dest.airlines,
      hotels: hotelLines,
    },
    timestamp: new Date().toISOString(),
    actions: [
      {
        id: 'action_brief_itinerary',
        label: 'Full itinerary',
        type: 'dispatch',
        payload: { agentId: 'trip', query: `Create a detailed itinerary for ${dest.city}` },
      },
      {
        id: 'action_brief_security',
        label: 'Security briefing',
        type: 'dispatch',
        payload: { agentId: 'local-intel', query: `Security assessment for ${dest.province}` },
      },
      {
        id: 'action_brief_language',
        label: 'Language prep',
        type: 'dispatch',
        payload: { agentId: 'language', query: `Key phrases for travel to ${dest.province}` },
      },
    ],
  };
}
