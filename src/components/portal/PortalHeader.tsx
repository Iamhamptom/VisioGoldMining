'use client';

import React from 'react';
import Link from 'next/link';
import { useBranding } from './BrandingProvider';
import { MapPin, Mail, Phone } from 'lucide-react';

export default function PortalHeader() {
  const { portal, primaryColor } = useBranding();
  if (!portal) return null;

  const basePath = `/gov/${portal.slug}`;

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {portal.logo_url && (
              <img src={portal.logo_url} alt={portal.title} className="h-10 w-10 rounded-lg object-cover" />
            )}
            <div>
              <Link href={basePath} className="text-lg font-bold" style={{ color: primaryColor }}>
                {portal.title}
              </Link>
              {portal.subtitle && (
                <p className="text-xs text-gray-500">{portal.subtitle}</p>
              )}
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href={`${basePath}/opportunities`} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Opportunities
            </Link>
            <Link href={`${basePath}/about`} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              About
            </Link>
            <Link href={`${basePath}/consult`} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
              Contact
            </Link>
            <Link
              href={`${basePath}/invest`}
              className="text-sm font-medium px-4 py-2 rounded-lg text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: primaryColor }}
            >
              Register as Investor
            </Link>
          </nav>
        </div>
      </div>

      {/* Contact bar */}
      {(portal.contact_email || portal.contact_phone) && (
        <div className="bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex items-center gap-4 text-xs text-gray-500">
            {portal.contact_email && (
              <span className="flex items-center gap-1"><Mail size={12} /> {portal.contact_email}</span>
            )}
            {portal.contact_phone && (
              <span className="flex items-center gap-1"><Phone size={12} /> {portal.contact_phone}</span>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
