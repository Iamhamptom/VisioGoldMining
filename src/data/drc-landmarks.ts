export interface DRCLandmark {
  id: string;
  name: string;
  type: 'unesco' | 'national_park' | 'landmark' | 'mountain' | 'river' | 'lake';
  province: string;
  coordinates: [number, number];
  description: string;
  visitorInfo: string;
  significance: string;
}

export const DRC_LANDMARKS: DRCLandmark[] = [
  {
    id: 'landmark-001',
    name: 'Virunga National Park',
    type: 'unesco',
    province: 'North Kivu',
    coordinates: [29.57, -0.93],
    description: 'Africa’s oldest national park covering volcanoes, savannah, and high biodiversity corridors.',
    visitorInfo: 'Access is highly security-dependent; permit and armed escort decisions change frequently.',
    significance: 'Global conservation asset and strategic land-use constraint for eastern logistics planning.',
  },
  {
    id: 'landmark-002',
    name: 'Kahuzi-Biega National Park',
    type: 'unesco',
    province: 'South Kivu',
    coordinates: [28.74, -2.25],
    description: 'Montane rainforest reserve west of Bukavu known for eastern lowland gorillas.',
    visitorInfo: 'Bukavu-based access; road checks common and park access depends on current security posture.',
    significance: 'Important ESG and biodiversity reference for South Kivu engagements.',
  },
  {
    id: 'landmark-003',
    name: 'Okapi Wildlife Reserve',
    type: 'unesco',
    province: 'Ituri',
    coordinates: [28.55, 1.15],
    description: 'Protected rainforest reserve in Ituri with major conservation oversight.',
    visitorInfo: 'Remote and sensitive. Access requires security coordination and conservation approvals.',
    significance: 'Material for ESG diligence around Ituri projects and licensing disputes.',
  },
  {
    id: 'landmark-004',
    name: 'Garamba National Park',
    type: 'unesco',
    province: 'Haut-Uele',
    coordinates: [29.25, 4.1],
    description: 'Large savannah-protected area in the northeast with long-standing conservation operations.',
    visitorInfo: 'Access is restricted and mission-driven due to remoteness and security conditions.',
    significance: 'Relevant to regional aviation, ranger security networks, and protected-area encroachment checks.',
  },
  {
    id: 'landmark-005',
    name: 'Salonga National Park',
    type: 'unesco',
    province: 'Tshuapa',
    coordinates: [21.83, -2.0],
    description: 'Massive central Congo rainforest reserve with limited transport access.',
    visitorInfo: 'Primarily reached by river and mission aircraft; not a routine business destination.',
    significance: 'Important backdrop for national conservation policy and ESG narratives.',
  },
  {
    id: 'landmark-006',
    name: 'Congo River',
    type: 'river',
    province: 'National',
    coordinates: [15.3, -4.3],
    description: 'The country’s main river artery connecting Kinshasa, Kisangani, and inland logistics chains.',
    visitorInfo: 'River transport is viable but slow; manifests, fuel planning, and safety oversight are essential.',
    significance: 'Critical freight and contingency logistics corridor.',
  },
  {
    id: 'landmark-007',
    name: 'Lake Kivu',
    type: 'lake',
    province: 'South Kivu / North Kivu',
    coordinates: [29.0, -2.0],
    description: 'Great Lake linking Bukavu and Goma with speedboat and cross-border commercial significance.',
    visitorInfo: 'Water transport can save road time but should be weather- and security-cleared.',
    significance: 'Important alternate mobility corridor for eastern DRC operations.',
  },
  {
    id: 'landmark-008',
    name: 'Nyiragongo Volcano',
    type: 'mountain',
    province: 'North Kivu',
    coordinates: [29.249, -1.52],
    description: 'Active stratovolcano north of Goma with a persistent lava lake.',
    visitorInfo: 'Visits require park authority approval; volcanic risk can affect Goma aviation and road access.',
    significance: 'Direct operational risk factor for Goma-based travel and emergency planning.',
  },
  {
    id: 'landmark-009',
    name: 'Rwenzori Range (DRC flank)',
    type: 'mountain',
    province: 'North Kivu',
    coordinates: [29.88, 0.38],
    description: 'High-elevation mountain system on the Uganda frontier.',
    visitorInfo: 'Not a standard mining route but important for regional terrain and weather forecasting.',
    significance: 'Shapes mountain weather, access windows, and border logistics.',
  },
  {
    id: 'landmark-010',
    name: 'Boyoma Falls',
    type: 'landmark',
    province: 'Tshopo',
    coordinates: [25.18, 0.56],
    description: 'Series of cataracts near Kisangani on the upper Congo River.',
    visitorInfo: 'Accessible from Kisangani; useful for low-risk local visitor programs.',
    significance: 'Recognizable Tshopo landmark and civic pride asset.',
  },
  {
    id: 'landmark-011',
    name: 'Mount Kahuzi',
    type: 'mountain',
    province: 'South Kivu',
    coordinates: [28.7, -2.47],
    description: 'Dormant volcano forming part of the Kahuzi-Biega massif.',
    visitorInfo: 'Terrain and weather around the massif can affect Bukavu-region movements.',
    significance: 'Useful terrain reference for South Kivu helicopter and ground planning.',
  },
  {
    id: 'landmark-012',
    name: 'Lake Albert Shoreline',
    type: 'lake',
    province: 'Ituri',
    coordinates: [30.85, 1.82],
    description: 'Eastern frontier lake tying Ituri communities to Ugandan trade routes.',
    visitorInfo: 'Border-sensitive zone; use formal border and customs planning.',
    significance: 'Cross-border supply and evacuation relevance for Ituri operations.',
  },
  {
    id: 'landmark-013',
    name: 'Itombwe Massif',
    type: 'mountain',
    province: 'South Kivu',
    coordinates: [28.55, -3.2],
    description: 'Remote highland massif spanning major gold-bearing structural corridors.',
    visitorInfo: 'Remote and security-sensitive; requires deliberate logistics and community engagement planning.',
    significance: 'Directly relevant to Twangiza, Namoya, and broader belt geology context.',
  },
  {
    id: 'landmark-014',
    name: 'Uele River Basin',
    type: 'river',
    province: 'Haut-Uele',
    coordinates: [27.95, 3.4],
    description: 'Regional river basin supporting settlements across northeastern project corridors.',
    visitorInfo: 'Seasonal water conditions affect road washouts and bridge reliability.',
    significance: 'Helpful for seasonal logistics risk planning in Haut-Uele.',
  },
];

function normalize(value: string) {
  return value.toLowerCase().trim();
}

export function getLandmarksByProvince(province: string) {
  const normalizedProvince = normalize(province);
  return DRC_LANDMARKS.filter((landmark) => normalize(landmark.province).includes(normalizedProvince));
}
