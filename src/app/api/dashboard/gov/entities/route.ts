import { NextRequest, NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { createEntitySchema } from '@/lib/validation';
import { badRequest } from '@/lib/errors';

// GET /api/dashboard/gov/entities — List government entities
export const GET = createHandler({
  roles: ['ANALYST', 'ADMIN', 'OWNER'],
  handler: async (_req, ctx) => {
    const { rows } = await ctx.db.query(
      `SELECT * FROM government_entities
       WHERE workspace_id = $1
       ORDER BY entity_type, name`,
      [ctx.workspaceId]
    );
    return NextResponse.json({ entities: rows });
  },
});

// POST /api/dashboard/gov/entities — Create government entity
export const POST = createHandler({
  roles: ['ADMIN', 'OWNER'],
  audit: { action: 'GOV_ENTITY_CREATE', resourceType: 'government_entity' },
  handler: async (req, ctx) => {
    const body = await req.json();
    const parsed = createEntitySchema.safeParse(body);
    if (!parsed.success) throw badRequest(parsed.error.errors[0].message);

    const d = parsed.data;
    const { rows: [entity] } = await ctx.db.query(
      `INSERT INTO government_entities (
        workspace_id, name, slug, entity_type, parent_id, province, country,
        location, population, area_km2
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
      [
        ctx.workspaceId, d.name, d.slug, d.entity_type, d.parent_id || null,
        d.province || null, d.country, d.location ? JSON.stringify(d.location) : null,
        d.population || null, d.area_km2 || null,
      ]
    );

    return NextResponse.json({ entity }, { status: 201 });
  },
});
