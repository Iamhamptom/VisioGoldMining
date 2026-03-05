'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-provider';

interface Proposal {
  id: string;
  name: string;
  site_type: string;
  mine_stage: string;
  recommended_package: string;
  price_min: number;
  price_max: number;
  timeline_weeks: number;
  sow_summary: string;
  created_at: string;
}

const defaultInput = {
  name: 'VisioGold proposal',
  site_type: 'greenfield',
  remoteness: 'medium',
  mine_stage: 'phase_0',
  data_maturity: 'medium',
  desired_bundle: 'Geo-to-Drill Pack',
  desired_phase: 'Phase 0',
};

export default function SalesProposalsPage() {
  const { token } = useAuth();
  const [input, setInput] = useState(defaultInput);
  const [creating, setCreating] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);

  async function load() {
    if (!token) return;
    const res = await fetch('/api/sales/proposals', { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setProposals(data.proposals || []);
  }

  useEffect(() => {
    load();
  }, [token]);

  async function createProposal(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;

    setCreating(true);
    try {
      await fetch('/api/sales/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(input),
      });
      await load();
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Proposal Builder</h1>
        <p className="text-sm text-gray-400">Generate priced SOWs and milestones from site constraints.</p>
      </div>

      <form onSubmit={createProposal} className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 md:grid-cols-2">
        <input className="rounded border border-white/10 bg-black/40 px-3 py-2 text-sm" value={input.name} onChange={(e) => setInput({ ...input, name: e.target.value })} placeholder="Proposal name" />
        <select className="rounded border border-white/10 bg-black/40 px-3 py-2 text-sm" value={input.site_type} onChange={(e) => setInput({ ...input, site_type: e.target.value })}>
          <option value="greenfield">Greenfield</option>
          <option value="brownfield">Brownfield</option>
          <option value="producing">Producing</option>
          <option value="multi_site">Multi-site</option>
        </select>
        <select className="rounded border border-white/10 bg-black/40 px-3 py-2 text-sm" value={input.remoteness} onChange={(e) => setInput({ ...input, remoteness: e.target.value })}>
          <option value="low">Low remoteness</option>
          <option value="medium">Medium remoteness</option>
          <option value="high">High remoteness</option>
          <option value="extreme">Extreme remoteness</option>
        </select>
        <select className="rounded border border-white/10 bg-black/40 px-3 py-2 text-sm" value={input.mine_stage} onChange={(e) => setInput({ ...input, mine_stage: e.target.value })}>
          <option value="phase_0">Phase 0</option>
          <option value="phase_1">Phase 1</option>
          <option value="phase_2">Phase 2</option>
          <option value="phase_3">Phase 3</option>
          <option value="enterprise">Enterprise</option>
        </select>
        <select className="rounded border border-white/10 bg-black/40 px-3 py-2 text-sm" value={input.data_maturity} onChange={(e) => setInput({ ...input, data_maturity: e.target.value })}>
          <option value="low">Low data maturity</option>
          <option value="medium">Medium data maturity</option>
          <option value="high">High data maturity</option>
        </select>
        <input className="rounded border border-white/10 bg-black/40 px-3 py-2 text-sm" value={input.desired_bundle} onChange={(e) => setInput({ ...input, desired_bundle: e.target.value })} placeholder="Desired bundle" />
        <button disabled={creating} className="rounded bg-gold-400 px-4 py-2 text-sm font-medium text-black md:col-span-2">
          {creating ? 'Generating...' : 'Generate proposal'}
        </button>
      </form>

      <div className="grid gap-4">
        {proposals.map((proposal) => (
          <article key={proposal.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-medium">{proposal.name}</h2>
              <span className="text-sm text-gold-400">
                ${Number(proposal.price_min).toLocaleString()} - ${Number(proposal.price_max).toLocaleString()}
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-300">{proposal.recommended_package} • {proposal.timeline_weeks} weeks</p>
            <p className="mt-2 text-sm text-gray-400">{proposal.sow_summary}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
