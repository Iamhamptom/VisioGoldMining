'use client';

import { useEffect, useState } from 'react';
import { useApi } from '@/hooks/use-api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AuditEntry {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  email: string;
  display_name: string;
  details: Record<string, unknown>;
  created_at: string;
}

const ACTIONS = [
  'LOGIN', 'LOGOUT', 'REPO_READ', 'REPO_CREATE', 'REPO_UPDATE',
  'BRANCH_CREATE', 'COMMIT_CREATE', 'COMMIT_MERGE',
  'ARTIFACT_UPLOAD', 'ARTIFACT_DOWNLOAD', 'PUBLISH',
  'MEMBER_ADD', 'MEMBER_REMOVE', 'WORKSPACE_CREATE',
];

export function AuditLogViewer() {
  const { apiFetch } = useApi();
  const [entries, setEntries] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionFilter, setActionFilter] = useState<string>('');

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '25' });
      if (actionFilter) params.set('action', actionFilter);
      const data = await apiFetch(`/api/audit?${params}`);
      setEntries(data.entries);
      setTotalPages(data.pagination.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [page, actionFilter]);

  return (
    <div className="space-y-4">
      <div className="flex gap-3 items-center">
        <Select value={actionFilter} onValueChange={(v) => { setActionFilter(v === 'all' ? '' : v); setPage(1); }}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All actions</SelectItem>
            {ACTIONS.map((a) => (
              <SelectItem key={a} value={a}>{a}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="text-muted-foreground">Loading...</div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Time</th>
                <th className="text-left p-3 font-medium">User</th>
                <th className="text-left p-3 font-medium">Action</th>
                <th className="text-left p-3 font-medium">Resource</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry) => (
                <tr key={entry.id} className="border-t">
                  <td className="p-3 text-muted-foreground whitespace-nowrap">
                    {new Date(entry.created_at).toLocaleString()}
                  </td>
                  <td className="p-3">{entry.display_name || entry.email || 'System'}</td>
                  <td className="p-3">
                    <Badge variant="outline">{entry.action}</Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">
                    {entry.resource_type && (
                      <span>{entry.resource_type} {entry.resource_id?.substring(0, 8)}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
        <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
