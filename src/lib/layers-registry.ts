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
        id: 'occurrences-glow',
        type: 'circle',
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            4, 10,
            8, 18,
            12, 28,
          ],
          'circle-color': [
            'match', ['get', 'commodity'],
            'Gold', '#FFD700',
            'Copper', '#B87333',
            'Cobalt', '#0047AB',
            '#D4AF37',
          ],
          'circle-opacity': 0.12,
          'circle-blur': 1,
        },
      },
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
        id: 'security-events-glow',
        type: 'circle',
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            4, 14,
            8, 24,
          ],
          'circle-color': [
            'match', ['get', 'severity'],
            'high', '#FF4444',
            'medium', '#FF8800',
            'low', '#FFCC00',
            '#FF6666',
          ],
          'circle-opacity': 0.15,
          'circle-blur': 1,
        },
      },
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
        id: 'infrastructure-lines-glow',
        type: 'line',
        paint: {
          'line-color': [
            'match', ['get', 'type'],
            'road', '#888888',
            'river', '#4488FF',
            'railway', '#CC8800',
            '#666666',
          ],
          'line-width': 6,
          'line-opacity': 0.1,
          'line-blur': 4,
        },
        filter: ['==', ['geometry-type'], 'LineString'],
      },
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
          'line-dasharray': [2, 1],
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
  {
    id: LAYER_IDS.DRC_PROJECTS,
    label: 'Gold Projects',
    description: 'Major DRC gold mining projects from intelligence pack',
    legendColor: '#FFD700',
    icon: 'Pickaxe',
    visible: true,
    mapLayers: [
      {
        id: 'drc-projects-glow',
        type: 'circle',
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            4, 12,
            8, 20,
            12, 30,
          ],
          'circle-color': '#FFD700',
          'circle-opacity': 0.15,
          'circle-blur': 1,
        },
      },
      {
        id: 'drc-projects-circle',
        type: 'circle',
        paint: {
          'circle-radius': [
            'interpolate', ['linear'], ['zoom'],
            4, 6,
            8, 10,
            12, 16,
          ],
          'circle-color': [
            'match', ['get', 'status'],
            'producing', '#00FF88',
            'producing_disrupted', '#FF8800',
            'care_and_maintenance', '#FF4444',
            'development', '#4488FF',
            'advanced_exploration', '#A78BFA',
            'early_exploration', '#8B7355',
            'artisanal_alluvial', '#FFD700',
            '#D4AF37',
          ],
          'circle-stroke-color': '#FFFFFF',
          'circle-stroke-width': 2,
          'circle-opacity': 0.9,
        },
      },
      {
        id: 'drc-projects-label',
        type: 'symbol',
        layout: {
          'text-field': ['get', 'name'],
          'text-size': [
            'interpolate', ['linear'], ['zoom'],
            4, 0,
            6, 10,
            10, 13,
          ],
          'text-offset': [0, 1.8],
          'text-anchor': 'top',
          'text-font': ['Open Sans Bold'],
          'text-max-width': 12,
        },
        paint: {
          'text-color': '#FFFFFF',
          'text-halo-color': '#000000',
          'text-halo-width': 1.5,
        },
      },
    ],
  },
  {
    id: LAYER_IDS.MINERAL_HEATMAP,
    label: 'Gold Concentration',
    description: 'Mineral concentration intensity heatmap — gold potential zones',
    legendColor: '#FF6B00',
    icon: 'Flame',
    visible: false,
    mapLayers: [
      {
        id: 'mineral-heatmap-heat',
        type: 'heatmap',
        paint: {
          'heatmap-weight': ['get', 'concentration'],
          'heatmap-intensity': [
            'interpolate', ['linear'], ['zoom'],
            0, 1,
            9, 3,
          ],
          'heatmap-color': [
            'interpolate', ['linear'], ['heatmap-density'],
            0, 'rgba(0,0,0,0)',
            0.15, 'rgba(139,69,19,0.3)',
            0.3, 'rgba(255,140,0,0.5)',
            0.5, 'rgba(255,180,0,0.6)',
            0.7, 'rgba(255,215,0,0.7)',
            0.85, 'rgba(255,240,100,0.8)',
            1.0, 'rgba(255,255,200,0.9)',
          ],
          'heatmap-radius': [
            'interpolate', ['linear'], ['zoom'],
            4, 25,
            8, 45,
            12, 70,
          ],
          'heatmap-opacity': [
            'interpolate', ['linear'], ['zoom'],
            7, 0.8,
            12, 0.4,
          ],
        },
      },
    ],
  },
];
