'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-provider';
import { Plus, FileText } from 'lucide-react';
import type { OpportunityListing } from '@/types';

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-500/20 text-gray-400',
  submitted: 'bg-blue-500/20 text-blue-400',
  in_review: 'bg-yellow-500/20 text-yellow-400',
  approved: 'bg-purple-500/20 text-purple-400',
  published: 'bg-green-500/20 text-green-400',
  archived: 'bg-red-500/20 text-red-400',
};

export default function ListingsPage() {
  const { token } = useAuth();
  const [listings, setListings] = useState<(OpportunityListing & { sector_name?: string; portal_title?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch('/api/dashboard/gov/listings', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setListings(data.listings || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="text-gray-500">Loading listings...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Opportunity Listings</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-gold-400 text-black text-sm font-medium rounded-lg hover:bg-gold-300 transition-colors">
          <Plus size={16} /> New Listing
        </button>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <FileText size={48} className="mx-auto mb-4 opacity-30" />
          <p>No listings yet. Create your first opportunity listing.</p>
        </div>
      ) : (
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Sector</th>
                <th className="text-left px-4 py-3 font-medium">Portal</th>
                <th className="text-left px-4 py-3 font-medium">Score</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {listings.map(listing => (
                <tr key={listing.id} className="border-b border-white/5 hover:bg-white/5 cursor-pointer">
                  <td className="px-4 py-3 text-white font-medium">{listing.title}</td>
                  <td className="px-4 py-3 text-gray-400">{listing.sector_name || listing.sector_id}</td>
                  <td className="px-4 py-3 text-gray-400">{listing.portal_title || '—'}</td>
                  <td className="px-4 py-3">
                    {listing.score_overall != null ? (
                      <span className="text-gold-400 font-medium">{listing.score_overall.toFixed(1)}</span>
                    ) : (
                      <span className="text-gray-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[listing.status] || ''}`}>
                      {listing.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
