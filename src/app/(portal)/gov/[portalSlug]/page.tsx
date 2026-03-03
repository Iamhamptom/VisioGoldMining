'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useBranding } from '@/components/portal/BrandingProvider';
import OpportunityCard from '@/components/portal/OpportunityCard';
import type { OpportunityListing, GovernmentPortal } from '@/types';
import { ArrowRight, TrendingUp, Users, MapPin } from 'lucide-react';

export default function PortalHomePage() {
  const { portalSlug } = useParams<{ portalSlug: string }>();
  const { portal, primaryColor } = useBranding();
  const [featured, setFeatured] = useState<OpportunityListing[]>([]);

  useEffect(() => {
    fetch(`/api/gov/${portalSlug}/opportunities?limit=6&sort=score`)
      .then(r => r.json())
      .then(data => setFeatured(data.listings || []))
      .catch(() => {});

    // Track portal view
    fetch(`/api/gov/${portalSlug}/analytics`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_type: 'portal_view' }),
    }).catch(() => {});
  }, [portalSlug]);

  if (!portal) return null;

  return (
    <div>
      {/* Hero Section */}
      <section
        className="relative py-24 px-4"
        style={{
          background: portal.banner_url
            ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${portal.banner_url}) center/cover`
            : `linear-gradient(135deg, ${primaryColor}, ${primaryColor}CC)`,
        }}
      >
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{portal.title}</h1>
          {portal.subtitle && <p className="text-xl opacity-90 mb-6">{portal.subtitle}</p>}
          {portal.hero_text && <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">{portal.hero_text}</p>}
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/gov/${portalSlug}/opportunities`}
              className="inline-flex items-center gap-2 bg-white text-gray-900 font-semibold px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Explore Opportunities <ArrowRight size={16} />
            </Link>
            <Link
              href={`/gov/${portalSlug}/invest`}
              className="inline-flex items-center gap-2 border-2 border-white text-white font-semibold px-6 py-3 rounded-lg hover:bg-white/10 transition-colors"
            >
              Register as Investor
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
              <TrendingUp size={24} className="mx-auto mb-2" style={{ color: primaryColor }} />
              <div className="text-2xl font-bold text-gray-900">{featured.length}+</div>
              <div className="text-sm text-gray-500">Investment Opportunities</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
              <Users size={24} className="mx-auto mb-2" style={{ color: primaryColor }} />
              <div className="text-2xl font-bold text-gray-900">{(portal as GovernmentPortal & { featured_sectors?: string[] }).featured_sectors?.length || 8}</div>
              <div className="text-sm text-gray-500">Active Sectors</div>
            </div>
            <div className="bg-white rounded-xl p-6 text-center border border-gray-100">
              <MapPin size={24} className="mx-auto mb-2" style={{ color: primaryColor }} />
              <div className="text-2xl font-bold text-gray-900">DRC</div>
              <div className="text-sm text-gray-500">Region</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Opportunities */}
      {featured.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Featured Opportunities</h2>
              <Link
                href={`/gov/${portalSlug}/opportunities`}
                className="text-sm font-medium flex items-center gap-1 hover:opacity-80 transition-opacity"
                style={{ color: primaryColor }}
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map(listing => (
                <OpportunityCard key={listing.id} listing={listing} portalSlug={portalSlug} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Invest?</h2>
          <p className="text-lg text-gray-300 mb-8">Register as an investor to receive updates on new opportunities and connect directly with government representatives.</p>
          <Link
            href={`/gov/${portalSlug}/invest`}
            className="inline-flex items-center gap-2 text-white font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
            style={{ backgroundColor: primaryColor }}
          >
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
