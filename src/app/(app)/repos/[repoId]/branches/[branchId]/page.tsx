'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useApi } from '@/hooks/use-api';
import { CommitTimeline } from '@/components/commit-timeline';
import { ArtifactVault } from '@/components/artifact-vault';
import { ArtifactUpload } from '@/components/artifact-upload';
import { PublishBranchDialog } from '@/components/publish-branch-dialog';
import { BranchTabs } from '@/components/branch-tabs';
import { Badge } from '@/components/ui/badge';

export default function BranchPage() {
  const params = useParams();
  const { apiFetch } = useApi();
  const [branch, setBranch] = useState<{ id: string; name: string; visibility: string } | null>(null);
  const [branches, setBranches] = useState<{ id: string; name: string; visibility: string }[]>([]);
  const [commits, setCommits] = useState([]);
  const [artifacts, setArtifacts] = useState([]);
  const [reportJobs, setReportJobs] = useState<{ id: string; template_type: string; status: string; created_at: string }[]>([]);
  const [repo, setRepo] = useState<{ id: string; name: string } | null>(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [repoData, commitsData, artifactsData, reportsData] = await Promise.all([
        apiFetch(`/api/repos/${params.repoId}`),
        apiFetch(`/api/branches/${params.branchId}/commits`),
        apiFetch(`/api/branches/${params.branchId}/artifacts`),
        apiFetch(`/api/repos/${params.repoId}/reports?branchId=${params.branchId}`),
      ]);
      setRepo(repoData.repo);
      setBranches(repoData.branches);
      setBranch(repoData.branches.find((b: { id: string }) => b.id === params.branchId) || null);
      setCommits(commitsData.commits);
      setArtifacts(artifactsData.artifacts);
      setReportJobs((reportsData as { report_jobs?: { id: string; template_type: string; status: string; created_at: string }[] }).report_jobs || []);
    } catch (err) {
      console.error(err);
    }
  }, [apiFetch, params.repoId, params.branchId]);

  const handleGenerateReport = useCallback(async () => {
    try {
      setGeneratingReport(true);
      await apiFetch(`/api/repos/${params.repoId}/reports/generate`, {
        method: 'POST',
        body: JSON.stringify({
          branch_id: params.branchId,
          template_type: 'board_technical',
          output_formats: ['pdf', 'pptx'],
          title: `Branch report ${new Date().toLocaleDateString()}`,
        }),
      });
      await fetchData();
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingReport(false);
    }
  }, [apiFetch, fetchData, params.branchId, params.repoId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (!branch || !repo) {
    return <div className="text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">{repo.name}</h2>
        <div className="flex items-center gap-2 mt-1">
          <Badge variant="outline">{branch.name}</Badge>
          <Badge variant="secondary">{branch.visibility}</Badge>
        </div>
      </div>

      <BranchTabs
        branches={branches}
        repoId={params.repoId as string}
        activeBranchId={params.branchId as string}
      />

      <div className="flex gap-2">
        <Link
          href={`/repos/${params.repoId}/branches/${params.branchId}/data-room`}
          className="inline-flex items-center rounded-md border border-gold-400/30 bg-gold-400/10 px-3 py-2 text-sm text-gold-400 hover:bg-gold-400/20"
        >
          Open Data Room
        </Link>
        <Link
          href={`/dashboard/exploration`}
          className="inline-flex items-center rounded-md border border-white/20 px-3 py-2 text-sm text-gray-300 hover:text-white"
        >
          Exploration Dashboard
        </Link>
        <PublishBranchDialog
          branchId={branch.id}
          branchName={branch.name}
          onPublished={fetchData}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Auto-Reports</h3>
          <button
            onClick={handleGenerateReport}
            disabled={generatingReport}
            className="rounded-md border border-gold-400/30 bg-gold-400/10 px-3 py-2 text-sm text-gold-400 hover:bg-gold-400/20 disabled:opacity-50"
          >
            {generatingReport ? 'Generating...' : 'Generate Board Report'}
          </button>
        </div>
        {reportJobs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No report jobs yet.</p>
        ) : (
          <div className="space-y-2">
            {reportJobs.map((job) => (
              <div key={job.id} className="rounded-md border border-white/10 bg-muted/20 px-3 py-2 text-sm">
                <span className="font-medium">{job.template_type}</span>
                <span className="ml-2 text-xs text-muted-foreground">{job.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Artifacts</h3>
        <ArtifactUpload branchId={branch.id} onUploaded={fetchData} />
        <ArtifactVault artifacts={artifacts} />
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Commits</h3>
        <CommitTimeline commits={commits} />
      </div>
    </div>
  );
}
