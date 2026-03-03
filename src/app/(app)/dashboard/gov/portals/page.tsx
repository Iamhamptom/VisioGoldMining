'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-provider';
import { Plus, Globe, ExternalLink } from 'lucide-react';
import type { GovernmentPortal } from '@/types';

export default function PortalsPage() {
  const { token } = useAuth();
  const [portals, setPortals] = useState<(GovernmentPortal & { entity_name?: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch('/api/dashboard/gov/portals', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setPortals(data.portals || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="text-gray-500">Loading portals...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Portal Management</h2>
        <button className="flex items-center gap-2 px-4 py-2 bg-gold-400 text-black text-sm font-medium rounded-lg hover:bg-gold-300 transition-colors">
          <Plus size={16} /> New Portal
        </button>
      </div>

      {portals.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Globe size={48} className="mx-auto mb-4 opacity-30" />
          <p>No portals yet. Create your first portal to get started.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {portals.map(portal => (
            <div key={portal.id} className="bg-white/5 rounded-xl p-5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {portal.logo_url ? (
                  <img src={portal.logo_url} alt="" className="w-12 h-12 rounded-lg object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: portal.primary_color + '20' }}>
                    <Globe size={20} style={{ color: portal.primary_color }} />
                  </div>
                )}
                <div>
                  <h3 className="text-white font-medium">{portal.title}</h3>
                  <p className="text-xs text-gray-500">{portal.entity_name} &middot; /gov/{portal.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full ${portal.published ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                  {portal.published ? 'Published' : 'Draft'}
                </span>
                {portal.published && (
                  <a href={`/gov/${portal.slug}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white">
                    <ExternalLink size={16} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
