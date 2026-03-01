'use client';

import { GitCommit } from 'lucide-react';

interface Commit {
  id: string;
  message: string;
  committed_by_name: string;
  committed_at: string;
  merge_source_commit_id: string | null;
}

export function CommitTimeline({ commits }: { commits: Commit[] }) {
  if (commits.length === 0) {
    return <div className="text-muted-foreground text-sm py-4">No commits yet.</div>;
  }

  return (
    <div className="space-y-0">
      {commits.map((commit, i) => (
        <div key={commit.id} className="flex gap-3 pb-4">
          <div className="flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-background">
              <GitCommit className="h-4 w-4" />
            </div>
            {i < commits.length - 1 && <div className="w-px flex-1 bg-border" />}
          </div>
          <div className="flex-1 pt-1">
            <p className="text-sm font-medium">{commit.message}</p>
            <div className="flex gap-2 text-xs text-muted-foreground mt-1">
              <span>{commit.committed_by_name || 'Unknown'}</span>
              <span>{new Date(commit.committed_at).toLocaleString()}</span>
              {commit.merge_source_commit_id && (
                <span className="text-primary font-medium">merge commit</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground font-mono mt-0.5">
              {commit.id.substring(0, 8)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
