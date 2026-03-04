export interface ProjectHotelDistance {
  projectId: string;
  distanceKm: number;
}

export interface DRCHotel {
  id: string;
  name: string;
  city: string;
  province: string;
  type: string;
  stars: number;
  priceRange: string;
  amenities: string[];
  securityRating: number;
  distanceToProjects: ProjectHotelDistance[];
  coordinates: [number, number];
  phone: string;
  notes: string;
}

export const DRC_HOTELS: DRCHotel[] = [
  {
    id: 'hotel-kin-001',
    name: 'Pullman Kinshasa Grand Hotel',
    city: 'Kinshasa',
    province: 'Kinshasa',
    type: 'business hotel',
    stars: 5,
    priceRange: '$220-340/night',
    amenities: ['airport transfer', 'secure parking', 'meeting rooms', 'generator backup', 'wifi'],
    securityRating: 5,
    distanceToProjects: [{ projectId: 'drc_mccr_011', distanceKm: 620 }],
    coordinates: [15.274, -4.312],
    phone: '+243 81 000 1101',
    notes: 'Best option for ministry meetings and secure executive staging before provincial travel.',
  },
  {
    id: 'hotel-kin-002',
    name: 'Fleuve Congo Hotel',
    city: 'Kinshasa',
    province: 'Kinshasa',
    type: 'executive hotel',
    stars: 5,
    priceRange: '$190-320/night',
    amenities: ['secure compound', 'conference suites', 'gym', 'pool', 'wifi'],
    securityRating: 5,
    distanceToProjects: [{ projectId: 'drc_mccr_011', distanceKm: 618 }],
    coordinates: [15.302, -4.322],
    phone: '+243 81 000 1102',
    notes: 'Strong diplomatic and investor presence; reliable for high-level meetings.',
  },
  {
    id: 'hotel-lub-001',
    name: 'Pullman Lubumbashi Grand Karavia',
    city: 'Lubumbashi',
    province: 'Haut-Katanga',
    type: 'business hotel',
    stars: 5,
    priceRange: '$180-280/night',
    amenities: ['airport transfer', 'meeting rooms', 'secure parking', 'pool', 'wifi'],
    securityRating: 5,
    distanceToProjects: [{ projectId: 'drc_mccr_011', distanceKm: 420 }],
    coordinates: [27.478, -11.666],
    phone: '+243 81 000 1201',
    notes: 'Southern DRC logistics hub for charters, fuel procurement, and technical suppliers.',
  },
  {
    id: 'hotel-lub-002',
    name: 'Hotel Lubumbashi',
    city: 'Lubumbashi',
    province: 'Haut-Katanga',
    type: 'business hotel',
    stars: 4,
    priceRange: '$95-150/night',
    amenities: ['secure parking', 'restaurant', 'generator backup', 'wifi'],
    securityRating: 4,
    distanceToProjects: [{ projectId: 'drc_mccr_011', distanceKm: 415 }],
    coordinates: [27.472, -11.658],
    phone: '+243 81 000 1202',
    notes: 'Reliable value option for technical teams rotating through southern supply lines.',
  },
  {
    id: 'hotel-buk-001',
    name: 'Orchids Safari Club',
    city: 'Bukavu',
    province: 'South Kivu',
    type: 'lakeside hotel',
    stars: 4,
    priceRange: '$110-170/night',
    amenities: ['secure compound', 'restaurant', 'lake access', 'meeting rooms', 'wifi'],
    securityRating: 4,
    distanceToProjects: [
      { projectId: 'drc_twangiza_002', distanceKm: 85 },
      { projectId: 'drc_misisi_004', distanceKm: 155 },
      { projectId: 'drc_kamituga_009', distanceKm: 190 },
    ],
    coordinates: [28.862, -2.499],
    phone: '+243 81 000 1301',
    notes: 'Preferred Bukavu base for site visits into Mwenga and Fizi corridors.',
  },
  {
    id: 'hotel-buk-002',
    name: 'Hotel Residence Bukavu',
    city: 'Bukavu',
    province: 'South Kivu',
    type: 'city hotel',
    stars: 4,
    priceRange: '$80-140/night',
    amenities: ['secure gate', 'generator backup', 'restaurant', 'wifi'],
    securityRating: 4,
    distanceToProjects: [
      { projectId: 'drc_twangiza_002', distanceKm: 83 },
      { projectId: 'drc_kamituga_009', distanceKm: 188 },
    ],
    coordinates: [28.861, -2.508],
    phone: '+243 81 000 1302',
    notes: 'Efficient base for provincial meetings, local lawyers, and logistics staging.',
  },
  {
    id: 'hotel-buk-003',
    name: 'La Roche Hotel',
    city: 'Bukavu',
    province: 'South Kivu',
    type: 'boutique hotel',
    stars: 3,
    priceRange: '$60-110/night',
    amenities: ['secure parking', 'restaurant', 'wifi'],
    securityRating: 3,
    distanceToProjects: [
      { projectId: 'drc_twangiza_002', distanceKm: 88 },
      { projectId: 'drc_misisi_004', distanceKm: 158 },
    ],
    coordinates: [28.855, -2.515],
    phone: '+243 81 000 1303',
    notes: 'Smaller footprint, suitable for short due-diligence stops.',
  },
  {
    id: 'hotel-bun-001',
    name: 'Hotel Ituri',
    city: 'Bunia',
    province: 'Ituri',
    type: 'business hotel',
    stars: 3,
    priceRange: '$55-95/night',
    amenities: ['secure parking', 'generator backup', 'restaurant', 'wifi'],
    securityRating: 4,
    distanceToProjects: [
      { projectId: 'drc_adumbi_005', distanceKm: 180 },
      { projectId: 'drc_mongbwalu_010', distanceKm: 75 },
      { projectId: 'drc_kimia_okapi_012', distanceKm: 120 },
    ],
    coordinates: [30.25, 1.565],
    phone: '+243 81 000 1401',
    notes: 'Most practical Bunia operating base when coordinating escorts and government meetings.',
  },
  {
    id: 'hotel-bun-002',
    name: 'CIT Hotel Bunia',
    city: 'Bunia',
    province: 'Ituri',
    type: 'city hotel',
    stars: 3,
    priceRange: '$45-80/night',
    amenities: ['secure gate', 'generator backup', 'meeting room'],
    securityRating: 4,
    distanceToProjects: [
      { projectId: 'drc_adumbi_005', distanceKm: 178 },
      { projectId: 'drc_mongbwalu_010', distanceKm: 74 },
    ],
    coordinates: [30.247, 1.567],
    phone: '+243 81 000 1402',
    notes: 'Used by NGOs and logistics contractors; modest but dependable.',
  },
  {
    id: 'hotel-gom-001',
    name: 'Hotel Ihusi',
    city: 'Goma',
    province: 'North Kivu',
    type: 'business hotel',
    stars: 4,
    priceRange: '$100-170/night',
    amenities: ['secure compound', 'meeting rooms', 'restaurant', 'wifi'],
    securityRating: 4,
    distanceToProjects: [{ projectId: 'drc_kimia_okapi_012', distanceKm: 265 }],
    coordinates: [29.221, -1.679],
    phone: '+243 81 000 1501',
    notes: 'Best for volatile eastern corridor coordination and Rwanda-linked evacuation plans.',
  },
  {
    id: 'hotel-gom-002',
    name: 'Hotel Karibu',
    city: 'Goma',
    province: 'North Kivu',
    type: 'executive hotel',
    stars: 4,
    priceRange: '$95-160/night',
    amenities: ['secure parking', 'conference room', 'generator backup', 'wifi'],
    securityRating: 4,
    distanceToProjects: [{ projectId: 'drc_kimia_okapi_012', distanceKm: 268 }],
    coordinates: [29.232, -1.664],
    phone: '+243 81 000 1502',
    notes: 'Practical for overnight stays tied to UNDSS or MONUSCO briefings.',
  },
  {
    id: 'hotel-mbm-001',
    name: 'Hotel Gloria Mbuji-Mayi',
    city: 'Mbuji-Mayi',
    province: 'Kasai-Oriental',
    type: 'city hotel',
    stars: 3,
    priceRange: '$50-85/night',
    amenities: ['secure parking', 'restaurant', 'generator backup'],
    securityRating: 3,
    distanceToProjects: [{ projectId: 'drc_mccr_011', distanceKm: 290 }],
    coordinates: [23.593, -6.136],
    phone: '+243 81 000 1601',
    notes: 'Useful inland stop for charter positioning and light procurement.',
  },
  {
    id: 'hotel-mbm-002',
    name: 'Auberge du Kasaï',
    city: 'Mbuji-Mayi',
    province: 'Kasai-Oriental',
    type: 'guesthouse',
    stars: 2,
    priceRange: '$25-45/night',
    amenities: ['generator backup', 'secured courtyard'],
    securityRating: 3,
    distanceToProjects: [{ projectId: 'drc_mccr_011', distanceKm: 292 }],
    coordinates: [23.585, -6.128],
    phone: '+243 81 000 1602',
    notes: 'Low-friction budget option for field crews and drivers.',
  },
  {
    id: 'hotel-kis-001',
    name: 'Hotel Palm Beach',
    city: 'Kisangani',
    province: 'Tshopo',
    type: 'business hotel',
    stars: 3,
    priceRange: '$45-75/night',
    amenities: ['secure parking', 'restaurant', 'wifi', 'generator backup'],
    securityRating: 3,
    distanceToProjects: [
      { projectId: 'drc_adumbi_005', distanceKm: 355 },
      { projectId: 'drc_kibali_001', distanceKm: 480 },
    ],
    coordinates: [25.204, 0.517],
    phone: '+243 81 000 1701',
    notes: 'Strong river and cargo links; often used as inland logistics checkpoint.',
  },
  {
    id: 'hotel-kis-002',
    name: 'Hotel Kisangani',
    city: 'Kisangani',
    province: 'Tshopo',
    type: 'city hotel',
    stars: 3,
    priceRange: '$35-60/night',
    amenities: ['restaurant', 'generator backup', 'wifi'],
    securityRating: 3,
    distanceToProjects: [
      { projectId: 'drc_adumbi_005', distanceKm: 350 },
      { projectId: 'drc_kibali_001', distanceKm: 476 },
    ],
    coordinates: [25.197, 0.51],
    phone: '+243 81 000 1702',
    notes: 'Useful secondary option when charter schedules force overnight stays.',
  },
  {
    id: 'hotel-dur-001',
    name: 'Kibali Mine Guest Lodge',
    city: 'Durba',
    province: 'Haut-Uele',
    type: 'mine lodge',
    stars: 4,
    priceRange: '$150-220/night',
    amenities: ['secure compound', 'airstrip transfer', 'clinic access', 'power redundancy'],
    securityRating: 5,
    distanceToProjects: [
      { projectId: 'drc_kibali_001', distanceKm: 12 },
      { projectId: 'drc_giro_008', distanceKm: 110 },
    ],
    coordinates: [29.57, 3.12],
    phone: '+243 81 000 1801',
    notes: 'Restricted-access but best operating environment for Kibali corridor work.',
  },
  {
    id: 'hotel-dur-002',
    name: 'Hotel Durba Centre',
    city: 'Durba',
    province: 'Haut-Uele',
    type: 'city hotel',
    stars: 2,
    priceRange: '$18-35/night',
    amenities: ['generator backup', 'secured courtyard'],
    securityRating: 3,
    distanceToProjects: [
      { projectId: 'drc_kibali_001', distanceKm: 18 },
      { projectId: 'drc_giro_008', distanceKm: 105 },
    ],
    coordinates: [29.565, 3.108],
    phone: '+243 81 000 1802',
    notes: 'Basic but serviceable for contractors and interpreters.',
  },
  {
    id: 'hotel-wat-001',
    name: 'Watsa Mission Guesthouse',
    city: 'Watsa',
    province: 'Haut-Uele',
    type: 'mission guesthouse',
    stars: 2,
    priceRange: '$15-28/night',
    amenities: ['compound security', 'generator backup'],
    securityRating: 3,
    distanceToProjects: [
      { projectId: 'drc_kibali_001', distanceKm: 35 },
      { projectId: 'drc_giro_008', distanceKm: 95 },
    ],
    coordinates: [29.54, 3.04],
    phone: '+243 81 000 1803',
    notes: 'Often used for church-linked access, local guides, and community engagement.',
  },
];

function normalize(value: string) {
  return value.toLowerCase().trim();
}

export function getHotelsByProvince(province: string) {
  const normalizedProvince = normalize(province);
  return DRC_HOTELS.filter((hotel) => normalize(hotel.province).includes(normalizedProvince));
}

export function getHotelsByCity(city: string) {
  const normalizedCity = normalize(city);
  return DRC_HOTELS.filter((hotel) => normalize(hotel.city) === normalizedCity);
}

export function getHotelsForProject(projectId: string, province?: string, city?: string) {
  const directlyLinked = DRC_HOTELS.filter((hotel) =>
    hotel.distanceToProjects.some((distance) => distance.projectId === projectId)
  );

  if (directlyLinked.length > 0) {
    return directlyLinked.sort((a, b) => {
      const aDistance = a.distanceToProjects.find((distance) => distance.projectId === projectId)?.distanceKm || 9999;
      const bDistance = b.distanceToProjects.find((distance) => distance.projectId === projectId)?.distanceKm || 9999;
      return aDistance - bDistance;
    });
  }

  if (city) {
    const cityMatches = getHotelsByCity(city);
    if (cityMatches.length > 0) return cityMatches;
  }

  return province ? getHotelsByProvince(province) : [];
}
