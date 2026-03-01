'use client';

import { RepoList } from '@/components/repo-list';
import { RepoCreateModal } from '@/components/repo-create-modal';

export default function ReposPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Repositories</h2>
        <RepoCreateModal onCreated={() => window.location.reload()} />
      </div>
      <RepoList />
    </div>
  );
}
