'use client';

import React, { useCallback, useRef, useState } from 'react';
import Map, { AttributionControl } from 'react-map-gl/maplibre';
import type { MapRef, ViewStateChangeEvent } from 'react-map-gl/maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MAP_STYLE, TERRAIN_SOURCE, TERRAIN_DEFAULTS } from '@/lib/map-config';

export interface BaseMapProps {
  initialCenter?: [number, number];
  initialZoom?: number;
  initialPitch?: number;
  mapStyle?: string;
  enableTerrain?: boolean;
  enableGlobe?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  onLoad?: (map: maplibregl.Map) => void;
}

export default function BaseMap({
  initialCenter = [23.66, -2.88],
  initialZoom = 3,
  initialPitch = 0,
  mapStyle = MAP_STYLE,
  enableTerrain = false,
  enableGlobe = false,
  className,
  style = { width: '100%', height: '100%' },
  children,
  onLoad,
}: BaseMapProps) {
  const mapRef = useRef<MapRef>(null);
  const [viewState, setViewState] = useState({
    longitude: initialCenter[0],
    latitude: initialCenter[1],
    zoom: initialZoom,
    pitch: initialPitch,
    bearing: 0,
  });

  const onMove = useCallback((evt: ViewStateChangeEvent) => {
    setViewState(evt.viewState);
  }, []);

  const handleLoad = useCallback(() => {
    const map = mapRef.current?.getMap();
    if (!map) return;

    if (enableGlobe) {
      try { map.setProjection({ type: 'globe' }); } catch {}
    }

    if (enableTerrain) {
      try {
        if (!map.getSource('terrain-dem')) {
          map.addSource('terrain-dem', {
            type: 'raster-dem',
            tiles: [TERRAIN_SOURCE.url],
            tileSize: TERRAIN_SOURCE.tileSize,
            maxzoom: TERRAIN_SOURCE.maxzoom,
          });
        }
        map.setTerrain({ source: 'terrain-dem', exaggeration: TERRAIN_DEFAULTS.exaggeration });
      } catch {}
    }

    onLoad?.(map);
  }, [enableGlobe, enableTerrain, onLoad]);

  return (
    <Map
      ref={mapRef}
      {...viewState}
      onMove={onMove}
      onLoad={handleLoad}
      mapStyle={mapStyle}
      maxPitch={85}
      attributionControl={false}
      style={style}
    >
      <AttributionControl compact position="bottom-left" />
      {children}
    </Map>
  );
}
