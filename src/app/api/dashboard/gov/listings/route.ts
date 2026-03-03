import { NextRequest, NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { createListingSchema } from '@/lib/validation';
import { badRequest } from '@/lib/errors';

// GET /api/dashboard/gov/listings — List opportunity listings
export const GET = createHandler({
  roles: ['ANALYST', 'ADMIN', 'OWNER'],
  handler: async (req, ctx) => {
    const url = new URL(req.url);
    const portalId = url.searchParams.get('portal_id');
    const status = url.searchParams.get('status');
    const sector = url.searchParams.get('sector');

    const conditions = ['l.workspace_id = $1'];
    const values: unknown[] = [ctx.workspaceId];
    let idx = 2;

    if (portalId) { conditions.push(`l.portal_id = $${idx++}`); values.push(portalId); }
    if (status) { conditions.push(`l.status = $${idx++}`); values.push(status); }
    if (sector) { conditions.push(`l.sector_id = $${idx++}`); values.push(sector); }

    const { rows } = await ctx.db.query(
      `SELECT l.*, s.name as sector_name, s.icon as sector_icon,
              p.title as portal_title, p.slug as portal_slug
       FROM opportunity_listings l
       JOIN opportunity_sectors s ON s.id = l.sector_id
       JOIN government_portals p ON p.id = l.portal_id
       WHERE ${conditions.join(' AND ')}
       ORDER BY l.updated_at DESC`,
      values
    );

    return NextResponse.json({ listings: rows });
  },
});

// POST /api/dashboard/gov/listings — Create listing
export const POST = createHandler({
  roles: ['ANALYST', 'ADMIN', 'OWNER'],
  audit: { action: 'LISTING_CREATE', resourceType: 'opportunity_listing' },
  handler: async (req, ctx) => {
    const body = await req.json();
    const parsed = createListingSchema.safeParse(body);
    if (!parsed.success) throw badRequest(parsed.error.errors[0].message);

    const d = parsed.data;
    const { rows: [listing] } = await ctx.db.query(
      `INSERT INTO opportunity_listings (
        workspace_id, portal_id, entity_id, title, slug, summary, description,
        sector_id, province, location, area_hectares,
        investment_min, investment_max, currency, expected_roi, timeline_months,
        key_facts, documents, images, tags, created_by
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21) RETURNING *`,
      [
        ctx.workspaceId, d.portal_id, d.entity_id, d.title, d.slug,
        d.summary || null, d.description || null, d.sector_id,
        d.province || null, d.location ? JSON.stringify(d.location) : null,
        d.area_hectares || null, d.investment_min || null, d.investment_max || null,
        d.currency, d.expected_roi || null, d.timeline_months || null,
        JSON.stringify(d.key_facts), JSON.stringify(d.documents),
        JSON.stringify(d.images), d.tags, ctx.user.sub,
      ]
    );

    return NextResponse.json({ listing }, { status: 201 });
  },
});
