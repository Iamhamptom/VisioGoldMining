import { NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { MOCK_MODE } from '@/lib/db';
import { badRequest } from '@/lib/errors';
import { salesLeadUpdateSchema } from '@/lib/validation';
import { getMockMiningState, nowIso } from '@/lib/mock-mining-store';

export const PUT = createHandler({
  roles: ['ADMIN', 'OWNER'],
  audit: { action: 'REPO_UPDATE', resourceType: 'sales_lead' },
  handler: async (req, ctx) => {
    const body = await req.json();
    const parsed = salesLeadUpdateSchema.safeParse(body);
    if (!parsed.success) throw badRequest(parsed.error.errors[0].message);

    if (MOCK_MODE) {
      const state = getMockMiningState();
      const lead = state.leads.find((entry) => entry.id === ctx.params.leadId);
      if (!lead) throw badRequest('Lead not found');
      Object.assign(lead, parsed.data, { updated_at: nowIso() });
      return NextResponse.json({ lead });
    }

    const updates = parsed.data;
    const allowed = [
      'interest_area',
      'company_name',
      'contact_name',
      'email',
      'phone',
      'company_size',
      'country',
      'stage',
      'estimated_acv',
      'notes',
      'intent_tags',
      'metadata',
    ] as const;

    const sets: string[] = [];
    const values: unknown[] = [ctx.workspaceId];

    for (const key of allowed) {
      const value = updates[key];
      if (value === undefined) continue;
      values.push(key === 'metadata' ? JSON.stringify(value) : value);
      sets.push(`${key} = $${values.length}`);
    }

    if (sets.length === 0) throw badRequest('No update fields provided');

    values.push(ctx.params.leadId);

    const { rows } = await ctx.db.query(
      `UPDATE sales_leads
       SET ${sets.join(', ')}, updated_at = NOW()
       WHERE id = $${values.length} AND (workspace_id = $1 OR workspace_id IS NULL)
       RETURNING *`,
      values
    );

    if (rows.length === 0) throw badRequest('Lead not found');

    return NextResponse.json({ lead: rows[0] });
  },
});
