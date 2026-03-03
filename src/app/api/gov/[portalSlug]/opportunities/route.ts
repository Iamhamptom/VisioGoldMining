import { NextRequest, NextResponse } from 'next/server';
import { createPublicHandler } from '@/lib/handler';
import { getAdminClient } from '@/lib/db';
import { notFound } from '@/lib/errors';

// GET /api/gov/[portalSlug]/opportunities — Published listings with filters
export const GET = createPublicHandler(async (req: NextRequest, params) => {
  const client = await getAdminClient();
  try {
    // Verify portal exists and is published
    const { rows: portals } = await client.query(
      'SELECT id FROM government_portals WHERE slug = $1 AND published = true',
      [params.portalSlug]
    );
    if (portals.length === 0) throw notFound('Portal not found');
    const portalId = portals[0].id;

    const url = new URL(req.url);
    const sector = url.searchParams.get('sector');
    const minInvestment = url.searchParams.get('min_investment');
    const maxInvestment = url.searchParams.get('max_investment');
    const province = url.searchParams.get('province');
    const sort = url.searchParams.get('sort') || 'score';
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50);
    const offset = (page - 1) * limit;

    const conditions: string[] = ['l.portal_id = $1', "l.status = 'published'"];
    const values: unknown[] = [portalId];
    let paramIdx = 2;

    if (sector) {
      conditions.push(`l.sector_id = $${paramIdx++}`);
      values.push(sector);
    }
    if (minInvestment) {
      conditions.push(`l.investment_max >= $${paramIdx++}`);
      values.push(parseFloat(minInvestment));
    }
    if (maxInvestment) {
      conditions.push(`l.investment_min <= $${paramIdx++}`);
      values.push(parseFloat(maxInvestment));
    }
    if (province) {
      conditions.push(`l.province = $${paramIdx++}`);
      values.push(province);
    }

    const orderBy = sort === 'newest' ? 'l.published_at DESC'
      : sort === 'investment' ? 'l.investment_min ASC'
      : 'l.score_overall DESC NULLS LAST';

    const where = conditions.join(' AND ');

    const [{ rows }, { rows: countRows }] = await Promise.all([
      client.query(
        `SELECT l.*, s.name as sector_name, s.icon as sector_icon
         FROM opportunity_listings l
         JOIN opportunity_sectors s ON s.id = l.sector_id
         WHERE ${where}
         ORDER BY ${orderBy}
         LIMIT $${paramIdx++} OFFSET $${paramIdx}`,
        [...values, limit, offset]
      ),
      client.query(
        `SELECT COUNT(*) as total FROM opportunity_listings l WHERE ${where}`,
        values
      ),
    ]);

    return NextResponse.json({
      listings: rows,
      pagination: {
        page,
        limit,
        total: parseInt(countRows[0].total),
        pages: Math.ceil(parseInt(countRows[0].total) / limit),
      },
    });
  } finally {
    client.release();
  }
});
