import { NextRequest } from 'next/server';
import { queryNoRLS } from '@/lib/db';
import { forbidden, badRequest } from '@/lib/errors';
import type { JWTPayload, MemberRole, WorkspaceMember } from '@/types';

/**
 * Validate that the user has access to the workspace specified in the JWT.
 * Returns the member role.
 */
export async function validateWorkspaceAccess(
  req: NextRequest,
  user: JWTPayload
): Promise<{ workspaceId: string; role: MemberRole }> {
  const workspaceId = user.workspaceId || req.headers.get('x-workspace-id');
  if (!workspaceId) {
    throw badRequest('No workspace context. Include workspaceId in token or x-workspace-id header.');
  }

  // Validate UUID format to prevent injection
  const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_RE.test(workspaceId)) {
    throw badRequest('Invalid workspace ID format');
  }

  const members = await queryNoRLS<WorkspaceMember>(
    'SELECT role FROM workspace_members WHERE workspace_id = $1 AND user_id = $2',
    [workspaceId, user.sub]
  );

  if (members.length === 0) {
    throw forbidden('Not a member of this workspace');
  }

  return { workspaceId, role: members[0].role };
}
