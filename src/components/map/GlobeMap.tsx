import { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useMapContext } from '../../hooks/useMap';
import { useSelection } from '../../hooks/useFeatureSelection';
import {
  MAP_STYLE,
  INITIAL_GLOBE_CENTER,
  INITIAL_GLOBE_ZOOM,
  DRC_CENTER,
  DRC_ZOOM,
  LAYER_IDS,
  TERRAIN_SOURCE,
  TERRAIN_DEFAULTS,
} from '../../lib/map-config';
import drcBoundary from '../../data/drc-boundary.geojson';

export default function GlobeMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const { setMap } = useMapContext();
  const { setSelectedFeature } = useSelection();

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: INITIAL_GLOBE_CENTER,
      zoom: INITIAL_GLOBE_ZOOM,
      maxPitch: 85,
      attributionControl: false,
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-left');

    map.on('style.load', () => {
      map.setProjection({ type: 'globe' });
    });

    map.on('load', () => {
      // Add DRC boundary
      map.addSource(LAYER_IDS.DRC_BOUNDARY, {
        type: 'geojson',
        data: drcBoundary as GeoJSON.FeatureCollection,
      });

      map.addLayer({
        id: `${LAYER_IDS.DRC_BOUNDARY}-fill`,
        source: LAYER_IDS.DRC_BOUNDARY,
        type: 'fill',
        paint: {
          'fill-color': '#D4AF37',
          'fill-opacity': 0.08,
        },
      });

      map.addLayer({
        id: `${LAYER_IDS.DRC_BOUNDARY}-outline`,
        source: LAYER_IDS.DRC_BOUNDARY,
        type: 'line',
        paint: {
          'line-color': '#D4AF37',
          'line-width': 2,
          'line-opacity': 0.7,
        },
      });

      // Add 3D terrain source
      map.addSource('terrain-dem', {
        type: 'raster-dem',
        tiles: [TERRAIN_SOURCE.url],
        tileSize: TERRAIN_SOURCE.tileSize,
        maxzoom: TERRAIN_SOURCE.maxzoom,
      });

      // Enable 3D terrain by default
      map.setTerrain({
        source: 'terrain-dem',
        exaggeration: TERRAIN_DEFAULTS.exaggeration,
      });

      // Fly to DRC after globe renders
      setTimeout(() => {
        map.flyTo({
          center: DRC_CENTER,
          zoom: DRC_ZOOM,
          pitch: 45,
          speed: 0.8,
          essential: true,
        });
      }, 1500);

      setMap(map);
    });

    // Feature click handler - queries all interactive layers
    map.on('click', (e) => {
      const interactiveLayerIds = [
        'tenements-fill', 'tenements-outline',
        'geology-fill',
        'occurrences-circle',
        'security-events-circle',
        'infrastructure-lines', 'infrastructure-points',
        'drc-projects-circle', 'drc-projects-glow',
      ];

      const existingLayers = interactiveLayerIds.filter(id => {
        try { return !!map.getLayer(id); } catch { return false; }
      });

      if (existingLayers.length === 0) return;

      const features = map.queryRenderedFeatures(e.point, { layers: existingLayers });
      if (features.length > 0) {
        const feature = features[0];
        const layerBaseId = feature.layer.id.replace(/-fill$|-outline$|-circle$|-lines$|-points$|-glow$|-label$/, '');
        setSelectedFeature({
          layerId: layerBaseId,
          properties: feature.properties || {},
          geometry: feature.geometry,
        });
      }
    });

    // Cursor change on hover
    map.on('mousemove', (e) => {
      const interactiveLayerIds = [
        'tenements-fill', 'geology-fill', 'occurrences-circle',
        'security-events-circle', 'infrastructure-lines', 'infrastructure-points',
        'drc-projects-circle',
      ];

      const existingLayers = interactiveLayerIds.filter(id => {
        try { return !!map.getLayer(id); } catch { return false; }
      });

      if (existingLayers.length === 0) return;

      const features = map.queryRenderedFeatures(e.point, { layers: existingLayers });
      map.getCanvas().style.cursor = features.length > 0 ? 'pointer' : '';
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0 w-full h-full" />;
}
