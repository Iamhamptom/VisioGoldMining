import { NextRequest, NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { getAdminClient } from '@/lib/db';

export const dynamic = 'force-dynamic';

// GET /api/dashboard/gov/leads — Investor leads for this workspace's portals
export const GET = createHandler({
  roles: ['ADMIN', 'OWNER'],
  handler: async (req, ctx) => {
    // Investor profiles are cross-workspace — need admin client to join
    const adminClient = await getAdminClient();
    try {
      const url = new URL(req.url);
      const portalId = url.searchParams.get('portal_id');
      const minScore = url.searchParams.get('min_score');

      const conditions = ['r.portal_id IN (SELECT id FROM government_portals WHERE workspace_id = $1)'];
      const values: unknown[] = [ctx.workspaceId];
      let idx = 2;

      if (portalId) { conditions.push(`r.portal_id = $${idx++}`); values.push(portalId); }
      if (minScore) { conditions.push(`ip.lead_score >= $${idx++}`); values.push(parseInt(minScore)); }

      const { rows } = await adminClient.query(
        `SELECT ip.*, r.portal_id, r.registered_at, r.source,
                p.title as portal_title,
                (SELECT COUNT(*) FROM investor_saved_opportunities iso WHERE iso.investor_id = ip.id) as saved_count,
                (SELECT COUNT(*) FROM consultation_requests cr WHERE cr.investor_id = ip.id) as consultation_count
         FROM investor_profiles ip
         JOIN investor_portal_registrations r ON r.investor_id = ip.id
         JOIN government_portals p ON p.id = r.portal_id
         WHERE ${conditions.join(' AND ')}
         ORDER BY ip.lead_score DESC, r.registered_at DESC`,
        values
      );

      return NextResponse.json({ leads: rows });
    } finally {
      adminClient.release();
    }
  },
});
