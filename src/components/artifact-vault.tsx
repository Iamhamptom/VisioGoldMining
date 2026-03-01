'use client';

import { FileText, Database, Map, BarChart3, ClipboardList, StickyNote, ShieldAlert, FileSpreadsheet, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Artifact {
  id: string;
  title: string;
  filename: string;
  type: string;
  sha256: string;
  size_bytes: number;
  created_at: string;
  created_by_name: string;
}

const typeIcons: Record<string, React.ReactNode> = {
  DOCUMENT: <FileText className="h-4 w-4" />,
  DATASET: <Database className="h-4 w-4" />,
  PLAN: <Map className="h-4 w-4" />,
  SIMULATION: <BarChart3 className="h-4 w-4" />,
  TASKS: <ClipboardList className="h-4 w-4" />,
  NOTE: <StickyNote className="h-4 w-4" />,
  RISK_REGISTER: <ShieldAlert className="h-4 w-4" />,
  VENDOR_REPORT: <FileSpreadsheet className="h-4 w-4" />,
};

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export function ArtifactVault({ artifacts }: { artifacts: Artifact[] }) {
  if (artifacts.length === 0) {
    return <div className="text-muted-foreground text-sm py-4">No artifacts yet.</div>;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-3 font-medium">Artifact</th>
            <th className="text-left p-3 font-medium">Type</th>
            <th className="text-left p-3 font-medium">Size</th>
            <th className="text-left p-3 font-medium">SHA-256</th>
            <th className="text-right p-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {artifacts.map((artifact) => (
            <tr key={artifact.id} className="border-t">
              <td className="p-3">
                <div className="flex items-center gap-2">
                  {typeIcons[artifact.type] || <FileText className="h-4 w-4" />}
                  <div>
                    <p className="font-medium">{artifact.title}</p>
                    <p className="text-xs text-muted-foreground">{artifact.filename}</p>
                  </div>
                </div>
              </td>
              <td className="p-3">
                <Badge variant="outline">{artifact.type}</Badge>
              </td>
              <td className="p-3 text-muted-foreground">{formatBytes(artifact.size_bytes)}</td>
              <td className="p-3">
                <code className="text-xs text-muted-foreground">{artifact.sha256.substring(0, 12)}...</code>
              </td>
              <td className="p-3 text-right">
                <Button variant="ghost" size="sm" asChild>
                  <a href={`/api/artifacts/${artifact.id}?download=true`}>
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
