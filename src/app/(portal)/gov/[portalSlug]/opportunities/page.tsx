'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import OpportunityCatalog from '@/components/portal/OpportunityCatalog';
import type { OpportunityListing } from '@/types';

export default function OpportunitiesPage() {
  const { portalSlug } = useParams<{ portalSlug: string }>();
  const searchParams = useSearchParams();

  const [listings, setListings] = useState<OpportunityListing[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedSector, setSelectedSector] = useState<string | null>(searchParams.get('sector'));
  const [investmentRange, setInvestmentRange] = useState<[number | null, number | null]>([null, null]);
  const [loading, setLoading] = useState(true);

  const fetchListings = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedSector) params.set('sector', selectedSector);
    if (investmentRange[0]) params.set('min_investment', String(investmentRange[0]));
    if (investmentRange[1]) params.set('max_investment', String(investmentRange[1]));

    try {
      const res = await fetch(`/api/gov/${portalSlug}/opportunities?${params}`);
      const data = await res.json();
      setListings(data.listings || []);
      setTotalCount(data.pagination?.total || 0);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [portalSlug, selectedSector, investmentRange]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Investment Opportunities</h1>
        <p className="text-gray-600">Browse and filter available opportunities across all sectors</p>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-500">Loading opportunities...</div>
      ) : (
        <OpportunityCatalog
          listings={listings}
          portalSlug={portalSlug}
          selectedSector={selectedSector}
          onSectorChange={setSelectedSector}
          investmentRange={investmentRange}
          onInvestmentChange={setInvestmentRange}
          totalCount={totalCount}
        />
      )}
    </div>
  );
}
