'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/auth-provider';

export function WorkspaceSwitcher() {
  const { workspaces, currentWorkspace, switchWorkspace } = useAuth();

  if (workspaces.length === 0) return null;

  return (
    <Select value={currentWorkspace?.id || ''} onValueChange={switchWorkspace}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select workspace" />
      </SelectTrigger>
      <SelectContent>
        {workspaces.map((ws) => (
          <SelectItem key={ws.id} value={ws.id}>
            {ws.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
