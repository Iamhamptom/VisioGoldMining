'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApi } from '@/hooks/use-api';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Repo {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  country: string;
  commodity: string;
  status: string;
  created_at: string;
}

export function RepoList() {
  const { apiFetch } = useApi();
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/repos')
      .then((data) => setRepos(data.repos))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [apiFetch]);

  if (loading) {
    return <div className="text-muted-foreground">Loading repos...</div>;
  }

  if (repos.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No repos yet. Create one to get started.
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {repos.map((repo) => (
        <Link key={repo.id} href={`/repos/${repo.id}`}>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{repo.name}</CardTitle>
                <Badge variant={repo.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {repo.status}
                </Badge>
              </div>
              <CardDescription>{repo.description || 'No description'}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span>{repo.country}</span>
                <span>-</span>
                <span>{repo.commodity}</span>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
