'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, TrendingUp, Clock } from 'lucide-react';
import type { OpportunityListing } from '@/types';
import { useBranding } from './BrandingProvider';

const SECTOR_ICONS: Record<string, string> = {
  mining: '⛏️', agriculture: '🌾', infrastructure: '🏗️', energy: '⚡',
  tourism: '📍', urban: '🏙️', forestry: '🌲', fisheries: '🐟',
};

function formatCurrency(amount: number | null): string {
  if (!amount) return '—';
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount.toFixed(0)}`;
}

interface Props {
  listing: OpportunityListing & { sector_name?: string; sector_icon?: string };
  portalSlug: string;
}

export default function OpportunityCard({ listing, portalSlug }: Props) {
  const { primaryColor } = useBranding();

  return (
    <Link
      href={`/gov/${portalSlug}/opportunities/${listing.slug}`}
      className="block bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 overflow-hidden group"
    >
      {/* Image or gradient header */}
      {listing.images?.[0]?.url ? (
        <div className="h-40 overflow-hidden">
          <img src={listing.images[0].url} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      ) : (
        <div className="h-24 flex items-center justify-center text-3xl" style={{ background: `linear-gradient(135deg, ${primaryColor}15, ${primaryColor}05)` }}>
          {SECTOR_ICONS[listing.sector_id] || '📊'}
        </div>
      )}

      <div className="p-4">
        {/* Sector badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
            {SECTOR_ICONS[listing.sector_id]} {listing.sector_name || listing.sector_id}
          </span>
          {listing.score_overall !== null && listing.score_overall > 0 && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}>
              {listing.score_overall.toFixed(1)}/10
            </span>
          )}
        </div>

        <h3 className="text-sm font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-gray-700">
          {listing.title}
        </h3>

        {listing.summary && (
          <p className="text-xs text-gray-500 mb-3 line-clamp-2">{listing.summary}</p>
        )}

        <div className="flex items-center gap-3 text-xs text-gray-400">
          {listing.province && (
            <span className="flex items-center gap-1"><MapPin size={12} />{listing.province}</span>
          )}
          {(listing.investment_min || listing.investment_max) && (
            <span className="flex items-center gap-1">
              <TrendingUp size={12} />
              {formatCurrency(listing.investment_min)}–{formatCurrency(listing.investment_max)}
            </span>
          )}
          {listing.timeline_months && (
            <span className="flex items-center gap-1"><Clock size={12} />{listing.timeline_months}mo</span>
          )}
        </div>
      </div>
    </Link>
  );
}
