import type { MemberRole } from '@/types';

const ROLE_HIERARCHY: Record<MemberRole, number> = {
  VIEWER: 0,
  ANALYST: 1,
  ADMIN: 2,
  OWNER: 3,
};

export function hasMinimumRole(
  userRole: MemberRole,
  requiredRole: MemberRole
): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export const PERMISSIONS: Record<string, MemberRole> = {
  'repo:read': 'VIEWER',
  'repo:create': 'ADMIN',
  'repo:update': 'ANALYST',
  'repo:delete': 'OWNER',
  'branch:create': 'ANALYST',
  'branch:publish': 'ADMIN',
  'commit:create': 'ANALYST',
  'commit:merge': 'ADMIN',
  'artifact:upload': 'ANALYST',
  'artifact:read': 'VIEWER',
  'member:manage': 'ADMIN',
  'workspace:update': 'OWNER',
  'audit:read': 'ADMIN',
};

export function hasPermission(
  userRole: MemberRole,
  permission: string
): boolean {
  const requiredRole = PERMISSIONS[permission];
  if (!requiredRole) return false;
  return hasMinimumRole(userRole, requiredRole);
}
