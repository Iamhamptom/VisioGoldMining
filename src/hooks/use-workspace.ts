'use client';

import { useAuth } from '@/context/auth-provider';

export function useWorkspace() {
  const { currentWorkspace, workspaces, switchWorkspace } = useAuth();

  return {
    workspaceId: currentWorkspace?.id || '',
    role: currentWorkspace?.role || 'VIEWER',
    workspaces,
    switchWorkspace,
  };
}
