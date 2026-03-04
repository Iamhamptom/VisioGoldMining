import { NextRequest, NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';

export const dynamic = 'force-dynamic';

// GET /api/dashboard/gov/analytics — Portal analytics dashboard data
export const GET = createHandler({
  roles: ['ADMIN', 'OWNER'],
  handler: async (req, ctx) => {
    const url = new URL(req.url);
    const portalId = url.searchParams.get('portal_id');
    const days = parseInt(url.searchParams.get('days') || '30');

    const portalCondition = portalId ? 'AND d.portal_id = $2' : '';
    const params = portalId ? [ctx.workspaceId, portalId] : [ctx.workspaceId];

    const [dailyResult, summaryResult, topListingsResult] = await Promise.all([
      // Daily metrics
      ctx.db.query(
        `SELECT d.date,
                SUM(d.portal_views) as portal_views,
                SUM(d.listing_views) as listing_views,
                SUM(d.registrations) as registrations,
                SUM(d.consultations) as consultations,
                SUM(d.unique_visitors) as unique_visitors
         FROM portal_analytics_daily d
         JOIN government_portals p ON p.id = d.portal_id AND p.workspace_id = $1
         WHERE d.date >= CURRENT_DATE - INTERVAL '1 day' * ${days}
         ${portalCondition}
         GROUP BY d.date
         ORDER BY d.date`,
        params
      ),
      // Summary totals
      ctx.db.query(
        `SELECT
           SUM(d.portal_views) as total_views,
           SUM(d.listing_views) as total_listing_views,
           SUM(d.registrations) as total_registrations,
           SUM(d.consultations) as total_consultations,
           SUM(d.unique_visitors) as total_unique_visitors
         FROM portal_analytics_daily d
         JOIN government_portals p ON p.id = d.portal_id AND p.workspace_id = $1
         WHERE d.date >= CURRENT_DATE - INTERVAL '1 day' * ${days}
         ${portalCondition}`,
        params
      ),
      // Top performing listings
      ctx.db.query(
        `SELECT l.id, l.title, l.slug, l.sector_id,
                SUM(d.listing_views) as views,
                SUM(d.listing_clicks) as clicks,
                SUM(d.registrations) as leads
         FROM portal_analytics_daily d
         JOIN opportunity_listings l ON l.id = d.listing_id
         JOIN government_portals p ON p.id = d.portal_id AND p.workspace_id = $1
         WHERE d.date >= CURRENT_DATE - INTERVAL '1 day' * ${days}
         AND d.listing_id IS NOT NULL
         ${portalCondition}
         GROUP BY l.id, l.title, l.slug, l.sector_id
         ORDER BY views DESC
         LIMIT 10`,
        params
      ),
    ]);

    return NextResponse.json({
      daily: dailyResult.rows,
      summary: summaryResult.rows[0] || {},
      top_listings: topListingsResult.rows,
    });
  },
});
