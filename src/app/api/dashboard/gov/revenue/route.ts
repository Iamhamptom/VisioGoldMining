import { NextRequest, NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { createRevenueEventSchema } from '@/lib/validation';
import { badRequest } from '@/lib/errors';

// GET /api/dashboard/gov/revenue — Revenue summary + events
export const GET = createHandler({
  roles: ['ADMIN', 'OWNER'],
  handler: async (req, ctx) => {
    const url = new URL(req.url);
    const portalId = url.searchParams.get('portal_id');

    const conditions = ['r.workspace_id = $1'];
    const values: unknown[] = [ctx.workspaceId];
    let idx = 2;

    if (portalId) { conditions.push(`r.portal_id = $${idx++}`); values.push(portalId); }

    const [eventsResult, summaryResult] = await Promise.all([
      ctx.db.query(
        `SELECT r.*, p.title as portal_title
         FROM revenue_events r
         JOIN government_portals p ON p.id = r.portal_id
         WHERE ${conditions.join(' AND ')}
         ORDER BY r.created_at DESC
         LIMIT 100`,
        values
      ),
      ctx.db.query(
        `SELECT * FROM revenue_monthly_summary
         WHERE workspace_id = $1
         ${portalId ? 'AND portal_id = $2' : ''}
         ORDER BY month DESC
         LIMIT 12`,
        portalId ? [ctx.workspaceId, portalId] : [ctx.workspaceId]
      ),
    ]);

    return NextResponse.json({
      events: eventsResult.rows,
      monthly_summary: summaryResult.rows,
    });
  },
});

// POST /api/dashboard/gov/revenue — Record revenue event
export const POST = createHandler({
  roles: ['ADMIN', 'OWNER'],
  audit: { action: 'REVENUE_CREATE', resourceType: 'revenue_event' },
  handler: async (req, ctx) => {
    const body = await req.json();
    const parsed = createRevenueEventSchema.safeParse(body);
    if (!parsed.success) throw badRequest(parsed.error.errors[0].message);

    const d = parsed.data;
    const { rows: [event] } = await ctx.db.query(
      `INSERT INTO revenue_events (
        workspace_id, portal_id, listing_id, investor_id,
        event_type, description, gross_amount, currency, platform_rate,
        reference_id, notes, created_by
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
      [
        ctx.workspaceId, d.portal_id, d.listing_id || null, d.investor_id || null,
        d.event_type, d.description || null, d.gross_amount, d.currency,
        d.platform_rate, d.reference_id || null, d.notes || null, ctx.user.sub,
      ]
    );

    return NextResponse.json({ event }, { status: 201 });
  },
});
