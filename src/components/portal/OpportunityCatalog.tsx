'use client';

import React from 'react';
import type { OpportunityListing } from '@/types';
import OpportunityCard from './OpportunityCard';
import SectorFilter from './SectorFilter';
import InvestmentRangeFilter from './InvestmentRangeFilter';

interface Props {
  listings: (OpportunityListing & { sector_name?: string; sector_icon?: string })[];
  portalSlug: string;
  selectedSector: string | null;
  onSectorChange: (sector: string | null) => void;
  investmentRange: [number | null, number | null];
  onInvestmentChange: (range: [number | null, number | null]) => void;
  totalCount: number;
}

export default function OpportunityCatalog({
  listings,
  portalSlug,
  selectedSector,
  onSectorChange,
  investmentRange,
  onInvestmentChange,
  totalCount,
}: Props) {
  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <SectorFilter selected={selectedSector} onChange={onSectorChange} />
        <InvestmentRangeFilter value={investmentRange} onChange={onInvestmentChange} />
        <span className="text-sm text-gray-500 ml-auto">
          {totalCount} opportunit{totalCount === 1 ? 'y' : 'ies'}
        </span>
      </div>

      {/* Grid */}
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => (
            <OpportunityCard key={listing.id} listing={listing} portalSlug={portalSlug} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg mb-2">No opportunities found</p>
          <p className="text-sm">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}
