import { NextRequest, NextResponse } from 'next/server';
import { createPublicHandler } from '@/lib/handler';
import { getAdminClient } from '@/lib/db';
import { investorRegistrationSchema } from '@/lib/validation';
import { badRequest, notFound } from '@/lib/errors';

// POST /api/gov/[portalSlug]/invest — Investor registration (lead capture)
export const POST = createPublicHandler(async (req: NextRequest, params) => {
  const client = await getAdminClient();
  try {
    const body = await req.json();
    const parsed = investorRegistrationSchema.safeParse(body);
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

    await client.query('BEGIN');

    // Upsert investor profile
    const { rows: [investor] } = await client.query(
      `INSERT INTO investor_profiles (
        email, first_name, last_name, phone, company, job_title, country,
        investment_min, investment_max, sectors_of_interest, experience_level
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
      ON CONFLICT (email) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        phone = COALESCE(EXCLUDED.phone, investor_profiles.phone),
        company = COALESCE(EXCLUDED.company, investor_profiles.company),
        job_title = COALESCE(EXCLUDED.job_title, investor_profiles.job_title),
        country = COALESCE(EXCLUDED.country, investor_profiles.country),
        investment_min = COALESCE(EXCLUDED.investment_min, investor_profiles.investment_min),
        investment_max = COALESCE(EXCLUDED.investment_max, investor_profiles.investment_max),
        sectors_of_interest = CASE
          WHEN array_length(EXCLUDED.sectors_of_interest, 1) > 0 THEN EXCLUDED.sectors_of_interest
          ELSE investor_profiles.sectors_of_interest
        END,
        experience_level = COALESCE(EXCLUDED.experience_level, investor_profiles.experience_level),
        updated_at = NOW()
      RETURNING id`,
      [
        data.email, data.first_name, data.last_name, data.phone || null,
        data.company || null, data.job_title || null, data.country || null,
        data.investment_min || null, data.investment_max || null,
        data.sectors_of_interest, data.experience_level || null,
      ]
    );

    // Register for this portal
    await client.query(
      `INSERT INTO investor_portal_registrations (investor_id, portal_id, source)
       VALUES ($1, $2, 'portal')
       ON CONFLICT (investor_id, portal_id) DO NOTHING`,
      [investor.id, portalId]
    );

    await client.query('COMMIT');

    return NextResponse.json(
      { message: 'Registration successful', investor_id: investor.id },
      { status: 201 }
    );
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
});
