'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-provider';
import { DollarSign, TrendingUp, Building2 } from 'lucide-react';
import type { RevenueEvent } from '@/types';

interface MonthlySummary {
  month: string;
  event_count: number;
  total_gross: number;
  total_platform: number;
  total_government: number;
  currency: string;
}

function formatMoney(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}K`;
  return `$${num.toFixed(2)}`;
}

export default function RevenuePage() {
  const { token } = useAuth();
  const [events, setEvents] = useState<(RevenueEvent & { portal_title?: string })[]>([]);
  const [summary, setSummary] = useState<MonthlySummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch('/api/dashboard/gov/revenue', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        setEvents(data.events || []);
        setSummary(data.monthly_summary || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="text-gray-500">Loading revenue data...</div>;

  const totalGross = events.reduce((sum, e) => sum + (typeof e.gross_amount === 'string' ? parseFloat(e.gross_amount) : e.gross_amount), 0);
  const totalPlatform = events.reduce((sum, e) => sum + (typeof e.platform_amount === 'string' ? parseFloat(e.platform_amount) : e.platform_amount), 0);
  const totalGov = events.reduce((sum, e) => sum + (typeof e.government_amount === 'string' ? parseFloat(e.government_amount) : e.government_amount), 0);

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-6">Revenue</h2>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white/5 rounded-xl p-5 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-green-400" />
            <span className="text-xs text-gray-500">Total Revenue</span>
          </div>
          <div className="text-xl font-bold text-white">{formatMoney(totalGross)}</div>
        </div>
        <div className="bg-white/5 rounded-xl p-5 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Building2 size={16} className="text-blue-400" />
            <span className="text-xs text-gray-500">Government Share (80%)</span>
          </div>
          <div className="text-xl font-bold text-blue-400">{formatMoney(totalGov)}</div>
        </div>
        <div className="bg-white/5 rounded-xl p-5 border border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-gold-400" />
            <span className="text-xs text-gray-500">Platform Fee (20%)</span>
          </div>
          <div className="text-xl font-bold text-gold-400">{formatMoney(totalPlatform)}</div>
        </div>
      </div>

      {/* Events table */}
      {events.length > 0 && (
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="text-left px-4 py-3 font-medium">Date</th>
                <th className="text-left px-4 py-3 font-medium">Type</th>
                <th className="text-left px-4 py-3 font-medium">Portal</th>
                <th className="text-right px-4 py-3 font-medium">Gross</th>
                <th className="text-right px-4 py-3 font-medium">Gov (80%)</th>
                <th className="text-right px-4 py-3 font-medium">Platform (20%)</th>
                <th className="text-left px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {events.map(e => (
                <tr key={e.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3 text-gray-400">{new Date(e.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-white">{e.event_type.replace(/_/g, ' ')}</td>
                  <td className="px-4 py-3 text-gray-400">{e.portal_title || '—'}</td>
                  <td className="px-4 py-3 text-right text-white font-medium">{formatMoney(e.gross_amount)}</td>
                  <td className="px-4 py-3 text-right text-blue-400">{formatMoney(e.government_amount)}</td>
                  <td className="px-4 py-3 text-right text-gold-400">{formatMoney(e.platform_amount)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      e.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                      e.status === 'invoiced' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-gray-500/20 text-gray-400'
                    }`}>{e.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {events.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <DollarSign size={48} className="mx-auto mb-4 opacity-30" />
          <p>No revenue events yet.</p>
        </div>
      )}
    </div>
  );
}
