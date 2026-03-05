import { NextRequest, NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { MOCK_MODE, queryNoRLS } from '@/lib/db';
import { badRequest, errorResponse } from '@/lib/errors';
import { salesLeadSchema } from '@/lib/validation';
import { getMockMiningState, mockId, nowIso } from '@/lib/mock-mining-store';

export const dynamic = 'force-dynamic';

export const GET = createHandler({
  roles: ['ANALYST', 'ADMIN', 'OWNER'],
  handler: async (req, ctx) => {
    const url = new URL(req.url);
    const stage = url.searchParams.get('stage');
    const country = url.searchParams.get('country');
    const interest = url.searchParams.get('interest');

    if (MOCK_MODE) {
      let leads = getMockMiningState().leads;
      if (stage) leads = leads.filter((lead) => lead.stage === stage);
      if (country) leads = leads.filter((lead) => lead.country === country);
      if (interest) leads = leads.filter((lead) => lead.interest_area === interest);
      return NextResponse.json({ leads });
    }

    const clauses = ['(workspace_id = $1 OR workspace_id IS NULL)'];
    const values: unknown[] = [ctx.workspaceId];

    if (stage) {
      values.push(stage);
      clauses.push(`stage = $${values.length}`);
    }

    if (country) {
      values.push(country);
      clauses.push(`country = $${values.length}`);
    }

    if (interest) {
      values.push(interest);
      clauses.push(`interest_area = $${values.length}`);
    }

    const { rows } = await ctx.db.query(
      `SELECT * FROM sales_leads WHERE ${clauses.join(' AND ')} ORDER BY created_at DESC LIMIT 300`,
      values
    );

    return NextResponse.json({ leads: rows });
  },
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = salesLeadSchema.safeParse(body);
    if (!parsed.success) throw badRequest(parsed.error.errors[0].message);

    const lead = parsed.data;

    if (MOCK_MODE) {
      const state = getMockMiningState();
      const created = {
        id: mockId('lead'),
        workspace_id: null,
        source_page: lead.source_page,
        interest_area: lead.interest_area,
        company_name: lead.company_name || null,
        contact_name: lead.contact_name || null,
        email: lead.email,
        phone: lead.phone || null,
        company_size: lead.company_size || null,
        country: lead.country || null,
        stage: lead.stage || 'new',
        estimated_acv: lead.estimated_acv || null,
        notes: lead.notes || null,
        intent_tags: lead.intent_tags || [],
        metadata: lead.metadata || {},
        created_at: nowIso(),
        updated_at: nowIso(),
      };
      state.leads.unshift(created);
      return NextResponse.json({ lead: created }, { status: 201 });
    }

    const rows = await queryNoRLS(
      `INSERT INTO sales_leads (
        workspace_id, source_page, interest_area, company_name, contact_name,
        email, phone, company_size, country, stage, estimated_acv, notes,
        intent_tags, metadata
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14
      ) RETURNING *`,
      [
        null,
        lead.source_page,
        lead.interest_area,
        lead.company_name || null,
        lead.contact_name || null,
        lead.email,
        lead.phone || null,
        lead.company_size || null,
        lead.country || null,
        lead.stage || 'new',
        lead.estimated_acv || null,
        lead.notes || null,
        lead.intent_tags || [],
        JSON.stringify(lead.metadata || {}),
      ]
    );

    return NextResponse.json({ lead: rows[0] }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
