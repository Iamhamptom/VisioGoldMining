'use client';

import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface Branch {
  id: string;
  name: string;
  visibility: string;
}

export function BranchTabs({
  branches,
  repoId,
  activeBranchId,
}: {
  branches: Branch[];
  repoId: string;
  activeBranchId?: string;
}) {
  const visibilityColor = (v: string) => {
    switch (v) {
      case 'PUBLIC': return 'default';
      case 'SHARED_WITH_VISIOGOLD': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <Tabs value={activeBranchId} className="w-full">
      <TabsList className="flex-wrap h-auto gap-1 p-1">
        {branches.map((branch) => (
          <Link key={branch.id} href={`/repos/${repoId}/branches/${branch.id}`}>
            <TabsTrigger value={branch.id} className="gap-2">
              {branch.name}
              <Badge variant={visibilityColor(branch.visibility) as 'default' | 'secondary' | 'outline'} className="text-[10px] px-1.5 py-0">
                {branch.visibility === 'SHARED_WITH_VISIOGOLD' ? 'SHARED' : branch.visibility}
              </Badge>
            </TabsTrigger>
          </Link>
        ))}
      </TabsList>
    </Tabs>
  );
}
