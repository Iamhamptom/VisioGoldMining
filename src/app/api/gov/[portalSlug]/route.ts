import { NextRequest, NextResponse } from 'next/server';
import { createPublicHandler } from '@/lib/handler';
import { getAdminClient } from '@/lib/db';
import { notFound } from '@/lib/errors';

// GET /api/gov/[portalSlug] — Public portal config + branding
export const GET = createPublicHandler(async (_req: NextRequest, params) => {
  const client = await getAdminClient();
  try {
    const { rows } = await client.query(
      `SELECT p.*, e.name as entity_name, e.entity_type, e.province, e.country,
              e.location as entity_location, e.population, e.area_km2
       FROM government_portals p
       JOIN government_entities e ON e.id = p.entity_id
       WHERE p.slug = $1 AND p.published = true`,
      [params.portalSlug]
    );

    if (rows.length === 0) {
      throw notFound('Portal not found');
    }

    return NextResponse.json({ portal: rows[0] });
  } finally {
    client.release();
  }
});
