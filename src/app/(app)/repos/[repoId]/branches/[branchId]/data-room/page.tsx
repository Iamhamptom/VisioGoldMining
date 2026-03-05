'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/auth-provider';

const DATA_TYPES = ['pdf', 'csv', 'geojson', 'shp', 'assay_table', 'drillhole_table', 'geophysics_grid', 'image', 'other'];

const defaultTargets = [
  { name: 'Target A', geochem_anomaly: 78, structure_score: 68, alteration_score: 62, occurrence_proximity_score: 74, access_score: 58, security_score: 66, data_completeness: 61, planned_meters: 1800, estimated_cost: 220000, latitude: -10.12, longitude: 27.15 },
  { name: 'Target B', geochem_anomaly: 64, structure_score: 71, alteration_score: 57, occurrence_proximity_score: 69, access_score: 52, security_score: 60, data_completeness: 55, planned_meters: 1400, estimated_cost: 180000, latitude: -10.25, longitude: 27.22 },
  { name: 'Target C', geochem_anomaly: 51, structure_score: 47, alteration_score: 49, occurrence_proximity_score: 54, access_score: 45, security_score: 48, data_completeness: 44, planned_meters: 900, estimated_cost: 130000, latitude: -10.3, longitude: 27.01 },
];

export default function DataRoomPage() {
  const params = useParams<{ repoId: string; branchId: string }>();
  const { token } = useAuth();
  const repoId = params.repoId;
  const branchId = params.branchId;

  const [files, setFiles] = useState<FileList | null>(null);
  const [dataType, setDataType] = useState('csv');
  const [country, setCountry] = useState('DRC');
  const [site, setSite] = useState('');
  const [project, setProject] = useState('');
  const [tags, setTags] = useState('');
  const [ingesting, setIngesting] = useState(false);

  const [assets, setAssets] = useState<Array<Record<string, unknown>>>([]);
  const [jobs, setJobs] = useState<Array<Record<string, unknown>>>([]);
  const [targets, setTargets] = useState<Array<Record<string, unknown>>>([]);
  const [scoreRunId, setScoreRunId] = useState<string | null>(null);
  const [drillPlanId, setDrillPlanId] = useState<string | null>(null);
  const [reportJobs, setReportJobs] = useState<Array<Record<string, unknown>>>([]);

  const [targetJson, setTargetJson] = useState(JSON.stringify(defaultTargets, null, 2));
  const [scoring, setScoring] = useState(false);
  const [planning, setPlanning] = useState(false);
  const [reporting, setReporting] = useState(false);
  const [templateType, setTemplateType] = useState('board_technical');

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const refreshAll = useCallback(async () => {
    if (!token) return;

    const [assetsRes, jobsRes, targetsRes, reportsRes] = await Promise.all([
      fetch(`/api/data-room/assets?branchId=${branchId}`, { headers }),
      fetch(`/api/data-room/jobs?branchId=${branchId}`, { headers }),
      fetch(`/api/repos/${repoId}/targets?branchId=${branchId}`, { headers }),
      fetch(`/api/repos/${repoId}/reports?branchId=${branchId}`, { headers }),
    ]);

    const [assetsData, jobsData, targetsData, reportsData] = await Promise.all([
      assetsRes.json(),
      jobsRes.json(),
      targetsRes.json(),
      reportsRes.json(),
    ]);

    setAssets(assetsData.assets || []);
    setJobs(jobsData.jobs || []);
    setTargets(targetsData.targets || []);
    setScoreRunId(targetsData.score_run?.id || null);
    setReportJobs(reportsData.report_jobs || []);
  }, [token, branchId, repoId, headers]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  async function uploadAssets(e: React.FormEvent) {
    e.preventDefault();
    if (!token || !files || files.length === 0) return;

    setIngesting(true);
    const form = new FormData();
    form.append('branchId', branchId);
    form.append('dataType', dataType);
    form.append('country', country);
    form.append('site', site);
    form.append('project', project);
    form.append('tags', tags);

    Array.from(files).forEach((file) => form.append('files', file));

    await fetch('/api/data-room/ingest', {
      method: 'POST',
      headers,
      body: form,
    });

    setIngesting(false);
    await refreshAll();
  }

  async function runTargetScoring() {
    if (!token) return;

    setScoring(true);
    try {
      const parsedTargets = JSON.parse(targetJson);
      const res = await fetch(`/api/repos/${repoId}/targets/score`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `Target scoring ${new Date().toISOString()}`,
          branch_id: branchId,
          targets: parsedTargets,
        }),
      });
      const data = await res.json();
      setScoreRunId(data.score_run?.id || null);
      await refreshAll();
    } finally {
      setScoring(false);
    }
  }

  async function generateDrillPlan() {
    if (!token) return;
    setPlanning(true);
    try {
      const res = await fetch(`/api/repos/${repoId}/drill-plans/generate`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch_id: branchId,
          score_run_id: scoreRunId,
          name: `Drill Plan ${new Date().toLocaleDateString()}`,
        }),
      });
      const data = await res.json();
      setDrillPlanId(data.drill_plan?.id || null);
    } finally {
      setPlanning(false);
    }
  }

  async function generateReport() {
    if (!token) return;
    setReporting(true);
    try {
      await fetch(`/api/repos/${repoId}/reports/generate`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch_id: branchId,
          score_run_id: scoreRunId,
          drill_plan_id: drillPlanId,
          template_type: templateType,
          output_formats: ['pdf', 'pptx'],
          title: `VisioGold ${templateType} ${new Date().toLocaleDateString()}`,
        }),
      });
      await refreshAll();
    } finally {
      setReporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Data Room + Ingestion Engine</h1>
        <p className="text-sm text-gray-400">Upload, normalize, score, plan, and generate investor-ready outputs from one branch workspace.</p>
      </div>

      <form onSubmit={uploadAssets} className="grid gap-3 rounded-xl border border-white/10 bg-white/5 p-4 md:grid-cols-3">
        <input type="file" multiple className="rounded border border-white/10 bg-black/40 px-3 py-2 text-sm" onChange={(e) => setFiles(e.target.files)} />
        <select className="rounded border border-white/10 bg-black/40 px-3 py-2 text-sm" value={dataType} onChange={(e) => setDataType(e.target.value)}>
          {DATA_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
        <input value={country} onChange={(e) => setCountry(e.target.value)} className="rounded border border-white/10 bg-black/40 px-3 py-2 text-sm" placeholder="Country" />
        <input value={site} onChange={(e) => setSite(e.target.value)} className="rounded border border-white/10 bg-black/40 px-3 py-2 text-sm" placeholder="Site" />
        <input value={project} onChange={(e) => setProject(e.target.value)} className="rounded border border-white/10 bg-black/40 px-3 py-2 text-sm" placeholder="Project" />
        <input value={tags} onChange={(e) => setTags(e.target.value)} className="rounded border border-white/10 bg-black/40 px-3 py-2 text-sm" placeholder="Tags (comma-separated)" />
        <button disabled={ingesting} className="rounded bg-gold-400 px-4 py-2 text-sm font-medium text-black md:col-span-3">
          {ingesting ? 'Ingesting...' : 'Ingest files'}
        </button>
      </form>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-lg font-medium">Data Assets ({assets.length})</h2>
          <div className="mt-3 max-h-64 space-y-2 overflow-y-auto">
            {assets.map((asset) => (
              <div key={String(asset.id)} className="rounded border border-white/10 bg-black/30 p-3 text-sm">
                <div className="font-medium">{String(asset.name)}</div>
                <div className="text-xs text-gray-400">{String(asset.data_type)} • latest job: {String(asset.latest_job_status || 'n/a')}</div>
              </div>
            ))}
            {assets.length === 0 && <p className="text-sm text-gray-400">No assets yet.</p>}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-lg font-medium">Ingestion Jobs ({jobs.length})</h2>
          <div className="mt-3 max-h-64 space-y-2 overflow-y-auto">
            {jobs.map((job) => (
              <div key={String(job.id)} className="rounded border border-white/10 bg-black/30 p-3 text-sm">
                <div className="font-medium">{String(job.asset_name || job.id)}</div>
                <div className="text-xs text-gray-400">{String(job.status)} • retries: {String(job.retry_count || 0)}</div>
              </div>
            ))}
            {jobs.length === 0 && <p className="text-sm text-gray-400">No jobs yet.</p>}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-lg font-medium">Target Scoring + Drill Ranking</h2>
          <p className="mt-1 text-sm text-gray-400">Provide target candidates as JSON for deterministic scoring.</p>
          <textarea className="mt-3 h-64 w-full rounded border border-white/10 bg-black/40 p-3 font-mono text-xs" value={targetJson} onChange={(e) => setTargetJson(e.target.value)} />
          <button onClick={runTargetScoring} disabled={scoring} className="mt-3 rounded bg-gold-400 px-4 py-2 text-sm font-medium text-black">
            {scoring ? 'Scoring...' : 'Run scoring'}
          </button>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-lg font-medium">Ranked Targets ({targets.length})</h2>
          <div className="mt-3 max-h-64 space-y-2 overflow-y-auto">
            {targets.map((target) => (
              <div key={String(target.id)} className="rounded border border-white/10 bg-black/30 p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">#{String(target.rank)} {String(target.name)}</span>
                  <span className="text-gold-400">{Number(target.confidence_score || 0).toFixed(1)}</span>
                </div>
                <div className="mt-1 text-xs text-gray-400">Phase {String(target.recommended_phase)} • {(target.reason_codes as string[] || []).join(', ')}</div>
              </div>
            ))}
            {targets.length === 0 && <p className="text-sm text-gray-400">Run a scoring pass to populate targets.</p>}
          </div>
          <div className="mt-3 rounded border border-white/10 bg-black/30 p-3 text-xs text-gray-300">
            <p className="font-medium">Map Overlay Preview</p>
            <p className="mt-1">Targets with coordinates: {targets.filter((t) => t.latitude && t.longitude).length}</p>
          </div>
          <button onClick={generateDrillPlan} disabled={planning || targets.length === 0} className="mt-3 rounded border border-gold-400/40 bg-gold-400/10 px-4 py-2 text-sm text-gold-400 disabled:opacity-50">
            {planning ? 'Generating plan...' : 'Promote to drill plan'}
          </button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-lg font-medium">Auto-Report Generator</h2>
          <select className="mt-3 w-full rounded border border-white/10 bg-black/40 px-3 py-2 text-sm" value={templateType} onChange={(e) => setTemplateType(e.target.value)}>
            <option value="board_technical">Board technical report</option>
            <option value="investor_pack">Investor pack</option>
            <option value="gov_permit_community">Government/permit/community brief</option>
          </select>
          <button onClick={generateReport} disabled={reporting} className="mt-3 rounded bg-gold-400 px-4 py-2 text-sm font-medium text-black">
            {reporting ? 'Generating...' : 'Generate PDF + PPTX'}
          </button>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <h2 className="text-lg font-medium">Report Jobs ({reportJobs.length})</h2>
          <div className="mt-3 max-h-48 space-y-2 overflow-y-auto">
            {reportJobs.map((job) => (
              <div key={String(job.id)} className="rounded border border-white/10 bg-black/30 p-3 text-sm">
                <div className="font-medium">{String(job.template_type)}</div>
                <div className="text-xs text-gray-400">Status: {String(job.status)}</div>
              </div>
            ))}
            {reportJobs.length === 0 && <p className="text-sm text-gray-400">No report jobs yet.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
