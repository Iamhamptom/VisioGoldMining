'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/context/auth-provider';
import Link from 'next/link';

interface SalesLead {
  id: string;
  source_page: string;
  interest_area: string;
  company_name: string | null;
  contact_name: string | null;
  email: string;
  country: string | null;
  stage: string;
  estimated_acv: number | null;
  notes: string | null;
  created_at: string;
}

const STAGES = ['all', 'new', 'qualified', 'proposal', 'won', 'lost', 'waitlist'];

export default function SalesLeadsPage() {
  const { token } = useAuth();
  const [leads, setLeads] = useState<SalesLead[]>([]);
  const [stage, setStage] = useState('all');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    const query = new URLSearchParams();
    if (stage !== 'all') query.set('stage', stage);
    if (country.trim()) query.set('country', country.trim());

    setLoading(true);
    fetch(`/api/sales/leads?${query.toString()}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setLeads(data.leads || []))
      .finally(() => setLoading(false));
  }, [token, stage, country]);

  const totalAcv = useMemo(() => leads.reduce((sum, lead) => sum + Number(lead.estimated_acv || 0), 0), [leads]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Sales Leads Inbox</h1>
        <p className="text-sm text-gray-400">Filter by offer stage, country, and estimated ACV.</p>
        <Link href="/sales/proposals" className="mt-2 inline-block text-sm text-gold-400 hover:underline">
          Open proposal builder
        </Link>
      </div>

      <div className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 md:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs text-gray-400">Stage</label>
          <select className="w-full rounded border border-white/10 bg-black/40 px-3 py-2 text-sm" value={stage} onChange={(e) => setStage(e.target.value)}>
            {STAGES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-gray-400">Country</label>
          <input className="w-full rounded border border-white/10 bg-black/40 px-3 py-2 text-sm" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="DRC" />
        </div>
        <div className="rounded border border-white/10 bg-black/30 p-3">
          <p className="text-xs text-gray-400">Lead count</p>
          <p className="text-xl font-semibold">{leads.length}</p>
        </div>
        <div className="rounded border border-white/10 bg-black/30 p-3">
          <p className="text-xs text-gray-400">Estimated ACV</p>
          <p className="text-xl font-semibold">${totalAcv.toLocaleString()}</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-left">
            <tr>
              <th className="px-3 py-2">Company</th>
              <th className="px-3 py-2">Interest</th>
              <th className="px-3 py-2">Stage</th>
              <th className="px-3 py-2">Country</th>
              <th className="px-3 py-2">ACV</th>
              <th className="px-3 py-2">Source</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="px-3 py-4 text-center text-gray-400">Loading...</td></tr>
            )}
            {!loading && leads.length === 0 && (
              <tr><td colSpan={6} className="px-3 py-4 text-center text-gray-400">No leads found</td></tr>
            )}
            {!loading && leads.map((lead) => (
              <tr key={lead.id} className="border-t border-white/5">
                <td className="px-3 py-2">
                  <div className="font-medium">{lead.company_name || lead.contact_name || 'Unknown'}</div>
                  <div className="text-xs text-gray-400">{lead.email}</div>
                </td>
                <td className="px-3 py-2">{lead.interest_area}</td>
                <td className="px-3 py-2 uppercase text-xs text-gold-400">{lead.stage}</td>
                <td className="px-3 py-2">{lead.country || '-'}</td>
                <td className="px-3 py-2">${Number(lead.estimated_acv || 0).toLocaleString()}</td>
                <td className="px-3 py-2 text-xs text-gray-400">{lead.source_page}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
