'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-provider';
import { Users, Star } from 'lucide-react';
import type { InvestorProfile } from '@/types';

interface Lead extends InvestorProfile {
  portal_title?: string;
  registered_at?: string;
  saved_count?: number;
  consultation_count?: number;
}

export default function LeadsPage() {
  const { token } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch('/api/dashboard/gov/leads', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => setLeads(data.leads || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="text-gray-500">Loading leads...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white">Investor Leads</h2>
        <span className="text-sm text-gray-500">{leads.length} leads</span>
      </div>

      {leads.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Users size={48} className="mx-auto mb-4 opacity-30" />
          <p>No investor leads yet. They&apos;ll appear when investors register on your portal.</p>
        </div>
      ) : (
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="text-left px-4 py-3 font-medium">Name</th>
                <th className="text-left px-4 py-3 font-medium">Company</th>
                <th className="text-left px-4 py-3 font-medium">Email</th>
                <th className="text-left px-4 py-3 font-medium">Portal</th>
                <th className="text-left px-4 py-3 font-medium">Score</th>
                <th className="text-left px-4 py-3 font-medium">Engagement</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 text-white font-medium">{lead.first_name} {lead.last_name}</td>
                  <td className="px-4 py-3 text-gray-400">{lead.company || '—'}</td>
                  <td className="px-4 py-3 text-gray-400">{lead.email}</td>
                  <td className="px-4 py-3 text-gray-400">{lead.portal_title || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-gold-400" />
                      <span className="text-gold-400 font-medium">{lead.lead_score}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {lead.saved_count || 0} saved, {lead.consultation_count || 0} consults
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
