import type { Geometry } from 'geojson';

export interface DimensionScore {
  value: number;
  label: string;
  evidence: Evidence[];
}

export interface Evidence {
  layer_id: string;
  description: string;
}

export interface OpportunityScore {
  prospectivity: DimensionScore;
  access: DimensionScore;
  security: DimensionScore;
  legal_complexity: DimensionScore;
  data_completeness: DimensionScore;
}

export interface Opportunity {
  id: string;
  title: string;
  permit_id: string;
  province: string;
  geom: Geometry;
  centroid: [number, number];
  area_km2: number;
  commodity: string;
  scores: OpportunityScore;
  composite_score: number;
  why_explained: string;
  recommended_next_actions: string[];
}
