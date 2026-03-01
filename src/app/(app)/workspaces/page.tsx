'use client';

import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/use-api';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WorkspaceInfo {
  id: string;
  name: string;
  slug: string;
  role: string;
  created_at: string;
}

export default function WorkspacesPage() {
  const { apiFetch } = useApi();
  const [workspaces, setWorkspaces] = useState<WorkspaceInfo[]>([]);

  useEffect(() => {
    apiFetch('/api/workspaces')
      .then((data) => setWorkspaces(data.workspaces))
      .catch(console.error);
  }, [apiFetch]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Workspaces</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {workspaces.map((ws) => (
          <Card key={ws.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{ws.name}</CardTitle>
                <Badge>{ws.role}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Slug: {ws.slug}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
