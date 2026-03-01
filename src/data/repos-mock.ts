import type { Repo } from '../lib/types/repos';

export const MOCK_REPOS: Repo[] = [
  {
    id: 'repo-pr-8832',
    name: 'Mongbwalu North Project',
    description: 'Gold exploration project in the Kilo-Moto greenstone belt, Ituri Province',
    polygon: {
      type: 'Polygon',
      coordinates: [[[29.5, 1.8], [29.8, 1.8], [29.8, 2.1], [29.5, 2.1], [29.5, 1.8]]],
    },
    centroid: [29.65, 1.95],
    status: 'active',
    created_at: '2025-06-15T00:00:00Z',
    branches: [
      {
        id: 'main',
        name: 'main',
        artifacts: [
          { id: 'art-01', type: 'document', name: 'CAMI Extract PR-8832', location: [29.55, 1.85], date: '2025-06-15', description: 'Official mining permit extract from CAMI registry' },
          { id: 'art-02', type: 'dataset', name: 'Soil Geochemistry Survey', location: [29.65, 1.95], date: '2025-08-20', description: 'Multi-element soil sampling results (250 samples)' },
          { id: 'art-03', type: 'sample', name: 'Rock Chip Samples Batch 1', location: [29.70, 2.00], date: '2025-09-10', description: '48 rock chip samples from outcrop mapping' },
          { id: 'art-04', type: 'incident', name: 'Road Washout Report', location: [29.60, 1.90], date: '2025-11-05', description: 'Access road damaged during rainy season' },
        ],
      },
      {
        id: 'feature/drill-plan',
        name: 'feature/drill-plan',
        artifacts: [
          { id: 'art-05', type: 'document', name: 'Drill Plan Proposal', location: [29.65, 1.95], date: '2025-10-01', description: 'Proposed 5000m diamond drill program' },
          { id: 'art-06', type: 'dataset', name: 'IP Survey Results', location: [29.70, 1.90], date: '2025-10-15', description: 'Induced Polarization survey data covering 12 line-km' },
        ],
      },
    ],
  },
  {
    id: 'repo-pe-4102',
    name: 'Twangiza Deep Project',
    description: 'Advanced gold exploration in South Kivu Province',
    polygon: {
      type: 'Polygon',
      coordinates: [[[28.6, -3.0], [28.95, -3.0], [28.95, -2.7], [28.6, -2.7], [28.6, -3.0]]],
    },
    centroid: [28.775, -2.85],
    status: 'active',
    created_at: '2025-04-20T00:00:00Z',
    branches: [
      {
        id: 'main',
        name: 'main',
        artifacts: [
          { id: 'art-07', type: 'document', name: 'JV Agreement', location: [28.70, -2.90], date: '2025-04-20', description: 'Joint venture agreement with Banro Corp' },
          { id: 'art-08', type: 'dataset', name: 'Drill Core Assays', location: [28.80, -2.85], date: '2025-07-15', description: '120 drill core assay results from Phase 1' },
          { id: 'art-09', type: 'sample', name: 'Trench Samples', location: [28.85, -2.80], date: '2025-06-01', description: '32 channel samples from trenching program' },
        ],
      },
    ],
  },
  {
    id: 'repo-pe-6230',
    name: 'Kolwezi Copper Belt Project',
    description: 'Copper-cobalt exploration in the Katanga Copperbelt',
    polygon: {
      type: 'Polygon',
      coordinates: [[[25.3, -10.8], [25.8, -10.8], [25.8, -10.4], [25.3, -10.4], [25.3, -10.8]]],
    },
    centroid: [25.55, -10.60],
    status: 'active',
    created_at: '2025-08-01T00:00:00Z',
    branches: [
      {
        id: 'main',
        name: 'main',
        artifacts: [
          { id: 'art-10', type: 'document', name: 'Environmental Impact Assessment', location: [25.40, -10.70], date: '2025-08-01', description: 'Preliminary EIA for copper exploration' },
          { id: 'art-11', type: 'dataset', name: 'Geophysical Survey', location: [25.55, -10.60], date: '2025-09-15', description: 'Airborne magnetic and radiometric survey' },
        ],
      },
    ],
  },
];

export function getRepoById(id: string): Repo | undefined {
  return MOCK_REPOS.find((r) => r.id === id);
}
