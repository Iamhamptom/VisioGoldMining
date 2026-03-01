'use client';

import { useState, useRef } from 'react';
import { useApi } from '@/hooks/use-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload } from 'lucide-react';

const ARTIFACT_TYPES = [
  'DOCUMENT', 'DATASET', 'PLAN', 'SIMULATION',
  'TASKS', 'NOTE', 'RISK_REGISTER', 'VENDOR_REPORT',
];

export function ArtifactUpload({
  branchId,
  onUploaded,
}: {
  branchId: string;
  onUploaded?: () => void;
}) {
  const { apiFetch } = useApi();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('DOCUMENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    if (!file || !title) return;

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      formData.append('type', type);

      await apiFetch(`/api/branches/${branchId}/artifacts`, {
        method: 'POST',
        body: formData,
      });

      setTitle('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      onUploaded?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3 p-4 border rounded-lg bg-muted/30">
      <div className="space-y-1.5">
        <Label htmlFor="artifact-title">Title</Label>
        <Input id="artifact-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Artifact title" required />
      </div>
      <div className="space-y-1.5">
        <Label>Type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ARTIFACT_TYPES.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="artifact-file">File</Label>
        <Input id="artifact-file" type="file" ref={fileInputRef} required />
      </div>
      <Button type="submit" disabled={loading}>
        <Upload className="mr-2 h-4 w-4" />
        {loading ? 'Uploading...' : 'Upload'}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </form>
  );
}
