export interface RegionIntelligence {
  province: string;
  territory: string;
  coordinates: [number, number];
  languages: { name: string; type: 'official' | 'national' | 'local'; prevalence: string }[];
  accommodation: { name: string; type: string; priceRange: string }[];
  security: { level: 'low' | 'medium' | 'high' | 'critical'; armedGroups: string[]; recommendations: string[] };
  infrastructure: { airports: string[]; roads: string[]; power: string; communications: string };
  artisanalMining: { estimatedMiners: number; minerals: string[]; cooperatives: string[]; conflictRisk: string };
  keyContacts: { role: string; description: string; location: string }[];
}

export const DRC_REGION_INTEL: RegionIntelligence[] = [
  {
    province: 'Haut-Uele',
    territory: 'Watsa',
    coordinates: [3.03, 29.53],
    languages: [
      { name: 'French', type: 'official', prevalence: 'Government and education' },
      { name: 'Lingala', type: 'national', prevalence: 'Widely spoken in trade' },
      { name: 'Pazande', type: 'local', prevalence: 'Dominant local language' },
    ],
    accommodation: [
      { name: 'Mission Catholique Watsa', type: 'Mission guesthouse', priceRange: '$10-25/night' },
      { name: 'Hotel Durba', type: 'Basic hotel', priceRange: '$15-35/night' },
    ],
    security: {
      level: 'medium',
      armedGroups: ['LRA remnants', 'Local Mai-Mai factions'],
      recommendations: [
        'Travel with local escort between towns',
        'Avoid travel after dark on rural roads',
        'Register with MONUSCO field office in Dungu',
      ],
    },
    infrastructure: {
      airports: ['Watsa airstrip (unpaved, light aircraft only)'],
      roads: ['RN4 from Kisangani (poor condition, 2-3 days)'],
      power: 'No public grid; generator-dependent',
      communications: 'Airtel limited coverage in Watsa town; no coverage in mining areas',
    },
    artisanalMining: {
      estimatedMiners: 15000,
      minerals: ['Gold', 'Diamonds'],
      cooperatives: ['COKIWA', 'COMIKA'],
      conflictRisk: 'Medium - historical LRA presence disrupts operations periodically',
    },
    keyContacts: [
      { role: 'Chef de Poste', description: 'Local government administrator', location: 'Watsa centre' },
      { role: 'SAEMAPE agent', description: 'Artisanal mining oversight officer', location: 'Watsa mining office' },
      { role: 'MONUSCO liaison', description: 'UN peacekeeping contact', location: 'Dungu base' },
    ],
  },
  {
    province: 'Ituri',
    territory: 'Djugu',
    coordinates: [2.13, 30.50],
    languages: [
      { name: 'French', type: 'official', prevalence: 'Administrative use' },
      { name: 'Swahili', type: 'national', prevalence: 'Widely spoken' },
      { name: 'Lendu', type: 'local', prevalence: 'Dominant in rural Djugu' },
      { name: 'Hema', type: 'local', prevalence: 'Spoken in trading centres' },
    ],
    accommodation: [
      { name: 'Hotel Ituri Bunia', type: 'Mid-range hotel', priceRange: '$40-80/night' },
      { name: 'Bunia Guesthouse', type: 'NGO guesthouse', priceRange: '$25-50/night' },
      { name: 'Camp tents (field)', type: 'Field camping', priceRange: '$5-10/night' },
    ],
    security: {
      level: 'critical',
      armedGroups: ['CODECO', 'FPIC', 'ADF affiliates'],
      recommendations: [
        'Mandatory MONUSCO escort for field travel',
        'Daily security briefing from UNDSS Bunia',
        'Avoid Lendu-Hema tension zones without mediation',
        'Maintain satellite communication at all times',
      ],
    },
    infrastructure: {
      airports: ['Bunia Airport (paved, commercial flights via CAA)'],
      roads: ['RN27 Bunia-Djugu (partially paved)', 'Mining tracks require 4x4'],
      power: 'Limited SNEL grid in Bunia; solar and generators elsewhere',
      communications: 'Vodacom and Airtel in Bunia; patchy in Djugu territory',
    },
    artisanalMining: {
      estimatedMiners: 45000,
      minerals: ['Gold', 'Coltan'],
      cooperatives: ['COOPERAMMA', 'COMIDI'],
      conflictRisk: 'Critical - active armed group involvement in mining sites',
    },
    keyContacts: [
      { role: 'Provincial Mining Division', description: 'Ituri mining authority', location: 'Bunia' },
      { role: 'UNDSS Officer', description: 'UN security coordination', location: 'Bunia' },
      { role: 'Tribal Chief (Lendu)', description: 'Community access negotiator', location: 'Djugu centre' },
    ],
  },
  {
    province: 'South Kivu',
    territory: 'Mwenga',
    coordinates: [-3.04, 28.43],
    languages: [
      { name: 'French', type: 'official', prevalence: 'Administrative and business' },
      { name: 'Swahili', type: 'national', prevalence: 'Primary spoken language' },
      { name: 'Kilega', type: 'local', prevalence: 'Dominant in Mwenga territory' },
    ],
    accommodation: [
      { name: 'Hotel Horizon Bukavu', type: 'Mid-range hotel', priceRange: '$50-100/night' },
      { name: 'Maison d\'accueil Mwenga', type: 'Church guesthouse', priceRange: '$10-20/night' },
    ],
    security: {
      level: 'high',
      armedGroups: ['Raia Mutomboki', 'Mai-Mai Yakutumba', 'FDLR remnants'],
      recommendations: [
        'Coordinate movements with FARDC local command',
        'Use Bukavu as operational base with day trips',
        'Engage Lega traditional leaders before site visits',
      ],
    },
    infrastructure: {
      airports: ['Kavumu Airport (Bukavu, paved, limited commercial)'],
      roads: ['RN2 Bukavu-Mwenga (degraded, 4-6 hours)', 'Mining tracks seasonal only'],
      power: 'Hydroelectric from Ruzizi in Bukavu; none in Mwenga interior',
      communications: 'Vodacom coverage in Mwenga town; satellite needed for field sites',
    },
    artisanalMining: {
      estimatedMiners: 60000,
      minerals: ['Gold', 'Cassiterite', 'Coltan'],
      cooperatives: ['COOPERAMA', 'COMIKA-SK'],
      conflictRisk: 'High - multiple armed groups tax mining sites',
    },
    keyContacts: [
      { role: 'Division des Mines', description: 'Provincial mining authority', location: 'Bukavu' },
      { role: 'IPIS researcher', description: 'Conflict mapping contact', location: 'Bukavu' },
      { role: 'Chef de Groupement', description: 'Traditional authority for land access', location: 'Mwenga' },
    ],
  },
  {
    province: 'Maniema',
    territory: 'Kabambare',
    coordinates: [-4.05, 27.57],
    languages: [
      { name: 'French', type: 'official', prevalence: 'Government offices' },
      { name: 'Swahili', type: 'national', prevalence: 'Widely spoken across province' },
      { name: 'Kiluba', type: 'local', prevalence: 'Common in southern Maniema' },
    ],
    accommodation: [
      { name: 'Hotel Maniema Kindu', type: 'Basic hotel', priceRange: '$20-40/night' },
      { name: 'Kabambare Mission', type: 'Mission guesthouse', priceRange: '$10-15/night' },
    ],
    security: {
      level: 'medium',
      armedGroups: ['Mai-Mai dispersed factions'],
      recommendations: [
        'Travel in convoy on Kindu-Kabambare route',
        'Maintain radio contact with Kindu base',
        'Engage local chiefs for safe passage agreements',
      ],
    },
    infrastructure: {
      airports: ['Kindu Airport (paved, limited flights)', 'Kabambare airstrip (unpaved)'],
      roads: ['Kindu-Kabambare route (very poor, dry season only, 8-12 hours)'],
      power: 'Minimal SNEL in Kindu; generators only in Kabambare',
      communications: 'Airtel coverage in Kindu; very limited in Kabambare',
    },
    artisanalMining: {
      estimatedMiners: 25000,
      minerals: ['Gold', 'Cassiterite', 'Wolframite'],
      cooperatives: ['COMAKAB', 'COOMIKA'],
      conflictRisk: 'Medium - remote location limits armed group control but enables smuggling',
    },
    keyContacts: [
      { role: 'Administrator de Territoire', description: 'Kabambare territorial authority', location: 'Kabambare' },
      { role: 'SAEMAPE delegate', description: 'Artisanal mining oversight', location: 'Kindu' },
      { role: 'River transport chief', description: 'Coordinates Congo River logistics', location: 'Kindu port' },
    ],
  },
  {
    province: 'North Kivu',
    territory: 'Lubero',
    coordinates: [-0.15, 29.23],
    languages: [
      { name: 'French', type: 'official', prevalence: 'Education and administration' },
      { name: 'Swahili', type: 'national', prevalence: 'Primary language of commerce' },
      { name: 'Kinande', type: 'local', prevalence: 'Dominant Nande language in Lubero' },
    ],
    accommodation: [
      { name: 'Hotel Linda Butembo', type: 'Mid-range hotel', priceRange: '$30-60/night' },
      { name: 'Auberge de Lubero', type: 'Basic guesthouse', priceRange: '$15-25/night' },
      { name: 'Hotel Kivu Goma', type: 'International hotel', priceRange: '$80-150/night' },
    ],
    security: {
      level: 'high',
      armedGroups: ['ADF', 'Mai-Mai Mazembe', 'FDLR'],
      recommendations: [
        'Avoid Beni-Lubero road corridor without military escort',
        'Monitor ADF attack patterns via UNDSS alerts',
        'Use Butembo as forward base; avoid overnight in rural areas',
        'Keep low profile regarding mining activities',
      ],
    },
    infrastructure: {
      airports: ['Goma International Airport (paved, regular flights)', 'Butembo airstrip (light aircraft)'],
      roads: ['RN2 Goma-Butembo (paved but insecure sections)', 'RN4 Butembo-Lubero (degraded)'],
      power: 'Virunga Energy hydroelectric in Butembo area; SNEL in Goma',
      communications: 'Good Vodacom/Airtel coverage Goma-Butembo; limited in mining zones',
    },
    artisanalMining: {
      estimatedMiners: 35000,
      minerals: ['Gold', 'Coltan', 'Wolframite'],
      cooperatives: ['COOPERAMMA-NK', 'COMIMPA'],
      conflictRisk: 'High - ADF and Mai-Mai factions tax and control mining sites',
    },
    keyContacts: [
      { role: 'Division des Mines NK', description: 'Provincial mining division', location: 'Goma' },
      { role: 'MONUSCO Force Commander', description: 'Military security coordination', location: 'Goma HQ' },
      { role: 'Nande business council', description: 'Local business network access', location: 'Butembo' },
    ],
  },
  {
    province: 'Tshopo',
    territory: 'Kisangani',
    coordinates: [0.52, 25.20],
    languages: [
      { name: 'French', type: 'official', prevalence: 'Primary administrative language' },
      { name: 'Lingala', type: 'national', prevalence: 'Dominant spoken language' },
      { name: 'Swahili', type: 'national', prevalence: 'Common in eastern Tshopo' },
      { name: 'Lokele', type: 'local', prevalence: 'Spoken along Congo River communities' },
    ],
    accommodation: [
      { name: 'Hotel Palm Beach', type: 'Mid-range hotel', priceRange: '$40-75/night' },
      { name: 'Hotel Kisangani', type: 'Basic hotel', priceRange: '$20-40/night' },
      { name: 'Congo River Lodge', type: 'Guesthouse', priceRange: '$30-55/night' },
    ],
    security: {
      level: 'low',
      armedGroups: [],
      recommendations: [
        'Standard urban precautions in Kisangani',
        'Register with provincial authorities for field travel',
        'River travel requires proper permits and safety equipment',
      ],
    },
    infrastructure: {
      airports: ['Bangoka International Airport (paved, regular domestic flights)'],
      roads: ['RN4 eastward (poor beyond Kisangani)', 'RN7 southward to Kindu (very poor)'],
      power: 'SNEL hydroelectric from Tshopo Falls; intermittent supply',
      communications: 'Good mobile coverage in Kisangani; limited in surrounding territories',
    },
    artisanalMining: {
      estimatedMiners: 20000,
      minerals: ['Gold', 'Diamonds'],
      cooperatives: ['COOMIKI', 'COMITSHOPO'],
      conflictRisk: 'Low - relatively stable province with government oversight',
    },
    keyContacts: [
      { role: 'Provincial Governor\'s office', description: 'Provincial administration', location: 'Kisangani' },
      { role: 'SAEMAPE Provincial', description: 'Artisanal mining authority', location: 'Kisangani' },
      { role: 'University of Kisangani (UNIKIS)', description: 'Geological research contacts', location: 'Kisangani' },
    ],
  },
];

export function getIntelByProvince(province: string): RegionIntelligence[] {
  const normalized = province.toLowerCase().trim();
  return DRC_REGION_INTEL.filter(
    (region) =>
      region.province.toLowerCase() === normalized ||
      normalized.includes(region.province.toLowerCase()) ||
      region.province.toLowerCase().includes(normalized)
  );
}
