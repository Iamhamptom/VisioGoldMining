import { NextRequest, NextResponse } from 'next/server';
import { PoolClient } from 'pg';
import { MOCK_MODE, getMockDbClient, withRLS } from '@/lib/db';
import { extractAuth } from '@/lib/middleware/with-auth';
import { validateWorkspaceAccess } from '@/lib/middleware/with-workspace';
import { checkRole } from '@/lib/middleware/with-role';
import { auditAction } from '@/lib/middleware/with-audit';
import { errorResponse } from '@/lib/errors';
import type { JWTPayload, MemberRole, AuditAction } from '@/types';

export interface HandlerContext {
  user: JWTPayload;
  workspaceId: string;
  role: MemberRole;
  db: PoolClient;
  params: Record<string, string>;
}

interface HandlerOptions {
  auth?: boolean;
  workspace?: boolean;
  roles?: MemberRole[];
  audit?: { action: AuditAction; resourceType?: string };
  handler: (
    req: NextRequest,
    ctx: HandlerContext
  ) => Promise<NextResponse>;
}

/**
 * Create a Next.js route handler with composable middleware.
 *
 * Usage:
 * ```
 * export const POST = createHandler({
 *   auth: true,
 *   workspace: true,
 *   roles: ['ADMIN', 'OWNER'],
 *   audit: { action: 'REPO_CREATE', resourceType: 'repo' },
 *   handler: async (req, ctx) => { ... }
 * });
 * ```
 */
export function createHandler(options: HandlerOptions) {
  return async (
    req: NextRequest,
    routeCtx: { params: Promise<Record<string, string>> }
  ) => {
    try {
      const params = await routeCtx.params;
      let user: JWTPayload = { sub: '', email: '', workspaceId: '', role: 'VIEWER' };
      let workspaceId = '';
      let role: MemberRole = 'VIEWER';

      // Auth middleware
      if (options.auth !== false) {
        user = await extractAuth(req);
      }

      // Workspace middleware
      if (options.workspace !== false && options.auth !== false) {
        if (MOCK_MODE) {
          workspaceId = user.workspaceId || req.headers.get('x-workspace-id') || '';
          role = user.role;
        } else {
          const access = await validateWorkspaceAccess(req, user);
          workspaceId = access.workspaceId;
          role = access.role;
        }
      }

      // Role check
      if (options.roles && options.roles.length > 0) {
        const minRole = options.roles.reduce((min, r) => {
          const hierarchy: Record<MemberRole, number> = { VIEWER: 0, ANALYST: 1, ADMIN: 2, OWNER: 3 };
          return hierarchy[r] < hierarchy[min] ? r : min;
        }, options.roles[0]);
        checkRole(role, minRole);
      }

      const execute = async (db: PoolClient) => {
        const ctx: HandlerContext = { user, workspaceId, role, db, params };
        const response = await options.handler(req, ctx);

        // Audit logging (within the same transaction)
        if (!MOCK_MODE && options.audit && response.status >= 200 && response.status < 300) {
          await auditAction(db, req, {
            workspaceId,
            userId: user.sub,
            action: options.audit.action,
            resourceType: options.audit.resourceType,
          });
        }

        return response;
      };

      // In mock mode we bypass workspace validation queries + RLS entirely.
      if (MOCK_MODE) {
        return await execute(getMockDbClient());
      }

      const result = await withRLS(workspaceId, user.sub, execute);

      return result;
    } catch (error) {
      return errorResponse(error);
    }
  };
}

/**
 * Create a public handler (no auth, no RLS).
 */
export function createPublicHandler(
  handler: (req: NextRequest, params: Record<string, string>) => Promise<NextResponse>
) {
  return async (
    req: NextRequest,
    routeCtx: { params: Promise<Record<string, string>> }
  ) => {
    try {
      const params = await routeCtx.params;
      return await handler(req, params);
    } catch (error) {
      return errorResponse(error);
    }
  };
}
