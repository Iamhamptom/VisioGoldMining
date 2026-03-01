// DRC map configuration - coordinates, presets, layer IDs

export const INITIAL_GLOBE_CENTER: [number, number] = [0, 20];
export const INITIAL_GLOBE_ZOOM = 1.5;

export const DRC_CENTER: [number, number] = [23.66, -2.88];
export const DRC_ZOOM = 5;

export const DRC_BBOX: [number, number, number, number] = [12.20, -13.46, 31.28, 5.39];

export const FLY_TO_PRESETS = [
  { label: 'All DRC', center: [23.66, -2.88] as [number, number], zoom: 5 },
  { label: 'Haut-Katanga', center: [27.8, -11.0] as [number, number], zoom: 7 },
  { label: 'North Kivu', center: [29.2, -1.5] as [number, number], zoom: 7 },
  { label: 'South Kivu', center: [28.8, -3.0] as [number, number], zoom: 7 },
  { label: 'Ituri', center: [30.0, 1.5] as [number, number], zoom: 8 },
  { label: 'Maniema', center: [26.0, -3.5] as [number, number], zoom: 7 },
  { label: 'Haut-Uele', center: [28.5, 3.5] as [number, number], zoom: 7 },
] as const;

export const LAYER_IDS = {
  DRC_BOUNDARY: 'drc-boundary',
  TENEMENTS: 'tenements',
  GEOLOGY: 'geology',
  OCCURRENCES: 'occurrences',
  SECURITY_EVENTS: 'security-events',
  INFRASTRUCTURE: 'infrastructure',
} as const;

export const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
