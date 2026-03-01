import { NextRequest } from 'next/server';
import { PoolClient } from 'pg';
import { logAuditEvent } from '@/lib/audit';
import type { AuditAction } from '@/types';

/**
 * Log an audit event after a successful handler execution.
 */
export async function auditAction(
  client: PoolClient,
  req: NextRequest,
  params: {
    workspaceId: string;
    userId: string;
    action: AuditAction;
    resourceType?: string;
    resourceId?: string;
    details?: Record<string, unknown>;
  }
): Promise<void> {
  await logAuditEvent(client, {
    workspaceId: params.workspaceId,
    userId: params.userId,
    action: params.action,
    resourceType: params.resourceType,
    resourceId: params.resourceId,
    details: params.details,
    ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
    userAgent: req.headers.get('user-agent'),
  });
}
