import { useState, useCallback, useRef, useEffect } from 'react';
import { LAYER_DEFINITIONS } from '../lib/layers-registry';
import type { LayerState, MapLayerSpec } from '../lib/types/layers';
import { useMapContext } from './useMap';
import type { LayerSpecification } from 'maplibre-gl';

// Lazy import for fixture data
const fixtureImports: Record<string, () => Promise<{ default: GeoJSON.FeatureCollection }>> = {
  'tenements': () => import('../data/tenements.geojson'),
  'geology': () => import('../data/geology.geojson'),
  'occurrences': () => import('../data/occurrences.geojson'),
  'security-events': () => import('../data/security-events.geojson'),
  'infrastructure': () => import('../data/infrastructure.geojson'),
  'mineral-heatmap': () => import('../data/mineral-heatmap.geojson'),
  // Note: drc-projects is handled by React Markers in GlobeMap, not GeoJSON layer
};

function addLayerToMap(map: maplibregl.Map, layerId: string, data: GeoJSON.FeatureCollection, mapLayers: MapLayerSpec[]) {
  if (map.getSource(layerId)) return;
  map.addSource(layerId, { type: 'geojson', data });
  mapLayers.forEach((ml: MapLayerSpec) => {
    const layerSpec = {
      id: ml.id,
      source: layerId,
      type: ml.type,
      paint: ml.paint,
      ...(ml.layout ? { layout: ml.layout } : {}),
      ...(ml.filter ? { filter: ml.filter } : {}),
    } as LayerSpecification;
    map.addLayer(layerSpec);
  });
}

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

  // Auto-load layers that are visible by default when the map becomes available
  const initialLoadDone = useRef(false);
  useEffect(() => {
    if (!map || initialLoadDone.current) return;
    initialLoadDone.current = true;

    LAYER_DEFINITIONS.forEach(async (def) => {
      if (!def.visible) return;
      const importer = fixtureImports[def.id];
      // Skip layers without fixture data (drc-projects uses React Markers)
      if (!importer) return;

      setLayerStates((prev) => {
        const next = new Map(prev);
        next.set(def.id, { ...prev.get(def.id)!, loading: true });
        return next;
      });

      try {
        const module = await importer();
        const data = module.default;

        setLayerStates((prev) => {
          const next = new Map(prev);
          next.set(def.id, { ...prev.get(def.id)!, data, loading: false, visible: true });
          return next;
        });

        addLayerToMap(map, def.id, data, def.mapLayers);
      } catch (err) {
        setLayerStates((prev) => {
          const next = new Map(prev);
          next.set(def.id, { ...prev.get(def.id)!, loading: false, error: String(err) });
          return next;
        });
      }
    });
  }, [map]);

  const toggleLayer = useCallback(async (layerId: string) => {
    const current = layerStates.get(layerId);
    if (!current || !map) return;

    const newVisible = !current.visible;

    setLayerStates((prev) => {
      const next = new Map(prev);
      next.set(layerId, { ...current, visible: newVisible });
      return next;
    });

    // drc-projects layer is handled by React Markers, just toggle state
    if (layerId === 'drc-projects') return;

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

        addLayerToMap(map, layerId, data, def.mapLayers);
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
