import { NextRequest, NextResponse } from 'next/server';
import { createPublicHandler } from '@/lib/handler';
import { getAdminClient } from '@/lib/db';
import { trackAnalyticsSchema } from '@/lib/validation';
import { badRequest, notFound } from '@/lib/errors';

// POST /api/gov/[portalSlug]/analytics — Track portal analytics event
export const POST = createPublicHandler(async (req: NextRequest, params) => {
  const client = await getAdminClient();
  try {
    const body = await req.json();
    const parsed = trackAnalyticsSchema.safeParse(body);
    if (!parsed.success) {
      throw badRequest(parsed.error.errors[0].message);
    }

    // Verify portal exists
    const { rows: portals } = await client.query(
      'SELECT id FROM government_portals WHERE slug = $1 AND published = true',
      [params.portalSlug]
    );
    if (portals.length === 0) throw notFound('Portal not found');
    const portalId = portals[0].id;

    const data = parsed.data;
    const userAgent = req.headers.get('user-agent') || null;
    const referrer = req.headers.get('referer') || null;

    await client.query(
      `INSERT INTO portal_analytics_events (
        portal_id, listing_id, event_type, referrer, user_agent, session_id, metadata
      ) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [portalId, data.listing_id || null, data.event_type, referrer, userAgent, data.session_id || null, data.metadata || {}]
    );

    return NextResponse.json({ tracked: true });
  } finally {
    client.release();
  }
});
