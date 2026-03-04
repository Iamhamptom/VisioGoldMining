'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useApi } from '@/hooks/use-api';
import { DRC_PROJECTS } from '@/data/drc-projects';
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
  const [showProjectFallback, setShowProjectFallback] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/repos')
      .then((data) => {
        setRepos(data.repos || []);
        setShowProjectFallback(!data.repos || data.repos.length === 0);
      })
      .catch(() => setShowProjectFallback(true))
      .finally(() => setLoading(false));
  }, [apiFetch]);

  if (loading) {
    return <div className="text-muted-foreground">Loading repos...</div>;
  }

  if (showProjectFallback) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {DRC_PROJECTS.map((project) => (
          <Link key={project.projectId} href={`/projects/${project.projectId}`}>
            <Card className="cursor-pointer border-gold-400/10 bg-white/5 transition-colors hover:border-gold-400/30 hover:bg-gold-400/5">
              <CardHeader>
                <div className="flex items-center justify-between gap-3">
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <Badge variant="outline">{project.status.replace(/_/g, ' ')}</Badge>
                </div>
                <CardDescription>{project.operator}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <div>{project.location.province}</div>
                <div>
                  {project.totalResourceMoz ? `${project.totalResourceMoz} Moz` : 'Resource pending'} •{' '}
                  {project.averageGrade ? `${project.averageGrade} g/t` : 'Grade pending'}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
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
