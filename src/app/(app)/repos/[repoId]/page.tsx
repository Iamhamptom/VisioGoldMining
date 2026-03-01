'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useApi } from '@/hooks/use-api';
import { BranchTabs } from '@/components/branch-tabs';
import { Badge } from '@/components/ui/badge';

interface RepoDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  country: string;
  commodity: string;
  status: string;
  default_branch_id: string;
}

interface BranchInfo {
  id: string;
  name: string;
  visibility: string;
}

export default function RepoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { apiFetch } = useApi();
  const [repo, setRepo] = useState<RepoDetail | null>(null);
  const [branches, setBranches] = useState<BranchInfo[]>([]);

  useEffect(() => {
    apiFetch(`/api/repos/${params.repoId}`)
      .then((data) => {
        setRepo(data.repo);
        setBranches(data.branches);
        // Redirect to default branch
        if (data.repo.default_branch_id) {
          router.replace(`/repos/${params.repoId}/branches/${data.repo.default_branch_id}`);
        }
      })
      .catch(console.error);
  }, [apiFetch, params.repoId, router]);

  if (!repo) {
    return <div className="text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">{repo.name}</h2>
          <Badge>{repo.status}</Badge>
        </div>
        <p className="text-muted-foreground">{repo.description}</p>
        <div className="flex gap-2 mt-1 text-sm text-muted-foreground">
          <span>{repo.country}</span>
          <span>-</span>
          <span>{repo.commodity}</span>
        </div>
      </div>

      <BranchTabs branches={branches} repoId={repo.id} />
    </div>
  );
}
