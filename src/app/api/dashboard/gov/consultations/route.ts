import { NextRequest, NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { updateConsultationSchema } from '@/lib/validation';
import { badRequest, notFound } from '@/lib/errors';

// GET /api/dashboard/gov/consultations — Consultation request queue
export const GET = createHandler({
  roles: ['ADMIN', 'OWNER'],
  handler: async (req, ctx) => {
    const url = new URL(req.url);
    const status = url.searchParams.get('status');
    const portalId = url.searchParams.get('portal_id');

    const conditions = ['c.workspace_id = $1'];
    const values: unknown[] = [ctx.workspaceId];
    let idx = 2;

    if (status) { conditions.push(`c.status = $${idx++}`); values.push(status); }
    if (portalId) { conditions.push(`c.portal_id = $${idx++}`); values.push(portalId); }

    const { rows } = await ctx.db.query(
      `SELECT c.*, p.title as portal_title, p.slug as portal_slug,
              l.title as listing_title
       FROM consultation_requests c
       JOIN government_portals p ON p.id = c.portal_id
       LEFT JOIN opportunity_listings l ON l.id = c.listing_id
       WHERE ${conditions.join(' AND ')}
       ORDER BY
         CASE c.priority WHEN 'urgent' THEN 0 WHEN 'high' THEN 1 WHEN 'normal' THEN 2 ELSE 3 END,
         c.created_at DESC`,
      values
    );

    return NextResponse.json({ consultations: rows });
  },
});

// PUT /api/dashboard/gov/consultations — Update consultation
export const PUT = createHandler({
  roles: ['ADMIN', 'OWNER'],
  audit: { action: 'CONSULTATION_UPDATE', resourceType: 'consultation_request' },
  handler: async (req, ctx) => {
    const body = await req.json();
    const parsed = updateConsultationSchema.safeParse(body);
    if (!parsed.success) throw badRequest(parsed.error.errors[0].message);

    const consultationId = body.id;
    if (!consultationId) throw badRequest('Consultation ID required');

    const updates: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    const data = parsed.data as Record<string, unknown>;
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        updates.push(`${key} = $${idx++}`);
        values.push(value);
      }
    }

    if (data.status === 'completed') {
      updates.push(`completed_at = NOW()`);
    }

    if (updates.length === 0) throw badRequest('No fields to update');

    updates.push('updated_at = NOW()');
    values.push(consultationId, ctx.workspaceId);

    const { rows } = await ctx.db.query(
      `UPDATE consultation_requests SET ${updates.join(', ')}
       WHERE id = $${idx++} AND workspace_id = $${idx}
       RETURNING *`,
      values
    );

    if (rows.length === 0) throw notFound('Consultation not found');
    return NextResponse.json({ consultation: rows[0] });
  },
});
