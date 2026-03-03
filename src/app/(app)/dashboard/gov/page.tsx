'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-provider';
import { Globe, FileText, Users, MessageSquare, DollarSign, TrendingUp } from 'lucide-react';

interface DashboardStats {
  portals: number;
  listings: number;
  leads: number;
  pendingConsultations: number;
}

export default function GovDashboardOverview() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({ portals: 0, listings: 0, leads: 0, pendingConsultations: 0 });

  useEffect(() => {
    if (!token) return;
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch('/api/dashboard/gov/portals', { headers }).then(r => r.json()),
      fetch('/api/dashboard/gov/listings', { headers }).then(r => r.json()),
      fetch('/api/dashboard/gov/leads', { headers }).then(r => r.json()),
      fetch('/api/dashboard/gov/consultations?status=pending', { headers }).then(r => r.json()),
    ]).then(([portalsData, listingsData, leadsData, consultData]) => {
      setStats({
        portals: portalsData.portals?.length || 0,
        listings: listingsData.listings?.length || 0,
        leads: leadsData.leads?.length || 0,
        pendingConsultations: consultData.consultations?.length || 0,
      });
    }).catch(() => {});
  }, [token]);

  const cards = [
    { label: 'Portals', value: stats.portals, icon: Globe, color: 'text-blue-400' },
    { label: 'Listings', value: stats.listings, icon: FileText, color: 'text-green-400' },
    { label: 'Investor Leads', value: stats.leads, icon: Users, color: 'text-purple-400' },
    { label: 'Pending Consultations', value: stats.pendingConsultations, icon: MessageSquare, color: 'text-orange-400' },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white/5 rounded-xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <Icon size={20} className={card.color} />
                <TrendingUp size={14} className="text-gray-600" />
              </div>
              <div className="text-2xl font-bold text-white">{card.value}</div>
              <div className="text-xs text-gray-500 mt-1">{card.label}</div>
            </div>
          );
        })}
      </div>

      <div className="bg-white/5 rounded-xl p-6 border border-white/10">
        <h2 className="text-lg font-semibold text-white mb-4">Getting Started</h2>
        <div className="space-y-3 text-sm text-gray-400">
          <p>1. Create a <strong className="text-white">Government Entity</strong> (province, municipality, or territory)</p>
          <p>2. Set up a <strong className="text-white">Portal</strong> with branding and contact info</p>
          <p>3. Add <strong className="text-white">Opportunity Listings</strong> across sectors</p>
          <p>4. <strong className="text-white">Publish</strong> your portal to start attracting investors</p>
          <p>5. Track <strong className="text-white">leads, consultations, and revenue</strong> from the dashboard</p>
        </div>
      </div>
    </div>
  );
}
