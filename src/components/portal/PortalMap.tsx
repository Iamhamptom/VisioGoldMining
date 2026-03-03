'use client';

import React, { useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Marker } from 'react-map-gl/maplibre';
import type { OpportunityListing } from '@/types';
import { useBranding } from './BrandingProvider';

const BaseMap = dynamic(() => import('@/components/map/BaseMap'), { ssr: false });

const SECTOR_COLORS: Record<string, string> = {
  mining: '#D4AF37', agriculture: '#22C55E', infrastructure: '#6366F1',
  energy: '#F59E0B', tourism: '#EC4899', urban: '#8B5CF6',
  forestry: '#10B981', fisheries: '#06B6D4',
};

interface Props {
  listings: OpportunityListing[];
  portalSlug: string;
  center?: [number, number];
  zoom?: number;
  onListingClick?: (listing: OpportunityListing) => void;
}

export default function PortalMap({ listings, portalSlug, center, zoom = 6, onListingClick }: Props) {
  const { primaryColor } = useBranding();

  const mappableListings = listings.filter(l => l.location?.lat && l.location?.lon);

  const defaultCenter: [number, number] = center || (mappableListings.length > 0
    ? [mappableListings[0].location!.lon, mappableListings[0].location!.lat]
    : [23.66, -2.88]);

  return (
    <div className="h-[400px] rounded-xl overflow-hidden border border-gray-200">
      <BaseMap initialCenter={defaultCenter} initialZoom={zoom}>
        {mappableListings.map(listing => (
          <Marker
            key={listing.id}
            longitude={listing.location!.lon}
            latitude={listing.location!.lat}
            anchor="center"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              onListingClick?.(listing);
            }}
          >
            <div
              className="w-4 h-4 rounded-full border-2 border-white shadow-lg cursor-pointer hover:scale-125 transition-transform"
              style={{ backgroundColor: SECTOR_COLORS[listing.sector_id] || primaryColor }}
              title={listing.title}
            />
          </Marker>
        ))}
      </BaseMap>
    </div>
  );
}
