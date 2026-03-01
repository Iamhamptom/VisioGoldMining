import type { FeatureCollection } from 'geojson';
import type { LayerMetadata } from '../types/layers';

export interface DataAdapter {
  getFeatures(layerId: string, bbox?: [number, number, number, number]): Promise<FeatureCollection>;
  getMetadata(layerId: string): Promise<LayerMetadata>;
}

// MVP: FixtureAdapter imports GeoJSON files directly via Vite
// Future: APIConnectorAdapter, WMSAdapter, PostGISAdapter, CAMIAdapter
