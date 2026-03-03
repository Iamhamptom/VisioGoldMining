'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import InvestorRegistrationForm from '@/components/portal/InvestorRegistrationForm';

export default function InvestPage() {
  const { portalSlug } = useParams<{ portalSlug: string }>();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Investor Registration</h1>
        <p className="text-gray-600">Register your interest and get access to exclusive investment opportunities</p>
      </div>
      <InvestorRegistrationForm portalSlug={portalSlug} />
    </div>
  );
}
