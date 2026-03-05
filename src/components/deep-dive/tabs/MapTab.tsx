import { useEffect, useRef, useState } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { useDeepDive } from '@/hooks/useDeepDive';
import { getTargetCentroid, getTargetName } from '@/lib/types/deep-dive';

export default function MapTab() {
  const { target } = useDeepDive();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const [loading, setLoading] = useState(true);

  const centroid = target ? getTargetCentroid(target) : null;
  const name = target ? getTargetName(target) : '';

  useEffect(() => {
    if (!mapContainerRef.current || !centroid) return;

    let map: maplibregl.Map;

    const init = async () => {
      const maplibregl = (await import('maplibre-gl')).default;

      map = new maplibregl.Map({
        container: mapContainerRef.current!,
        style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
        center: centroid,
        zoom: 10,
        pitch: 40,
        attributionControl: false,
      });

      map.on('load', () => {
        setLoading(false);

        // Add marker at centroid
        new maplibregl.Marker({ color: '#D4AF37' })
          .setLngLat(centroid)
          .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(
            `<div style="color:#fff;font-size:12px;padding:4px;">${name}</div>`
          ))
          .addTo(map);

        // Try terrain
        try {
          map.addSource('terrain-dem', {
            type: 'raster-dem',
            tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
            tileSize: 256,
            maxzoom: 14,
            encoding: 'terrarium',
          });
          map.setTerrain({ source: 'terrain-dem', exaggeration: 1.5 });
        } catch {}
      });

      mapRef.current = map;
    };

    init();

    return () => {
      map?.remove();
      mapRef.current = null;
      setLoading(true);
    };
  }, [centroid?.[0], centroid?.[1], name]);

  if (!centroid) {
    return (
      <div className="flex items-center justify-center h-full p-12">
        <div className="text-center">
          <MapPin size={32} className="text-gray-600 mx-auto mb-3" />
          <p className="text-sm text-gray-400">No location data available for this item.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full min-h-[500px]">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
          <Loader2 size={24} className="animate-spin text-gold-400" />
        </div>
      )}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
