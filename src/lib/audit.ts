import { PoolClient } from 'pg';
import type { AuditAction } from '@/types';

interface AuditEventParams {
  workspaceId: string;
  userId: string | null;
  action: AuditAction;
  resourceType?: string;
  resourceId?: string;
  details?: Record<string, unknown>;
  ipAddress?: string | null;
  userAgent?: string | null;
}

/**
 * Log an audit event. Must be called within an RLS-scoped transaction.
 */
export async function logAuditEvent(
  client: PoolClient,
  params: AuditEventParams
): Promise<void> {
  await client.query(
    `INSERT INTO audit_log (workspace_id, user_id, action, resource_type, resource_id, details, ip_address, user_agent)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [
      params.workspaceId,
      params.userId,
      params.action,
      params.resourceType || null,
      params.resourceId || null,
      JSON.stringify(params.details || {}),
      params.ipAddress || null,
      params.userAgent || null,
    ]
  );
}
