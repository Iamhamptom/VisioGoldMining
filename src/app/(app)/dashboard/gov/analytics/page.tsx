'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-provider';
import { BarChart3, Eye, Users, MessageSquare, MousePointerClick } from 'lucide-react';

interface AnalyticsSummary {
  total_views: number;
  total_listing_views: number;
  total_registrations: number;
  total_consultations: number;
  total_unique_visitors: number;
}

interface DailyMetric {
  date: string;
  portal_views: number;
  listing_views: number;
  registrations: number;
  unique_visitors: number;
}

export default function AnalyticsPage() {
  const { token } = useAuth();
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [daily, setDaily] = useState<DailyMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch('/api/dashboard/gov/analytics?days=30', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => {
        setSummary(data.summary || null);
        setDaily(data.daily || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="text-gray-500">Loading analytics...</div>;

  const stats = [
    { label: 'Portal Views', value: summary?.total_views || 0, icon: Eye, color: 'text-blue-400' },
    { label: 'Listing Views', value: summary?.total_listing_views || 0, icon: MousePointerClick, color: 'text-green-400' },
    { label: 'Registrations', value: summary?.total_registrations || 0, icon: Users, color: 'text-purple-400' },
    { label: 'Consultations', value: summary?.total_consultations || 0, icon: MessageSquare, color: 'text-orange-400' },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold text-white mb-6">Portal Analytics (Last 30 Days)</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white/5 rounded-xl p-5 border border-white/10">
              <Icon size={20} className={`${s.color} mb-2`} />
              <div className="text-2xl font-bold text-white">{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          );
        })}
      </div>

      {/* Daily activity chart (simplified bar chart) */}
      {daily.length > 0 && (
        <div className="bg-white/5 rounded-xl p-6 border border-white/10">
          <h3 className="text-sm font-semibold text-white mb-4">Daily Portal Views</h3>
          <div className="flex items-end gap-1 h-32">
            {daily.map((d, i) => {
              const maxViews = Math.max(...daily.map(x => Number(x.portal_views) || 1));
              const height = ((Number(d.portal_views) || 0) / maxViews) * 100;
              return (
                <div
                  key={i}
                  className="flex-1 bg-blue-500/50 rounded-t hover:bg-blue-500/70 transition-colors cursor-default"
                  style={{ height: `${Math.max(height, 2)}%` }}
                  title={`${d.date}: ${d.portal_views} views`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-2 text-[10px] text-gray-600">
            <span>{daily[0]?.date}</span>
            <span>{daily[daily.length - 1]?.date}</span>
          </div>
        </div>
      )}

      {daily.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <BarChart3 size={48} className="mx-auto mb-4 opacity-30" />
          <p>No analytics data yet. Data will appear as visitors interact with your portal.</p>
        </div>
      )}
    </div>
  );
}
