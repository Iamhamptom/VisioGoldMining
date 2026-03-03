'use client';

import React from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import ConsultationForm from '@/components/portal/ConsultationForm';

export default function ConsultPage() {
  const { portalSlug } = useParams<{ portalSlug: string }>();
  const searchParams = useSearchParams();
  const listingSlug = searchParams.get('listing') || undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Request a Consultation</h1>
        <p className="text-gray-600">Connect with government representatives for meetings, site visits, or more information</p>
      </div>
      <ConsultationForm portalSlug={portalSlug} listingSlug={listingSlug} />
    </div>
  );
}
