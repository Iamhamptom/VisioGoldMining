'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Globe, FileText, Users, MessageSquare, DollarSign, BarChart3, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard/gov', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/gov/portals', label: 'Portals', icon: Globe },
  { href: '/dashboard/gov/listings', label: 'Listings', icon: FileText },
  { href: '/dashboard/gov/leads', label: 'Leads', icon: Users },
  { href: '/dashboard/gov/consultations', label: 'Consultations', icon: MessageSquare },
  { href: '/dashboard/gov/revenue', label: 'Revenue', icon: DollarSign },
  { href: '/dashboard/gov/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/gov/settings', label: 'Settings', icon: Settings },
];

export default function GovDashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gold-400 mb-1">Government Portal</h1>
        <p className="text-sm text-gray-500">Manage portals, opportunities, and investor relations</p>
      </div>

      {/* Tab navigation */}
      <nav className="flex gap-1 mb-6 overflow-x-auto border-b border-white/10 pb-px">
        {NAV_ITEMS.map(item => {
          const isActive = pathname === item.href || (item.href !== '/dashboard/gov' && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${
                isActive
                  ? 'text-gold-400 bg-gold-400/10 border-b-2 border-gold-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {children}
    </div>
  );
}
