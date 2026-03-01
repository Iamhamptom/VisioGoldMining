import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type maplibregl from 'maplibre-gl';

interface MapContextValue {
  map: maplibregl.Map | null;
  setMap: (map: maplibregl.Map) => void;
}

const MapContext = createContext<MapContextValue>({
  map: null,
  setMap: () => {},
});

export function MapProvider({ children }: { children: ReactNode }) {
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  return React.createElement(
    MapContext.Provider,
    { value: { map, setMap } },
    children
  );
}

export function useMapContext() {
  return useContext(MapContext);
}
