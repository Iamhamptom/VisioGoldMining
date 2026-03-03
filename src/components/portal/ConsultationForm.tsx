'use client';

import React, { useState } from 'react';
import { useBranding } from './BrandingProvider';

const REQUEST_TYPES = [
  { id: 'meeting', label: 'In-person Meeting' },
  { id: 'information', label: 'Request Information' },
  { id: 'site_visit', label: 'Site Visit' },
  { id: 'partnership', label: 'Partnership Discussion' },
  { id: 'other', label: 'Other' },
];

interface Props {
  portalSlug: string;
  listingSlug?: string;
  listingTitle?: string;
}

export default function ConsultationForm({ portalSlug, listingSlug, listingTitle }: Props) {
  const { primaryColor } = useBranding();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(e.currentTarget);
    const body = {
      request_type: form.get('request_type'),
      subject: form.get('subject'),
      message: form.get('message'),
      contact_name: form.get('contact_name'),
      contact_email: form.get('contact_email'),
      contact_phone: form.get('contact_phone') || undefined,
      contact_company: form.get('contact_company') || undefined,
      listing_id: listingSlug || undefined,
    };

    try {
      const res = await fetch(`/api/gov/${portalSlug}/consult`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Request failed');
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
        <div className="text-4xl mb-4">📬</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
        <p className="text-gray-600">A government representative will review your request and get back to you shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {listingTitle && (
        <div className="bg-gray-50 rounded-lg p-4 text-sm">
          <span className="text-gray-500">Regarding:</span>{' '}
          <span className="font-medium text-gray-900">{listingTitle}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">{error}</div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Request Type *</label>
        <select name="request_type" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
          <option value="">Select type...</option>
          {REQUEST_TYPES.map(t => (
            <option key={t.id} value={t.id}>{t.label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
        <input name="subject" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
        <textarea name="message" required rows={5} className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
          <input name="contact_name" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
          <input name="contact_email" type="email" required className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input name="contact_phone" type="tel" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <input name="contact_company" className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-lg text-white font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: primaryColor }}
      >
        {submitting ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  );
}
