'use client';

import React from 'react';
import Link from 'next/link';
import { useBranding } from './BrandingProvider';

export default function PortalFooter() {
  const { portal, primaryColor } = useBranding();
  if (!portal) return null;

  const basePath = `/gov/${portal.slug}`;

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-2">{portal.title}</h3>
            {portal.subtitle && <p className="text-sm mb-4">{portal.subtitle}</p>}
            <p className="text-xs">
              Powered by <span className="text-amber-400 font-semibold">VisioGold</span>
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2 text-sm">
              <Link href={`${basePath}/opportunities`} className="hover:text-white transition-colors">Opportunities</Link>
              <Link href={`${basePath}/invest`} className="hover:text-white transition-colors">Invest</Link>
              <Link href={`${basePath}/about`} className="hover:text-white transition-colors">About</Link>
              <Link href={`${basePath}/consult`} className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-3">Contact</h4>
            <div className="flex flex-col gap-2 text-sm">
              {portal.contact_email && <a href={`mailto:${portal.contact_email}`} className="hover:text-white transition-colors">{portal.contact_email}</a>}
              {portal.contact_phone && <span>{portal.contact_phone}</span>}
              {portal.website_url && <a href={portal.website_url} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">{portal.website_url}</a>}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-xs text-center">
          &copy; {new Date().getFullYear()} {portal.title}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
