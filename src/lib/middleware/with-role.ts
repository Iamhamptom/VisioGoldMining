import { hasMinimumRole } from '@/lib/rbac';
import { forbidden } from '@/lib/errors';
import type { MemberRole } from '@/types';

/**
 * Check that the user's role meets the minimum required role.
 */
export function checkRole(
  userRole: MemberRole,
  requiredRole: MemberRole
): void {
  if (!hasMinimumRole(userRole, requiredRole)) {
    throw forbidden(`Requires ${requiredRole} role or higher`);
  }
}
