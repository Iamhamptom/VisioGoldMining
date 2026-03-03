'use client';

import React, { useState } from 'react';
import { useBranding } from './BrandingProvider';
import ExplanationPanel from './ExplanationPanel';

const SECTORS = [
  { id: 'mining', label: 'Mining & Minerals' },
  { id: 'agriculture', label: 'Agriculture' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'energy', label: 'Energy & Power' },
  { id: 'tourism', label: 'Tourism & Hospitality' },
  { id: 'urban', label: 'Urban Development' },
  { id: 'forestry', label: 'Forestry & Timber' },
  { id: 'fisheries', label: 'Fisheries & Aquaculture' },
];

interface Props {
  portalSlug: string;
}

export default function InvestorRegistrationForm({ portalSlug }: Props) {
  const { primaryColor } = useBranding();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const sectors = form.getAll('sectors') as string[];

    const body = {
      email: form.get('email'),
      first_name: form.get('first_name'),
      last_name: form.get('last_name'),
      phone: form.get('phone') || undefined,
      company: form.get('company') || undefined,
      job_title: form.get('job_title') || undefined,
      country: form.get('country') || undefined,
      investment_min: form.get('investment_min') ? Number(form.get('investment_min')) : undefined,
      investment_max: form.get('investment_max') ? Number(form.get('investment_max')) : undefined,
      sectors_of_interest: sectors.length > 0 ? sectors : undefined,
      experience_level: form.get('experience_level') || undefined,
    };

    try {
      const res = await fetch(`/api/gov/${portalSlug}/invest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">✅</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Registration Complete!</h2>
        <p className="text-gray-600">Thank you for registering. We&apos;ll keep you updated on new opportunities.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <ExplanationPanel title="Why register as an investor?">
        <p>Registering gives you priority access to new opportunities, direct contact with government officials, and personalized recommendations based on your investment profile.</p>
      </ExplanationPanel>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">{error}</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
          <input name="first_name" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
          <input name="last_name" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
        <input name="email" type="email" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input name="phone" type="tel" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <input name="country" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <input name="company" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
          <input name="job_title" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Experience Level</label>
        <select name="experience_level" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
          <option value="">Select...</option>
          <option value="novice">Novice - New to investing in this region</option>
          <option value="intermediate">Intermediate - Some experience</option>
          <option value="experienced">Experienced - Active investor</option>
          <option value="institutional">Institutional - Fund/organization</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Min Investment (USD)</label>
          <input name="investment_min" type="number" min="0" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Max Investment (USD)</label>
          <input name="investment_max" type="number" min="0" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Sectors of Interest</label>
        <div className="grid grid-cols-2 gap-2">
          {SECTORS.map(s => (
            <label key={s.id} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" name="sectors" value={s.id} className="rounded border-gray-300" />
              {s.label}
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-lg text-white font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: primaryColor }}
      >
        {submitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
