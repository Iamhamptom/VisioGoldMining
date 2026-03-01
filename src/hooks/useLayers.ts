import { useState, useCallback } from 'react';
import { LAYER_DEFINITIONS } from '../lib/layers-registry';
import type { LayerState } from '../lib/types/layers';
import { useMapContext } from './useMap';

// Lazy import for fixture data
const fixtureImports: Record<string, () => Promise<{ default: GeoJSON.FeatureCollection }>> = {
  'tenements': () => import('../data/tenements.geojson'),
  'geology': () => import('../data/geology.geojson'),
  'occurrences': () => import('../data/occurrences.geojson'),
  'security-events': () => import('../data/security-events.geojson'),
  'infrastructure': () => import('../data/infrastructure.geojson'),
};

export function useLayers() {
  const { map } = useMapContext();
  const [layerStates, setLayerStates] = useState<Map<string, LayerState>>(
    () => new Map(LAYER_DEFINITIONS.map((l) => [l.id, {
      id: l.id,
      visible: l.visible,
      loading: false,
      error: null,
      data: null,
    }]))
  );

  const toggleLayer = useCallback(async (layerId: string) => {
    const current = layerStates.get(layerId);
    if (!current || !map) return;

    const newVisible = !current.visible;

    setLayerStates((prev) => {
      const next = new Map(prev);
      next.set(layerId, { ...current, visible: newVisible });
      return next;
    });

    // Load data if first time showing and no data cached
    if (newVisible && !current.data) {
      const def = LAYER_DEFINITIONS.find((l) => l.id === layerId);
      const importer = fixtureImports[layerId];
      if (!def || !importer) return;

      setLayerStates((prev) => {
        const next = new Map(prev);
        next.set(layerId, { ...prev.get(layerId)!, loading: true });
        return next;
      });

      try {
        const module = await importer();
        const data = module.default;

        setLayerStates((prev) => {
          const next = new Map(prev);
          next.set(layerId, { ...prev.get(layerId)!, data, loading: false, visible: true });
          return next;
        });

        // Add source + layers to map
        if (!map.getSource(layerId)) {
          map.addSource(layerId, { type: 'geojson', data });
          def.mapLayers.forEach((ml) => {
            map.addLayer({
              id: ml.id,
              source: layerId,
              type: ml.type as any,
              paint: ml.paint as any,
              layout: ml.layout as any,
              ...(ml.filter ? { filter: ml.filter as any } : {}),
            });
          });
        }
      } catch (err) {
        setLayerStates((prev) => {
          const next = new Map(prev);
          next.set(layerId, {
            ...prev.get(layerId)!,
            loading: false,
            error: String(err),
          });
          return next;
        });
      }
    } else if (map) {
      // Toggle visibility of existing layers
      const def = LAYER_DEFINITIONS.find((l) => l.id === layerId);
      def?.mapLayers.forEach((ml) => {
        try {
          if (map.getLayer(ml.id)) {
            map.setLayoutProperty(ml.id, 'visibility', newVisible ? 'visible' : 'none');
          }
        } catch { /* layer may not exist yet */ }
      });
    }
  }, [layerStates, map]);

  return { layerStates, toggleLayer, definitions: LAYER_DEFINITIONS };
}
