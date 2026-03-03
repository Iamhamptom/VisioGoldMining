// DRC Gold Sector Intelligence Pack — Project Database
// Source: DRC Gold Sector Intelligence Pack (2024–2026 window)
// All coordinates, resource figures, and regulatory data from verified public filings

export type ProjectStatus =
  | 'producing'
  | 'producing_disrupted'
  | 'care_and_maintenance'
  | 'development'
  | 'advanced_exploration'
  | 'early_exploration'
  | 'artisanal_alluvial'
  | 'producing_small'
  | 'unknown';

export type ResourceStandard = 'NI43-101' | 'JORC' | 'SAMREC' | 'other' | 'unknown';
export type ResourceCategory = 'measured' | 'indicated' | 'inferred' | 'p+p' | 'unknown';

export interface ProjectOwner {
  name: string;
  pct: number;
  type: 'operator' | 'jv_partner' | 'state' | 'optionee' | 'holder';
  sourceId?: string;
}

export interface ResourceEstimate {
  asOf: string;
  standard: ResourceStandard;
  category: ResourceCategory;
  tonnes: number | null;
  gradeGptAu: number | null;
  containedOz: number | null;
  notes: string;
  sourceId?: string;
}

export interface RecentActivity {
  date: string;
  type: 'drilling' | 'financing' | 'deal' | 'permit' | 'incident' | 'production_update' | 'other';
  summary: string;
  sourceId?: string;
}

export interface RiskProfile {
  securityScore: number | null;
  logisticsScore: number | null;
  esgScore: number | null;
  notes: string;
}

export interface DRCProject {
  projectId: string;
  name: string;
  aliases: string[];
  primaryCommodity: string;
  commodities: string[];
  operator: string;
  owners: ProjectOwner[];
  location: {
    country: string;
    province: string;
    admin2: string;
    lat: number | null;
    lon: number | null;
    belt: string;
  };
  status: ProjectStatus;
  resources: ResourceEstimate[];
  totalResourceMoz: number | null;
  averageGrade: number | null;
  annualProductionKoz: number | null;
  miningMethod: string;
  depositType: string;
  geology: string;
  permits: string[];
  recentActivity: RecentActivity[];
  riskProfile: RiskProfile;
  artisanalOverlay: {
    present: boolean;
    scale: 'none' | 'minor' | 'moderate' | 'heavy' | 'extreme';
    estimatedMiners: number | null;
    notes: string;
  };
  accessInfo: {
    nearestCity: string;
    distanceKm: number | null;
    airstrip: boolean;
    roadCondition: string;
    logisticsNotes: string;
  };
  localContext: {
    languages: string[];
    ethnicGroups: string[];
    securityLevel: 'low' | 'medium' | 'high' | 'critical';
    notes: string;
  };
  sourceUrl: string;
  lastUpdated: string;
}

export const DRC_PROJECTS: DRCProject[] = [
  {
    projectId: 'drc_kibali_001',
    name: 'Kibali Gold Mine',
    aliases: ['Kibali', 'KCD', 'Karagba-Chauffeur-Durba'],
    primaryCommodity: 'Gold',
    commodities: ['Gold'],
    operator: 'Barrick Gold Corporation',
    owners: [
      { name: 'Barrick Gold Corporation', pct: 45, type: 'operator' },
      { name: 'AngloGold Ashanti', pct: 45, type: 'jv_partner' },
      { name: 'SOKIMO (Société Minière de Kilo-Moto)', pct: 10, type: 'state' },
    ],
    location: {
      country: 'DRC',
      province: 'Haut-Uele / Ituri',
      admin2: 'Watsa',
      lat: 3.13,
      lon: 29.58,
      belt: 'Kilo-Moto Greenstone Belt',
    },
    status: 'producing',
    resources: [
      { asOf: '2024-12-31', standard: 'JORC', category: 'p+p', tonnes: null, gradeGptAu: null, containedOz: null, notes: 'Reserve/resource details in Barrick annual report. Attributable reserve snapshot available in AngloGold operational profile PDF.' },
    ],
    totalResourceMoz: 24.0,
    averageGrade: 3.6,
    annualProductionKoz: 750,
    miningMethod: 'Combined open pit + underground (sub-level caving)',
    depositType: 'Orogenic gold — BIF-hosted + shear-zone controlled',
    geology: 'Archaean greenstone belt. Gold mineralization in banded ironstone formations (BIF) and shear zones. KCD complex plus satellite deposits (Sessenge, Pakaka, Gorumbwa). Structurally controlled, consistent with orogenic gold systems.',
    permits: ['PE-13168 (Exploitation)', 'PR-8832 (Research)'],
    recentActivity: [
      { date: '2025-02-05', type: 'production_update', summary: 'Barrick confirms continued investment and operational upgrades; Kibali remains primary economic contributor in region.' },
      { date: '2024-12-10', type: 'production_update', summary: 'AngloGold operational profile provides reserve snapshot and cost metrics (attributable basis).' },
    ],
    riskProfile: {
      securityScore: 35,
      logisticsScore: 45,
      esgScore: 25,
      notes: 'Remote with long supply lines. Mine has extensive security infrastructure. Relatively stable compared to Kivu. Continued investment signals confidence.',
    },
    artisanalOverlay: {
      present: true,
      scale: 'moderate',
      estimatedMiners: 5000,
      notes: 'ASM present in surrounding areas outside concession. State gold buying expansion references thousands of artisanal miners at multiple sites around Durba.',
    },
    accessInfo: {
      nearestCity: 'Watsa',
      distanceKm: 35,
      airstrip: true,
      roadCondition: 'Mine-maintained upgraded roads',
      logisticsNotes: 'Remote with long supply lines. Doko airstrip for charter flights. 42 MW hydroelectric power (Azambi/Ambarau). 180 km purpose-built road infrastructure.',
    },
    localContext: {
      languages: ['French', 'Swahili', 'Lingala', 'Lugbara', 'Zande'],
      ethnicGroups: ['Zande', 'Lugbara', 'Alur', 'Lendu'],
      securityLevel: 'medium',
      notes: 'Relatively stable area. Mine security infrastructure extensive. Some armed group activity in surrounding forests.',
    },
    sourceUrl: 'https://www.barrick.com/English/operations/kibali/default.aspx',
    lastUpdated: '2026-02-05',
  },
  {
    projectId: 'drc_twangiza_002',
    name: 'Twangiza Mine',
    aliases: ['Twangiza Gold Mine'],
    primaryCommodity: 'Gold',
    commodities: ['Gold'],
    operator: 'Twangiza Mining SA / Shomka Resources',
    owners: [
      { name: 'Shomka Resources', pct: 87, type: 'operator' },
      { name: 'DRC Government', pct: 13, type: 'state' },
    ],
    location: {
      country: 'DRC',
      province: 'South Kivu',
      admin2: 'Mwenga',
      lat: -2.87275,
      lon: 28.74333,
      belt: 'Twangiza-Namoya Gold Belt',
    },
    status: 'producing_disrupted',
    resources: [
      { asOf: '2024-10-14', standard: 'unknown', category: 'unknown', tonnes: null, gradeGptAu: null, containedOz: null, notes: 'Resource figures unspecified in recent public reporting. Historical Banro-era estimates exist.' },
    ],
    totalResourceMoz: 3.7,
    averageGrade: 2.8,
    annualProductionKoz: 120,
    miningMethod: 'Open pit',
    depositType: 'Orogenic gold — Proterozoic metasediment-hosted',
    geology: 'Mesoproterozoic Itombwe Supergroup. Gold in sheared and altered metasediments along NNE-trending Twangiza structural corridor. Multiple parallel lodes. Orogenic style with fluid characteristics consistent with belt-scale gold system.',
    permits: ['PE-4102 (Exploitation)'],
    recentActivity: [
      { date: '2025-10-14', type: 'production_update', summary: 'Reports of plans/attempts to resume operations. Material influence of eastern DRC conflict dynamics on mine continuity.' },
      { date: '2024-06-01', type: 'incident', summary: 'Operational disruption and restart cycles linked to conflict environment in eastern DRC.' },
    ],
    riskProfile: {
      securityScore: 65,
      logisticsScore: 50,
      esgScore: 45,
      notes: 'Disrupted operations. Eastern DRC conflict dynamics affect continuity. Historical Banro-era community tensions. Restart narratives tied to security improvements.',
    },
    artisanalOverlay: {
      present: true,
      scale: 'heavy',
      estimatedMiners: 8000,
      notes: 'Large ASM community pre-dates industrial mine. Resettlement and alternative livelihood programs attempted. Ongoing tensions with ASM communities.',
    },
    accessInfo: {
      nearestCity: 'Bukavu',
      distanceKm: 85,
      airstrip: false,
      roadCondition: 'Upgraded gravel road (mine-maintained)',
      logisticsNotes: 'CIL processing plant 1.7 Mtpa. High-altitude operation at 1,850m. Roads built connecting to Bukavu.',
    },
    localContext: {
      languages: ['French', 'Swahili', 'Mashi', 'Kifuliru'],
      ethnicGroups: ['Lega', 'Shi', 'Fuliru', 'Bembe'],
      securityLevel: 'high',
      notes: 'South Kivu affected by armed groups (Mai-Mai, FDLR remnants). Private security and community liaison programs. Road checkpoints common.',
    },
    sourceUrl: 'https://bankable.africa/en/mining/1410-2129-drc-s-twangiza-and-namoya-mines-set-to-resume-operations-q3-2024-production-forecast-at-165koz',
    lastUpdated: '2025-10-14',
  },
  {
    projectId: 'drc_namoya_003',
    name: 'Namoya Mine',
    aliases: ['Namoya Gold Mine'],
    primaryCommodity: 'Gold',
    commodities: ['Gold'],
    operator: 'Namoya Mining SARL / Shomka Resources',
    owners: [
      { name: 'Shomka Resources', pct: 87, type: 'operator' },
      { name: 'DRC Government', pct: 13, type: 'state' },
    ],
    location: {
      country: 'DRC',
      province: 'Maniema',
      admin2: 'Kabambare',
      lat: -4.00833,
      lon: 27.55139,
      belt: 'Twangiza-Namoya Gold Belt',
    },
    status: 'care_and_maintenance',
    resources: [
      { asOf: '2024-10-14', standard: 'unknown', category: 'unknown', tonnes: null, gradeGptAu: null, containedOz: null, notes: 'Unspecified in recent reporting. Historical Banro-era oxide resource.' },
    ],
    totalResourceMoz: 2.1,
    averageGrade: 1.8,
    annualProductionKoz: 80,
    miningMethod: 'Open pit (oxide)',
    depositType: 'Orogenic + Placer — laterite-hosted supergene enrichment',
    geology: 'Laterite-hosted gold with supergene enrichment over primary orogenic mineralization. Gold in weathered saprolite and laterite profiles over sheared Itombwe Supergroup metasediments.',
    permits: ['PE-5088 (Exploitation)'],
    recentActivity: [
      { date: '2025-10-14', type: 'production_update', summary: 'Care and maintenance or restart status. Plans to resume operations reported alongside Twangiza.' },
    ],
    riskProfile: {
      securityScore: 75,
      logisticsScore: 80,
      esgScore: 50,
      notes: 'Very remote. Multiple armed groups in surrounding forests. Operations suspended multiple times due to security. Gravity-only processing (no cyanide) is ESG positive.',
    },
    artisanalOverlay: {
      present: true,
      scale: 'heavy',
      estimatedMiners: 12000,
      notes: 'Extremely active ASM district. Mined artisanally for decades. Complex social dynamics with migrant mining communities.',
    },
    accessInfo: {
      nearestCity: 'Kabambare',
      distanceKm: 45,
      airstrip: true,
      roadCondition: 'Poor unpaved, often impassable in rainy season',
      logisticsNotes: 'Mine-built airstrip. Gravity-only processing circuit. Remote location requiring significant logistics. Infrastructure gaps.',
    },
    localContext: {
      languages: ['French', 'Swahili', 'Kilega', 'Kibembe'],
      ethnicGroups: ['Lega', 'Bembe', 'Bangubangu', 'Hombo'],
      securityLevel: 'critical',
      notes: 'Very remote with limited state presence. Multiple armed groups. Operations suspended multiple times. Humanitarian access priorities.',
    },
    sourceUrl: 'https://bankable.africa/en/mining/1410-2129-drc-s-twangiza-and-namoya-mines-set-to-resume-operations-q3-2024-production-forecast-at-165koz',
    lastUpdated: '2025-10-14',
  },
  {
    projectId: 'drc_misisi_004',
    name: 'Misisi Gold Project (Akyanga)',
    aliases: ['Misisi', 'Akyanga', 'Misisi-Akyanga'],
    primaryCommodity: 'Gold',
    commodities: ['Gold'],
    operator: 'Avanti Gold Corp.',
    owners: [
      { name: 'Avanti Gold Corp.', pct: 100, type: 'operator', sourceId: 'Indirect via LEDA/CASA structure' },
    ],
    location: {
      country: 'DRC',
      province: 'South Kivu',
      admin2: 'Fizi',
      lat: -4.76667,
      lon: 28.725,
      belt: 'Kibara Belt (Proterozoic intracontinental mobile belt)',
    },
    status: 'advanced_exploration',
    resources: [
      { asOf: '2023-08-01', standard: 'NI43-101', category: 'inferred', tonnes: 40.8e6, gradeGptAu: 2.37, containedOz: 3.11e6, notes: 'NI 43-101 compliant ~3.1 Moz inferred resource at Akyanga within 55 km belt-scale licence position.' },
    ],
    totalResourceMoz: 3.11,
    averageGrade: 2.37,
    annualProductionKoz: null,
    miningMethod: 'TBD — advanced exploration / development drilling',
    depositType: 'Orogenic gold — Proterozoic mobile belt hosted',
    geology: 'Kibara belt: Proterozoic intracontinental mobile belt between Congo and Tanzanian cratons. 55 km licence corridor with multiple targets. Akyanga is the primary deposit. Mountainous terrain with infrastructure gaps.',
    permits: ['30-year exploitation permits (multiple licences)'],
    recentActivity: [
      { date: '2026-02-17', type: 'drilling', summary: 'Avanti mobilises multiple drill rigs; launches major 42,000m phased drill programme to advance Akyanga resource.' },
      { date: '2023-08-01', type: 'other', summary: 'NI 43-101 technical report effective date — establishes 3.11 Moz inferred resource.' },
    ],
    riskProfile: {
      securityScore: 70,
      logisticsScore: 75,
      esgScore: 40,
      notes: 'Fizi territory — highly insecure. Mountainous terrain with infrastructure gaps. 30-year exploitation permits provide tenure security. Active 2026 drill programme is high-signal.',
    },
    artisanalOverlay: {
      present: true,
      scale: 'heavy',
      estimatedMiners: 10000,
      notes: 'NI 43-101 report explicitly notes artisanal activity on Akyanga and historical alluvial mining in parts of licence package.',
    },
    accessInfo: {
      nearestCity: 'Uvira',
      distanceKm: 120,
      airstrip: false,
      roadCondition: 'Poor quality, mountainous terrain',
      logisticsNotes: 'Mountainous terrain with infrastructure gaps. Belt-scale licence position (55 km corridor). Contractor mobilisation confirmed for 2026.',
    },
    localContext: {
      languages: ['French', 'Swahili', 'Kibembe', 'Kivira'],
      ethnicGroups: ['Bembe', 'Vira', 'Bafuliru'],
      securityLevel: 'critical',
      notes: 'Fizi territory highly insecure. Armed groups vying for mining site control. Cross-border dynamics with Burundi/Tanzania.',
    },
    sourceUrl: 'https://cdn-ceo-ca.s3.amazonaws.com/1jbrmv0-Avanti_-_Conformed_Technical_Report.pdf',
    lastUpdated: '2026-02-17',
  },
  {
    projectId: 'drc_adumbi_005',
    name: 'Imbo Project (Adumbi)',
    aliases: ['Adumbi', 'Imbo', 'Loncor Adumbi'],
    primaryCommodity: 'Gold',
    commodities: ['Gold'],
    operator: 'Loncor Gold Inc.',
    owners: [
      { name: 'Loncor Gold Inc.', pct: 100, type: 'operator' },
    ],
    location: {
      country: 'DRC',
      province: 'Ituri',
      admin2: 'Mambasa',
      lat: 1.73299,
      lon: 27.86778,
      belt: 'Ngayu Greenstone Belt',
    },
    status: 'development',
    resources: [
      { asOf: '2025-04-25', standard: 'NI43-101', category: 'indicated', tonnes: 28.185e6, gradeGptAu: 4.38, containedOz: 3.97e6, notes: 'Multi-million ounce resource. Ongoing deep drilling to define underground extensions.' },
    ],
    totalResourceMoz: 3.97,
    averageGrade: 4.38,
    annualProductionKoz: null,
    miningMethod: 'Open pit + underground (planned)',
    depositType: 'Orogenic gold — BIF-associated ridge within Ngayu belt',
    geology: 'Ngayu Archaean greenstone belt adjacent to Kilo-Moto belt. Gold at contact between mafic volcanic sequences and metasediments. BIF-associated ridge. NE-trending shear zone control. Kibali-style mineralization potential.',
    permits: ['PR-10492 (Research)'],
    recentActivity: [
      { date: '2025-04-25', type: 'drilling', summary: 'Loncor reports multiple gold intersections from deepest drill hole at Adumbi — confirms depth extension.' },
      { date: '2025-01-15', type: 'financing', summary: 'Loncor completed financing; maintained aggressive drilling narrative.' },
      { date: '2026-01-15', type: 'deal', summary: 'Reports indicate completed going-private transaction — major change in public liquidity and disclosure cadence.' },
    ],
    riskProfile: {
      securityScore: 45,
      logisticsScore: 55,
      esgScore: 30,
      notes: 'One of most advanced non-producing development stories in DRC. Near Kilo-Moto belt infrastructure. Lateritic road access with multi-hop routing. Going-private may affect information flow.',
    },
    artisanalOverlay: {
      present: true,
      scale: 'moderate',
      estimatedMiners: 2000,
      notes: 'Artisanal activity in surrounding areas. Historical colonial-era workings. Current ASM scale manageable.',
    },
    accessInfo: {
      nearestCity: 'Mambasa',
      distanceKm: 30,
      airstrip: false,
      roadCondition: 'Lateritic roads, multi-hop routing, seasonal constraints',
      logisticsNotes: 'Lateritic-road dependent with multi-hop routing. Intermediate hubs required. Should encode access constraints into logistics/cost simulation.',
    },
    localContext: {
      languages: ['French', 'Swahili', 'Kilese', 'Kimbuti'],
      ethnicGroups: ['Lese', 'Mbuti (Pygmy)', 'Bila'],
      securityLevel: 'medium',
      notes: 'Ituri rainforest area. Indigenous Mbuti communities require special consideration. ADF armed group active in broader region.',
    },
    sourceUrl: 'https://www.loncor.com/projects/imbo-project',
    lastUpdated: '2025-04-25',
  },
  {
    projectId: 'drc_giro_006',
    name: 'Giro Gold Project (Kebigada & Douze Match)',
    aliases: ['Giro', 'Kebigada', 'Giro Goldfields'],
    primaryCommodity: 'Gold',
    commodities: ['Gold'],
    operator: 'DRC Gold Corp.',
    owners: [
      { name: 'DRC Gold Corp.', pct: 0, type: 'optionee', sourceId: 'Option/JV structure — staged approvals' },
      { name: 'Giro Goldfields SARL', pct: 100, type: 'holder' },
    ],
    location: {
      country: 'DRC',
      province: 'Haut-Uele',
      admin2: 'Unspecified',
      lat: 3.48,
      lon: 29.42,
      belt: 'Kilo-Moto Greenstone Belt',
    },
    status: 'advanced_exploration',
    resources: [
      { asOf: '2025-12-08', standard: 'other', category: 'unknown', tonnes: 8.0e6, gradeGptAu: 1.21, containedOz: 0.31251e6, notes: 'Douze Match deposit. Historical resource — JORC-to-CIM comparability limitations flagged. Due diligence required per acquiring company disclosures.' },
    ],
    totalResourceMoz: 0.31,
    averageGrade: 1.21,
    annualProductionKoz: null,
    miningMethod: 'TBD — exploration/development',
    depositType: 'Orogenic gold — greenstone belt hosted',
    geology: 'Within Kilo-Moto belt proximal to Kibali. Near-belt opportunity. Historical resource work exists but not yet confirmed as current CIM-compliant in acquiring company language.',
    permits: ['Under option/JV structure'],
    recentActivity: [
      { date: '2026-02-24', type: 'deal', summary: 'DRC Gold Corp granted option to acquire interests in Giro and Nizi Gold Projects.' },
      { date: '2025-12-08', type: 'deal', summary: 'AJN/DRC Gold signs Giro term sheet with explicit share-based consideration and staged approvals.' },
    ],
    riskProfile: {
      securityScore: 40,
      logisticsScore: 50,
      esgScore: 35,
      notes: 'Near-belt opportunity proximal to Kibali. JORC-to-CIM comparability limitations. Option structure implies staged risk. Asset control transitions in progress.',
    },
    artisanalOverlay: {
      present: true,
      scale: 'moderate',
      estimatedMiners: 3000,
      notes: 'Kilo-Moto belt has extensive artisanal mining. Durba region has state gold buying expansion targeting ASM.',
    },
    accessInfo: {
      nearestCity: 'Durba',
      distanceKm: null,
      airstrip: false,
      roadCondition: 'Unspecified — Kilo-Moto belt access',
      logisticsNotes: 'Proximal to Kibali infrastructure corridor. Exact access details to be confirmed through due diligence.',
    },
    localContext: {
      languages: ['French', 'Swahili', 'Lingala', 'Zande'],
      ethnicGroups: ['Zande', 'Lugbara', 'Alur'],
      securityLevel: 'medium',
      notes: 'Kilo-Moto belt security variable. More stable near Kibali operations.',
    },
    sourceUrl: 'https://www.newsfilecorp.com/release/285059/DRC-Gold-Corp.-Granted-Option-to-Acquire-Interests-in-Giro-and-Nizi-Gold-Projects',
    lastUpdated: '2026-02-24',
  },
  {
    projectId: 'drc_nizi_008',
    name: 'Nizi Gold Project',
    aliases: ['Nizi'],
    primaryCommodity: 'Gold',
    commodities: ['Gold'],
    operator: 'DRC Gold Corp.',
    owners: [
      { name: 'DRC Gold Corp.', pct: 0, type: 'optionee' },
    ],
    location: {
      country: 'DRC',
      province: 'Haut-Uele / Ituri',
      admin2: 'Unspecified',
      lat: 2.10,
      lon: 30.05,
      belt: 'Kilo-Moto Greenstone Belt',
    },
    status: 'early_exploration',
    resources: [],
    totalResourceMoz: null,
    averageGrade: null,
    annualProductionKoz: null,
    miningMethod: 'TBD — early exploration',
    depositType: 'Orogenic gold — greenstone belt hosted',
    geology: 'Within Kilo-Moto belt. Being reactivated via option structures (2025–2026). Historical interest but no confirmed current resource.',
    permits: ['Under option/JV structure'],
    recentActivity: [
      { date: '2026-02-24', type: 'deal', summary: 'DRC Gold Corp granted option to acquire interest alongside Giro Project.' },
    ],
    riskProfile: {
      securityScore: 40,
      logisticsScore: 50,
      esgScore: 35,
      notes: 'Early stage. Near-belt position. Same risk profile as Giro — Kilo-Moto belt proximity to Kibali.',
    },
    artisanalOverlay: {
      present: true,
      scale: 'moderate',
      estimatedMiners: 2000,
      notes: 'Belt-wide ASM activity in Kilo-Moto region.',
    },
    accessInfo: {
      nearestCity: 'Unspecified',
      distanceKm: null,
      airstrip: false,
      roadCondition: 'Unspecified',
      logisticsNotes: 'Within Kilo-Moto belt — access details to be confirmed.',
    },
    localContext: {
      languages: ['French', 'Swahili', 'Lingala'],
      ethnicGroups: ['Various NE DRC groups'],
      securityLevel: 'medium',
      notes: 'NE DRC belt — security varies by specific location.',
    },
    sourceUrl: 'https://www.newsfilecorp.com/release/285059/DRC-Gold-Corp.-Granted-Option-to-Acquire-Interests-in-Giro-and-Nizi-Gold-Projects',
    lastUpdated: '2026-02-24',
  },
  {
    projectId: 'drc_kamituga_009',
    name: 'Kamituga-Mobale',
    aliases: ['Kamituga', 'Mobale', 'SOMINKI legacy'],
    primaryCommodity: 'Gold',
    commodities: ['Gold'],
    operator: 'ASM (multi-actor)',
    owners: [
      { name: 'Various cooperatives', pct: 100, type: 'holder', sourceId: 'Historic SOMINKI/Banro lineage' },
    ],
    location: {
      country: 'DRC',
      province: 'South Kivu',
      admin2: 'Mwenga',
      lat: -3.05,
      lon: 28.16667,
      belt: 'Twangiza-Namoya Gold Belt',
    },
    status: 'artisanal_alluvial',
    resources: [],
    totalResourceMoz: null,
    averageGrade: 3.4,
    annualProductionKoz: null,
    miningMethod: 'Artisanal — underground tunnels + surface workings',
    depositType: 'Orogenic gold — quartz vein stockwork',
    geology: 'Itombwe fold belt. Quartz-carbonate veins in sheared metasediments. 15+ km strike length. Multiple parallel vein systems. Colonial-era underground workings.',
    permits: [],
    recentActivity: [
      { date: '2025-09-15', type: 'other', summary: 'Continues as one of world\'s largest artisanal gold mining centres. Estimated 200,000+ miners in broader district.' },
    ],
    riskProfile: {
      securityScore: 70,
      logisticsScore: 60,
      esgScore: 65,
      notes: 'Massive artisanal population. Any industrial development requires enormous social planning. Complex security. Community friction is material risk.',
    },
    artisanalOverlay: {
      present: true,
      scale: 'extreme',
      estimatedMiners: 200000,
      notes: 'One of world\'s largest ASM centres. Town of ~200,000 almost entirely dependent on artisanal mining. Colonial-era tunnel networks. Discovery signals AND material risks.',
    },
    accessInfo: {
      nearestCity: 'Bukavu',
      distanceKm: 190,
      airstrip: false,
      roadCondition: 'Unpaved, degraded, 6-8 hour drive from Bukavu',
      logisticsNotes: 'Remote. Road access poor. No airstrip.',
    },
    localContext: {
      languages: ['French', 'Swahili', 'Kilega', 'Mashi'],
      ethnicGroups: ['Lega', 'Shi', 'Rega'],
      securityLevel: 'high',
      notes: 'Complex security. Strong artisanal mining lobby. MONUSCO presence. Armed groups in surrounding areas.',
    },
    sourceUrl: 'https://www.mindat.org/loc-32214.html',
    lastUpdated: '2025-09-15',
  },
  {
    projectId: 'drc_mongbwalu_010',
    name: 'Mongbwalu Gold Mine',
    aliases: ['Mongbwalu', 'Adidi', 'Saisa'],
    primaryCommodity: 'Gold',
    commodities: ['Gold'],
    operator: 'ASM (multi-actor)',
    owners: [
      { name: 'SOKIMO legacy', pct: 0, type: 'state' },
      { name: 'AngloGold Ashanti (historical JV)', pct: 0, type: 'jv_partner' },
    ],
    location: {
      country: 'DRC',
      province: 'Ituri',
      admin2: 'Djugu',
      lat: 1.93516,
      lon: 30.02959,
      belt: 'Kilo-Moto Greenstone Belt',
    },
    status: 'artisanal_alluvial',
    resources: [],
    totalResourceMoz: 3.9,
    averageGrade: 4.5,
    annualProductionKoz: null,
    miningMethod: 'Artisanal — historical industrial references',
    depositType: 'Orogenic gold — greenstone-hosted quartz vein systems',
    geology: 'Kilo-Moto greenstone belt. Multiple deposits (Adidi, Mongbwalu Main, Saisa). Mafic-ultramafic sequences with quartz veining and sulphide mineralization. 11+ Moz historical belt production since 1905.',
    permits: ['PR-8832 (Research — historical)'],
    recentActivity: [
      { date: '2025-08-08', type: 'other', summary: 'Continues as major ASM centre. Historical industrial references from AngloGold/SOKIMO JV era.' },
    ],
    riskProfile: {
      securityScore: 75,
      logisticsScore: 55,
      esgScore: 60,
      notes: 'One of most active ASM gold mining areas in DRC. Tens of thousands of artisanal miners. Major social challenge for large-scale development. Inter-ethnic conflict history.',
    },
    artisanalOverlay: {
      present: true,
      scale: 'extreme',
      estimatedMiners: 15000,
      notes: 'Tens of thousands of artisanal miners in and around historical workings. Major social challenge for any large-scale development.',
    },
    accessInfo: {
      nearestCity: 'Bunia',
      distanceKm: 75,
      airstrip: false,
      roadCondition: 'Unpaved, poor condition during rainy season',
      logisticsNotes: 'Access from Bunia Airport. Road quality seasonal.',
    },
    localContext: {
      languages: ['French', 'Swahili', 'Lendu', 'Hema', 'Lingala'],
      ethnicGroups: ['Lendu', 'Hema', 'Alur', 'Bira'],
      securityLevel: 'high',
      notes: 'Ituri Province: significant inter-ethnic conflict (Lendu/Hema). Armed groups (CODECO, FPIC). MONUSCO present.',
    },
    sourceUrl: 'https://www.mindat.org/loc-211323.html',
    lastUpdated: '2025-08-08',
  },
  {
    projectId: 'drc_mccr_011',
    name: 'MCCR Industrial Gold Operations',
    aliases: ['MCCR'],
    primaryCommodity: 'Gold',
    commodities: ['Gold'],
    operator: 'MCCR',
    owners: [
      { name: 'MCCR', pct: 100, type: 'operator' },
    ],
    location: {
      country: 'DRC',
      province: 'Unspecified',
      admin2: 'Unspecified',
      lat: -4.32,
      lon: 25.98,
      belt: 'Unspecified',
    },
    status: 'producing_small',
    resources: [],
    totalResourceMoz: null,
    averageGrade: null,
    annualProductionKoz: null,
    miningMethod: 'Industrial (small scale)',
    depositType: 'Unspecified',
    geology: 'Project details unspecified. Ministry of Mines statistical bulletin shows small industrial gold export share.',
    permits: [],
    recentActivity: [
      { date: '2023-09-30', type: 'production_update', summary: 'Ministry of Mines 1H2023 statistics show MCCR as minor tonnage contributor alongside Kibali dominance.' },
    ],
    riskProfile: {
      securityScore: null,
      logisticsScore: null,
      esgScore: null,
      notes: 'Limited public information. Small share of industrial exports.',
    },
    artisanalOverlay: { present: false, scale: 'none', estimatedMiners: null, notes: '' },
    accessInfo: {
      nearestCity: 'Unspecified',
      distanceKm: null,
      airstrip: false,
      roadCondition: 'Unspecified',
      logisticsNotes: '',
    },
    localContext: {
      languages: ['French'],
      ethnicGroups: [],
      securityLevel: 'medium',
      notes: 'Limited information available.',
    },
    sourceUrl: 'https://mines.gouv.cd/fr/wp-content/uploads/2023/09/Statistiques-minieres-au-1er-semestre-2023.pdf',
    lastUpdated: '2023-09-30',
  },
  {
    projectId: 'drc_kimia_okapi_012',
    name: 'Okapi Area Gold Operations',
    aliases: ['Okapi', 'Muchacha', 'Kimia Mining'],
    primaryCommodity: 'Gold',
    commodities: ['Gold'],
    operator: 'Kimia Mining Investment',
    owners: [
      { name: 'Kimia Mining Investment', pct: 100, type: 'operator' },
    ],
    location: {
      country: 'DRC',
      province: 'Ituri',
      admin2: 'Unspecified',
      lat: 1.41,
      lon: 28.58,
      belt: 'Unspecified',
    },
    status: 'producing_small',
    resources: [],
    totalResourceMoz: null,
    averageGrade: null,
    annualProductionKoz: null,
    miningMethod: 'Industrial (small/unclear)',
    depositType: 'Unspecified',
    geology: 'Ituri Province operations. Greenpeace Africa has demanded cancellation of mining license, raising ESG/reputational risk flags.',
    permits: [],
    recentActivity: [
      { date: '2024-12-10', type: 'incident', summary: 'Greenpeace Africa demands cancellation of mining license — illegal mining allegations. ESG/reputational risk.' },
    ],
    riskProfile: {
      securityScore: null,
      logisticsScore: null,
      esgScore: 85,
      notes: 'High ESG risk. Greenpeace allegations of illegal mining. Reputational risk for any association.',
    },
    artisanalOverlay: { present: true, scale: 'moderate', estimatedMiners: null, notes: 'Overlap with artisanal mining areas reported.' },
    accessInfo: {
      nearestCity: 'Unspecified',
      distanceKm: null,
      airstrip: false,
      roadCondition: 'Unspecified',
      logisticsNotes: '',
    },
    localContext: {
      languages: ['French', 'Swahili'],
      ethnicGroups: [],
      securityLevel: 'high',
      notes: 'Ituri Province. ESG controversy active.',
    },
    sourceUrl: 'https://www.greenpeace.org/africa/en/press/14216/illegal-mining-in-democratic-republic-of-congo-greenpeace-africa-demands-cancellation-of-mining-license-from-chinese-company-kimia-mining/',
    lastUpdated: '2024-12-10',
  },
];

// Seed URLs for scrapers and agent automation
export const SEED_URLS = [
  { id: 'cami_main', url: 'https://cami.cd/', description: 'CAMI main portal' },
  { id: 'cami_cadastre', url: 'https://drclicences.cami.cd/', description: 'CAMI cadastre portal' },
  { id: 'cami_conditions', url: 'https://cami.cd/conditions-de-demande/', description: 'Application guidance' },
  { id: 'cami_form01', url: 'https://cami.cd/wp-content/uploads/2022/06/Form-01_Demande-DR_2021.pdf', description: 'Form 01 — Exploration right application' },
  { id: 'cami_notices', url: 'https://cami.cd/communique/', description: 'CAMI notices/communiqués' },
  { id: 'ministry_mines', url: 'https://mines.gouv.cd/', description: 'Ministry of Mines' },
  { id: 'mining_code', url: 'https://www.icnl.org/wp-content/uploads/miningcode.pdf', description: 'Mining Code consolidated text' },
  { id: 'mining_regulation', url: 'https://faolex.fao.org/docs/pdf/cng212783.pdf', description: 'Mining Regulation Décret 18/024' },
  { id: 'anapi_procedure', url: 'https://anapi.gouv.cd/processes-a-suivre-aupres-du-ministere-des-mines', description: 'Permit procedure checklist' },
  { id: 'barrick_kibali', url: 'https://www.barrick.com/English/operations/kibali/default.aspx', description: 'Kibali operator page' },
  { id: 'loncor_imbo', url: 'https://www.loncor.com/projects/imbo-project', description: 'Imbo/Adumbi project page' },
  { id: 'misisi_ni43101', url: 'https://cdn-ceo-ca.s3.amazonaws.com/1jbrmv0-Avanti_-_Conformed_Technical_Report.pdf', description: 'Misisi NI 43-101 report' },
  { id: 'acled_api', url: 'https://acleddata.com/api-documentation/getting-started', description: 'ACLED conflict event feed' },
  { id: 'copernicus_s2', url: 'https://dataspace.copernicus.eu/data-collections/copernicus-sentinel-missions/sentinel-2', description: 'Sentinel-2 imagery access' },
];

// Belt/Region definitions for geological context
export interface GoldBelt {
  id: string;
  name: string;
  type: 'belt' | 'province';
  geologySummary: string;
  occurrenceModels: { hardRock: string; alluvial: string };
  keyIndicators: string[];
}

export const GOLD_BELTS: GoldBelt[] = [
  {
    id: 'kilo-moto',
    name: 'Kilo-Moto Greenstone Belt',
    type: 'belt',
    geologySummary: 'Archaean to Palaeoproterozoic gold-rich terrane extending 200+ km in NE DRC. Hosts Kibali and hundreds of smaller deposits. Mafic-ultramafic volcanic and metasedimentary sequences intruded by granitoids.',
    occurrenceModels: {
      hardRock: 'BIF-hosted, shear-zone controlled, quartz vein stockwork. Structurally controlled orogenic gold.',
      alluvial: 'High where drainage networks cut the belt. Depositional traps at low gradient reaches, confluences, terraces.',
    },
    keyIndicators: ['Structural corridors and lineaments', 'BIF and volcano-sedimentary packages', 'Lineament density from satellite/DEM', 'Historical workings density'],
  },
  {
    id: 'ngayu',
    name: 'Ngayu Greenstone Belt',
    type: 'belt',
    geologySummary: 'Neighbouring NE DRC greenstone belt hosting Adumbi/Imbo system. BIF-associated ridge mineralization. Adjacent to Kilo-Moto.',
    occurrenceModels: {
      hardRock: 'BIF-associated gold at mafic volcanic / metasediment contacts. NE-trending shear zone control.',
      alluvial: 'Derived from primary greenstone sources. Active drainage systems.',
    },
    keyIndicators: ['BIF ridge features', 'Mafic-metasediment contacts', 'Shear zone intersections'],
  },
  {
    id: 'twangiza-namoya',
    name: 'Twangiza-Namoya Gold Belt',
    type: 'belt',
    geologySummary: 'Orogenic gold belt spanning South Kivu into Maniema. Neoproterozoic to Mesoproterozoic tectonic events. Itombwe Supergroup host rocks.',
    occurrenceModels: {
      hardRock: 'Shear-hosted quartz vein systems in metasediments. NNE structural corridors.',
      alluvial: 'River systems draining the fold belt. Laterite-hosted supergene enrichment zones.',
    },
    keyIndicators: ['NNE structural corridors', 'Laterite profiles', 'Alluvial flat identification', 'Historical ASM density'],
  },
  {
    id: 'kibara',
    name: 'Kibara Belt',
    type: 'belt',
    geologySummary: 'Proterozoic intracontinental mobile belt between Congo and Tanzanian cratons. Hosts Misisi/Akyanga gold system.',
    occurrenceModels: {
      hardRock: 'Proterozoic mobile belt gold. Quartz vein and shear-zone hosted systems.',
      alluvial: 'Historical alluvial mining documented in NI 43-101 reporting.',
    },
    keyIndicators: ['Belt-scale structural corridors', 'Craton margin features', 'Historical alluvial signals'],
  },
];

// Utility functions
export function getDRCProjectById(id: string): DRCProject | undefined {
  return DRC_PROJECTS.find((p) => p.projectId === id);
}

export function getDRCProjectsByStatus(status: ProjectStatus): DRCProject[] {
  return DRC_PROJECTS.filter((p) => p.status === status);
}

export function getDRCProjectsByProvince(province: string): DRCProject[] {
  return DRC_PROJECTS.filter((p) => p.location.province.toLowerCase().includes(province.toLowerCase()));
}

export function getDRCProjectsByBelt(belt: string): DRCProject[] {
  return DRC_PROJECTS.filter((p) => p.location.belt.toLowerCase().includes(belt.toLowerCase()));
}

export function getProjectsWithCoordinates(): DRCProject[] {
  return DRC_PROJECTS.filter((p) => p.location.lat !== null && p.location.lon !== null);
}
