import { LAYER_IDS } from './map-config';
import type { LayerDefinition } from './types/layers';

export const LAYER_DEFINITIONS: LayerDefinition[] = [
  {
    id: LAYER_IDS.TENEMENTS,
    label: 'Tenements',
    description: 'Mining cadastre permits and concessions',
    legendColor: '#D4AF37',
    icon: 'Map',
    visible: true,
    mapLayers: [
      {
        id: 'tenements-fill',
        type: 'fill',
        paint: {
          'fill-color': [
            'match', ['get', 'status'],
            'granted', '#D4AF37',
            'pending', 'rgba(212,175,55,0.4)',
            'expired', 'rgba(255,68,68,0.3)',
            'rgba(212,175,55,0.2)',
          ],
          'fill-opacity': 0.3,
        },
      },
      {
        id: 'tenements-outline',
        type: 'line',
        paint: {
          'line-color': '#D4AF37',
          'line-width': 1.5,
        },
      },
    ],
  },
  {
    id: LAYER_IDS.GEOLOGY,
    label: 'Geology',
    description: 'Lithological units and geological formations',
    legendColor: '#8B7355',
    icon: 'Mountain',
    visible: false,
    mapLayers: [
      {
        id: 'geology-fill',
        type: 'fill',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.25,
        },
      },
      {
        id: 'geology-outline',
        type: 'line',
        paint: {
          'line-color': '#8B7355',
          'line-width': 0.5,
          'line-dasharray': [2, 2],
        },
      },
    ],
  },
  {
    id: LAYER_IDS.OCCURRENCES,
    label: 'Occurrences',
    description: 'Known mineral occurrences and deposits',
    legendColor: '#FFD700',
    icon: 'Gem',
    visible: false,
    mapLayers: [
      {
        id: 'occurrences-circle',
        type: 'circle',
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            4, 3,
            8, 6,
            12, 10,
          ],
          'circle-color': [
            'match', ['get', 'commodity'],
            'Gold', '#FFD700',
            'Copper', '#B87333',
            'Cobalt', '#0047AB',
            'Tin', '#C0C0C0',
            'Coltan', '#8B4513',
            '#D4AF37',
          ],
          'circle-stroke-color': '#FFFFFF',
          'circle-stroke-width': 1,
          'circle-opacity': 0.85,
        },
      },
    ],
  },
  {
    id: LAYER_IDS.SECURITY_EVENTS,
    label: 'Security Events',
    description: 'Conflict and security incidents',
    legendColor: '#FF4444',
    icon: 'ShieldAlert',
    visible: false,
    mapLayers: [
      {
        id: 'security-events-circle',
        type: 'circle',
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            4, 4,
            8, 8,
          ],
          'circle-color': [
            'match', ['get', 'severity'],
            'high', '#FF4444',
            'medium', '#FF8800',
            'low', '#FFCC00',
            '#FF6666',
          ],
          'circle-opacity': 0.6,
          'circle-stroke-color': '#FF6666',
          'circle-stroke-width': 1,
        },
      },
    ],
  },
  {
    id: LAYER_IDS.INFRASTRUCTURE,
    label: 'Infrastructure',
    description: 'Roads, airports, rivers, and key infrastructure',
    legendColor: '#4488FF',
    icon: 'Route',
    visible: false,
    mapLayers: [
      {
        id: 'infrastructure-lines',
        type: 'line',
        paint: {
          'line-color': [
            'match', ['get', 'type'],
            'road', '#888888',
            'river', '#4488FF',
            'railway', '#CC8800',
            '#666666',
          ],
          'line-width': [
            'match', ['get', 'type'],
            'road', 2,
            'river', 1.5,
            'railway', 1,
            1,
          ],
        },
        filter: ['==', ['geometry-type'], 'LineString'],
      },
      {
        id: 'infrastructure-points',
        type: 'circle',
        paint: {
          'circle-radius': 5,
          'circle-color': '#4488FF',
          'circle-stroke-color': '#FFFFFF',
          'circle-stroke-width': 1,
        },
        filter: ['==', ['geometry-type'], 'Point'],
      },
    ],
  },
];
