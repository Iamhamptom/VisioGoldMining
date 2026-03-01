'use client';

import { useState } from 'react';
import { useApi } from '@/hooks/use-api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription,
} from '@/components/ui/dialog';
import { Globe } from 'lucide-react';

export function PublishBranchDialog({
  branchId,
  branchName,
  onPublished,
}: {
  branchId: string;
  branchName: string;
  onPublished?: () => void;
}) {
  const { apiFetch } = useApi();
  const [open, setOpen] = useState(false);
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await apiFetch(`/api/branches/${branchId}/publish`, {
        method: 'POST',
        body: JSON.stringify({
          slug: slug || branchName.toLowerCase().replace(/\s+/g, '-'),
          title: title || branchName,
          description,
        }),
      });
      setOpen(false);
      onPublished?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><Globe className="mr-2 h-4 w-4" /> Publish</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Publish Branch</DialogTitle>
          <DialogDescription>Create a public snapshot of the current branch state.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pub-title">Title</Label>
            <Input id="pub-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={branchName} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pub-slug">Public URL Slug</Label>
            <Input id="pub-slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder={branchName.toLowerCase().replace(/\s+/g, '-')} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="pub-desc">Description</Label>
            <Input id="pub-desc" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <DialogFooter>
            <Button type="submit" disabled={loading}>{loading ? 'Publishing...' : 'Publish'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
