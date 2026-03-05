'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-provider';

interface Repo {
  id: string;
  name: string;
}

interface Branch {
  id: string;
  name: string;
}

export default function ExplorationDashboardPage() {
  const { token } = useAuth();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [repoId, setRepoId] = useState('');
  const [branchId, setBranchId] = useState('');
  const [summary, setSummary] = useState<Record<string, unknown> | null>(null);
  const [recommendation, setRecommendation] = useState<{ recommendation: string; reasons: string[] } | null>(null);
  const [decisionLogs, setDecisionLogs] = useState<Array<{ id: string; recommendation: string; reasons: string[]; decided_at: string }>>([]);

  useEffect(() => {
    if (!token) return;
    fetch('/api/repos', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        const loadedRepos = data.repos || [];
        setRepos(loadedRepos);
        if (loadedRepos[0]) setRepoId(loadedRepos[0].id);
      });
  }, [token]);

  useEffect(() => {
    if (!token || !repoId) return;
    fetch(`/api/repos/${repoId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => {
        const loadedBranches = data.branches || [];
        setBranches(loadedBranches);
        if (loadedBranches[0]) setBranchId(loadedBranches[0].id);
      });
  }, [token, repoId]);

  async function refreshMetrics() {
    if (!token || !repoId || !branchId) return;

    const [summaryRes, recommendationRes, logRes] = await Promise.all([
      fetch(`/api/dashboard/exploration/summary?repo_id=${repoId}&branch_id=${branchId}`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`/api/dashboard/exploration/recommendation?repo_id=${repoId}&branch_id=${branchId}`, { headers: { Authorization: `Bearer ${token}` } }),
      fetch(`/api/dashboard/exploration/decision-log?repo_id=${repoId}&branch_id=${branchId}`, { headers: { Authorization: `Bearer ${token}` } }),
    ]);

    const summaryData = await summaryRes.json();
    const recData = await recommendationRes.json();
    const logData = await logRes.json();

    setSummary(summaryData.summary || null);
    setRecommendation(recData.recommendation || null);
    setDecisionLogs(logData.decision_logs || []);
  }

  useEffect(() => {
    refreshMetrics();
  }, [token, repoId, branchId]);

  async function saveDecision() {
    if (!token || !repoId || !branchId || !recommendation) return;

    await fetch('/api/dashboard/exploration/decision-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        repo_id: repoId,
        branch_id: branchId,
        recommendation: recommendation.recommendation,
        reasons: recommendation.reasons,
        metrics: summary || {},
      }),
    });

    await refreshMetrics();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Exploration Decision Dashboard</h1>
        <p className="text-sm text-gray-400">Track drill KPIs and log stop/continue/pivot decisions.</p>
      </div>

      <div className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 md:grid-cols-2">
        <select className="rounded border border-white/10 bg-black/40 px-3 py-2 text-sm" value={repoId} onChange={(e) => setRepoId(e.target.value)}>
          {repos.map((repo) => <option key={repo.id} value={repo.id}>{repo.name}</option>)}
        </select>
        <select className="rounded border border-white/10 bg-black/40 px-3 py-2 text-sm" value={branchId} onChange={(e) => setBranchId(e.target.value)}>
          {branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <KpiCard label="Meters drilled" value={Number(summary?.meters_drilled || 0).toLocaleString()} />
        <KpiCard label="Hit rate" value={`${(Number(summary?.hit_rate || 0) * 100).toFixed(1)}%`} />
        <KpiCard label="Cost / target" value={`$${Number(summary?.cost_per_target || 0).toLocaleString()}`} />
        <KpiCard label="Avg confidence" value={`${Number(summary?.avg_confidence || 0).toFixed(1)}`} />
        <KpiCard label="Budget burn" value={`${(Number(summary?.budget_burn_ratio || 0) * 100).toFixed(1)}%`} />
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-medium">Recommendation</h2>
        {recommendation ? (
          <>
            <p className="mt-2 text-2xl font-semibold text-gold-400">{recommendation.recommendation}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-300">
              {recommendation.reasons.map((reason, index) => <li key={`${reason}-${index}`}>{reason}</li>)}
            </ul>
            <button className="mt-4 rounded bg-gold-400 px-4 py-2 text-sm font-medium text-black" onClick={saveDecision}>
              Log decision
            </button>
          </>
        ) : (
          <p className="mt-2 text-sm text-gray-400">No recommendation available yet.</p>
        )}
      </div>

      <div className="rounded-xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-medium">Decision log</h2>
        <div className="mt-3 space-y-2">
          {decisionLogs.map((log) => (
            <div key={log.id} className="rounded border border-white/10 bg-black/30 p-3 text-sm">
              <div className="font-medium text-gold-400">{log.recommendation}</div>
              <div className="text-xs text-gray-500">{new Date(log.decided_at).toLocaleString()}</div>
              <p className="mt-1 text-gray-300">{(log.reasons || []).join(' | ')}</p>
            </div>
          ))}
          {decisionLogs.length === 0 && <p className="text-sm text-gray-400">No decisions logged yet.</p>}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
