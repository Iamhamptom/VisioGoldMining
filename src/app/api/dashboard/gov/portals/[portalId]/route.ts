import { NextRequest, NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { updatePortalSchema } from '@/lib/validation';
import { badRequest, notFound } from '@/lib/errors';

// GET /api/dashboard/gov/portals/[portalId] — Portal detail
export const GET = createHandler({
  roles: ['ANALYST', 'ADMIN', 'OWNER'],
  handler: async (_req, ctx) => {
    const { rows } = await ctx.db.query(
      `SELECT p.*, e.name as entity_name, e.entity_type, e.province, e.country
       FROM government_portals p
       JOIN government_entities e ON e.id = p.entity_id
       WHERE p.id = $1 AND p.workspace_id = $2`,
      [ctx.params.portalId, ctx.workspaceId]
    );
    if (rows.length === 0) throw notFound('Portal not found');
    return NextResponse.json({ portal: rows[0] });
  },
});

// PUT /api/dashboard/gov/portals/[portalId] — Update portal config + publish
export const PUT = createHandler({
  roles: ['ADMIN', 'OWNER'],
  audit: { action: 'GOV_PORTAL_UPDATE', resourceType: 'government_portal' },
  handler: async (req, ctx) => {
    const body = await req.json();
    const parsed = updatePortalSchema.safeParse(body);
    if (!parsed.success) throw badRequest(parsed.error.errors[0].message);

    const updates: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    const data = parsed.data as Record<string, unknown>;
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        updates.push(`${key} = $${idx++}`);
        values.push(key === 'featured_sectors' ? value : value);
      }
    }

    // Handle publish toggle
    if (body.published !== undefined) {
      updates.push(`published = $${idx++}`);
      values.push(body.published);
      if (body.published) {
        updates.push(`published_at = NOW()`);
      }
    }

    if (updates.length === 0) throw badRequest('No fields to update');

    updates.push('updated_at = NOW()');
    values.push(ctx.params.portalId, ctx.workspaceId);

    const { rows } = await ctx.db.query(
      `UPDATE government_portals SET ${updates.join(', ')}
       WHERE id = $${idx++} AND workspace_id = $${idx}
       RETURNING *`,
      values
    );

    if (rows.length === 0) throw notFound('Portal not found');
    return NextResponse.json({ portal: rows[0] });
  },
});
