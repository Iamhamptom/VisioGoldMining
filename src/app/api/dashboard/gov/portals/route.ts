import { NextRequest, NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { createPortalSchema } from '@/lib/validation';
import { badRequest } from '@/lib/errors';

// GET /api/dashboard/gov/portals — List portals
export const GET = createHandler({
  roles: ['ANALYST', 'ADMIN', 'OWNER'],
  handler: async (_req, ctx) => {
    const { rows } = await ctx.db.query(
      `SELECT p.*, e.name as entity_name, e.entity_type
       FROM government_portals p
       JOIN government_entities e ON e.id = p.entity_id
       WHERE p.workspace_id = $1
       ORDER BY p.created_at DESC`,
      [ctx.workspaceId]
    );
    return NextResponse.json({ portals: rows });
  },
});

// POST /api/dashboard/gov/portals — Create portal
export const POST = createHandler({
  roles: ['ADMIN', 'OWNER'],
  audit: { action: 'GOV_PORTAL_CREATE', resourceType: 'government_portal' },
  handler: async (req, ctx) => {
    const body = await req.json();
    const parsed = createPortalSchema.safeParse(body);
    if (!parsed.success) throw badRequest(parsed.error.errors[0].message);

    const d = parsed.data;
    const { rows: [portal] } = await ctx.db.query(
      `INSERT INTO government_portals (
        workspace_id, entity_id, slug, title, subtitle, description,
        logo_url, banner_url, primary_color, secondary_color, accent_color,
        contact_email, contact_phone, website_url,
        featured_sectors, hero_text, about_text
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17) RETURNING *`,
      [
        ctx.workspaceId, d.entity_id, d.slug, d.title, d.subtitle || null,
        d.description || null, d.logo_url || null, d.banner_url || null,
        d.primary_color, d.secondary_color, d.accent_color,
        d.contact_email || null, d.contact_phone || null, d.website_url || null,
        d.featured_sectors, d.hero_text || null, d.about_text || null,
      ]
    );

    return NextResponse.json({ portal }, { status: 201 });
  },
});
