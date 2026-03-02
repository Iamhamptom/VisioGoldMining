import type { Geometry, FeatureCollection } from 'geojson';

export interface LayerInfo {
  id: string;
  label: string;
  description: string;
  geometryType: 'Point' | 'LineString' | 'Polygon' | 'Mixed';
  legendColor: string;
  icon: string;
}

export interface LayerMetadata extends LayerInfo {
  featureCount: number;
  lastUpdated: string;
  source: string;
  bounds: [number, number, number, number];
}

export interface SelectedFeature {
  layerId: string;
  properties: Record<string, unknown>;
  geometry: Geometry;
}

export interface LayerState {
  id: string;
  visible: boolean;
  loading: boolean;
  error: string | null;
  data: FeatureCollection | null;
}

export interface MapLayerSpec {
  id: string;
  type: 'fill' | 'line' | 'circle' | 'symbol' | 'heatmap' | 'fill-extrusion' | 'sky';
  paint: Record<string, unknown>;
  layout?: Record<string, unknown>;
  filter?: unknown[];
}

export interface LayerDefinition {
  id: string;
  label: string;
  description: string;
  legendColor: string;
  icon: string;
  visible: boolean;
  mapLayers: MapLayerSpec[];
}
