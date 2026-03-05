'use client';

import { useState } from 'react';

interface LeadCaptureFormProps {
  sourcePage: string;
  defaultInterest: string;
  ctaLabel?: string;
}

export function LeadCaptureForm({ sourcePage, defaultInterest, ctaLabel = 'Request scoping call' }: LeadCaptureFormProps) {
  const [form, setForm] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    country: 'DRC',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('/api/sales/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_page: sourcePage,
          interest_area: defaultInterest,
          stage: 'new',
          intent_tags: ['website-form', defaultInterest],
          ...form,
        }),
      });

      if (!res.ok) throw new Error('Failed to submit lead');

      setMessage('Thanks. We will contact you for a 30-60 minute scoping call.');
      setForm({ company_name: '', contact_name: '', email: '', country: 'DRC', notes: '' });
    } catch {
      setMessage('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 rounded-xl border border-white/10 bg-white/5 p-4">
      <input className="w-full rounded border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" placeholder="Company" value={form.company_name} onChange={(e) => setForm({ ...form, company_name: e.target.value })} />
      <input className="w-full rounded border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" placeholder="Name" value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} />
      <input className="w-full rounded border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" placeholder="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input className="w-full rounded border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
      <textarea className="w-full rounded border border-white/10 bg-black/40 px-3 py-2 text-sm text-white" rows={3} placeholder="Scope notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
      <button disabled={loading} className="rounded-md bg-gold-400 px-4 py-2 text-sm font-medium text-black disabled:opacity-60">
        {loading ? 'Submitting...' : ctaLabel}
      </button>
      {message && <p className="text-xs text-gray-300">{message}</p>}
    </form>
  );
}
