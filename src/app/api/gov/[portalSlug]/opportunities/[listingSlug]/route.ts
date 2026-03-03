import { NextRequest, NextResponse } from 'next/server';
import { createPublicHandler } from '@/lib/handler';
import { getAdminClient } from '@/lib/db';
import { notFound } from '@/lib/errors';

// GET /api/gov/[portalSlug]/opportunities/[listingSlug] — Single listing detail
export const GET = createPublicHandler(async (_req: NextRequest, params) => {
  const client = await getAdminClient();
  try {
    const { rows } = await client.query(
      `SELECT l.*, s.name as sector_name, s.icon as sector_icon,
              e.name as entity_name, e.province as entity_province
       FROM opportunity_listings l
       JOIN opportunity_sectors s ON s.id = l.sector_id
       JOIN government_entities e ON e.id = l.entity_id
       JOIN government_portals p ON p.id = l.portal_id
       WHERE p.slug = $1 AND l.slug = $2 AND l.status = 'published'`,
      [params.portalSlug, params.listingSlug]
    );

    if (rows.length === 0) {
      throw notFound('Listing not found');
    }

    return NextResponse.json({ listing: rows[0] });
  } finally {
    client.release();
  }
});
