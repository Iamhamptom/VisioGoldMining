'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
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
  const [repo, setRepo] = useState<{ id: string; name: string } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [repoData, commitsData, artifactsData] = await Promise.all([
        apiFetch(`/api/repos/${params.repoId}`),
        apiFetch(`/api/branches/${params.branchId}/commits`),
        apiFetch(`/api/branches/${params.branchId}/artifacts`),
      ]);
      setRepo(repoData.repo);
      setBranches(repoData.branches);
      setBranch(repoData.branches.find((b: { id: string }) => b.id === params.branchId) || null);
      setCommits(commitsData.commits);
      setArtifacts(artifactsData.artifacts);
    } catch (err) {
      console.error(err);
    }
  }, [apiFetch, params.repoId, params.branchId]);

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
        <PublishBranchDialog
          branchId={branch.id}
          branchName={branch.name}
          onPublished={fetchData}
        />
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
