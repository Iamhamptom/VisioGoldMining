'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArtifactVault } from '@/components/artifact-vault';

interface Snapshot {
  title: string;
  description: string;
  repo_name: string;
  country: string;
  commodity: string;
  branch_name: string;
  published_by_name: string;
  published_at: string;
}

export default function PublicSnapshotPage() {
  const params = useParams();
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [artifacts, setArtifacts] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      fetch(`/api/public/${params.slug}`).then((r) => r.json()),
      fetch(`/api/public/${params.slug}/artifacts`).then((r) => r.json()),
    ])
      .then(([snapData, artData]) => {
        if (snapData.error) {
          setError(snapData.error);
        } else {
          setSnapshot(snapData.snapshot);
          setArtifacts(artData.artifacts || []);
        }
      })
      .catch(() => setError('Failed to load snapshot'));
  }, [params.slug]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!snapshot) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Badge>PUBLIC</Badge>
            <Badge variant="secondary">{snapshot.repo_name}</Badge>
          </div>
          <CardTitle className="text-2xl">{snapshot.title}</CardTitle>
          <CardDescription>{snapshot.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span>Branch: {snapshot.branch_name}</span>
            <span>Published by: {snapshot.published_by_name}</span>
            <span>{new Date(snapshot.published_at).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Artifacts</h3>
        <ArtifactVault artifacts={artifacts} />
      </div>
    </div>
  );
}
