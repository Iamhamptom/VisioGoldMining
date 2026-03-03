'use client';

import React from 'react';
import { useBranding } from '@/components/portal/BrandingProvider';
import ExplanationPanel from '@/components/portal/ExplanationPanel';

export default function AboutPage() {
  const { portal, primaryColor } = useBranding();
  if (!portal) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">About {portal.title}</h1>

      {portal.about_text ? (
        <div className="prose prose-lg max-w-none text-gray-600 mb-8">
          {portal.about_text}
        </div>
      ) : (
        <div className="text-gray-600 mb-8">
          <p>This portal showcases investment opportunities in the region, connecting investors with government-backed projects across multiple sectors.</p>
        </div>
      )}

      <ExplanationPanel title="How does this portal work?" defaultOpen>
        <div className="space-y-3">
          <p><strong>For Investors:</strong> Browse opportunities, register your interest, and request consultations directly with government officials.</p>
          <p><strong>For Government:</strong> List verified opportunities, track investor interest, and manage consultation requests through the admin dashboard.</p>
          <p><strong>Revenue Model:</strong> VisioGold charges a platform fee (typically 20%) on successful transactions, with the remaining 80% going directly to the government entity.</p>
        </div>
      </ExplanationPanel>

      {/* Contact Info */}
      <div className="mt-8 bg-gray-50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
        <div className="space-y-2 text-sm text-gray-600">
          {portal.contact_email && <p><strong>Email:</strong> {portal.contact_email}</p>}
          {portal.contact_phone && <p><strong>Phone:</strong> {portal.contact_phone}</p>}
          {portal.website_url && <p><strong>Website:</strong> <a href={portal.website_url} className="underline" style={{ color: primaryColor }}>{portal.website_url}</a></p>}
        </div>
      </div>
    </div>
  );
}
