'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import OpportunityDetail from '@/components/portal/OpportunityDetail';
import type { OpportunityListing } from '@/types';

export default function ListingDetailPage() {
  const { portalSlug, listingSlug } = useParams<{ portalSlug: string; listingSlug: string }>();
  const [listing, setListing] = useState<OpportunityListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/gov/${portalSlug}/opportunities/${listingSlug}`);
        if (!res.ok) throw new Error('Not found');
        const data = await res.json();
        setListing(data.listing);
      } catch {
        setError('Opportunity not found');
      } finally {
        setLoading(false);
      }
    }
    load();

    // Track listing view
    fetch(`/api/gov/${portalSlug}/analytics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type: 'listing_view' }),
    }).catch(() => {});
  }, [portalSlug, listingSlug]);

  if (loading) return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">Loading...</div>;
  if (error || !listing) return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">{error || 'Not found'}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <OpportunityDetail listing={listing} portalSlug={portalSlug} />
    </div>
  );
}
