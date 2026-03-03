import { NextRequest, NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { updateListingSchema } from '@/lib/validation';
import { badRequest, notFound } from '@/lib/errors';

// GET /api/dashboard/gov/listings/[listingId] — Listing detail
export const GET = createHandler({
  roles: ['ANALYST', 'ADMIN', 'OWNER'],
  handler: async (_req, ctx) => {
    const { rows } = await ctx.db.query(
      `SELECT l.*, s.name as sector_name, s.icon as sector_icon,
              p.title as portal_title, p.slug as portal_slug,
              e.name as entity_name
       FROM opportunity_listings l
       JOIN opportunity_sectors s ON s.id = l.sector_id
       JOIN government_portals p ON p.id = l.portal_id
       JOIN government_entities e ON e.id = l.entity_id
       WHERE l.id = $1 AND l.workspace_id = $2`,
      [ctx.params.listingId, ctx.workspaceId]
    );
    if (rows.length === 0) throw notFound('Listing not found');
    return NextResponse.json({ listing: rows[0] });
  },
});

// PUT /api/dashboard/gov/listings/[listingId] — Update listing
export const PUT = createHandler({
  roles: ['ANALYST', 'ADMIN', 'OWNER'],
  audit: { action: 'LISTING_UPDATE', resourceType: 'opportunity_listing' },
  handler: async (req, ctx) => {
    const body = await req.json();
    const parsed = updateListingSchema.safeParse(body);
    if (!parsed.success) throw badRequest(parsed.error.errors[0].message);

    const updates: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    const jsonFields = new Set(['key_facts', 'documents', 'images', 'location']);
    const data = parsed.data as Record<string, unknown>;

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        updates.push(`${key} = $${idx++}`);
        values.push(jsonFields.has(key) ? JSON.stringify(value) : value);
      }
    }

    if (updates.length === 0) throw badRequest('No fields to update');

    updates.push('updated_at = NOW()');
    values.push(ctx.params.listingId, ctx.workspaceId);

    const { rows } = await ctx.db.query(
      `UPDATE opportunity_listings SET ${updates.join(', ')}
       WHERE id = $${idx++} AND workspace_id = $${idx}
       RETURNING *`,
      values
    );

    if (rows.length === 0) throw notFound('Listing not found');
    return NextResponse.json({ listing: rows[0] });
  },
});
