import { NextRequest, NextResponse } from 'next/server';
import { createPublicHandler } from '@/lib/handler';
import { getAdminClient } from '@/lib/db';
import { consultationRequestSchema } from '@/lib/validation';
import { badRequest, notFound } from '@/lib/errors';

// POST /api/gov/[portalSlug]/consult — Submit consultation request
export const POST = createPublicHandler(async (req: NextRequest, params) => {
  const client = await getAdminClient();
  try {
    const body = await req.json();
    const parsed = consultationRequestSchema.safeParse(body);
    if (!parsed.success) {
      throw badRequest(parsed.error.errors[0].message);
    }

    // Get portal + workspace
    const { rows: portals } = await client.query(
      'SELECT id, workspace_id FROM government_portals WHERE slug = $1 AND published = true',
      [params.portalSlug]
    );
    if (portals.length === 0) throw notFound('Portal not found');
    const { id: portalId, workspace_id: workspaceId } = portals[0];

    const data = parsed.data;

    // Check if investor exists by email
    const { rows: investors } = await client.query(
      'SELECT id FROM investor_profiles WHERE email = $1',
      [data.contact_email]
    );
    const investorId = investors.length > 0 ? investors[0].id : null;

    const { rows: [consultation] } = await client.query(
      `INSERT INTO consultation_requests (
        workspace_id, portal_id, listing_id, investor_id,
        request_type, subject, message,
        contact_name, contact_email, contact_phone, contact_company
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      RETURNING id, created_at`,
      [
        workspaceId, portalId, data.listing_id || null, investorId,
        data.request_type, data.subject, data.message,
        data.contact_name, data.contact_email, data.contact_phone || null, data.contact_company || null,
      ]
    );

    return NextResponse.json(
      { message: 'Consultation request submitted', consultation_id: consultation.id },
      { status: 201 }
    );
  } finally {
    client.release();
  }
});
