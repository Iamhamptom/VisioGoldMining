import { NextRequest, NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { updateListingScoresSchema } from '@/lib/validation';
import { badRequest, notFound } from '@/lib/errors';

// POST /api/dashboard/gov/listings/[listingId]/score — Update listing scores
export const POST = createHandler({
  roles: ['ANALYST', 'ADMIN', 'OWNER'],
  audit: { action: 'LISTING_UPDATE', resourceType: 'opportunity_listing' },
  handler: async (req, ctx) => {
    const body = await req.json();
    const parsed = updateListingScoresSchema.safeParse(body);
    if (!parsed.success) throw badRequest(parsed.error.errors[0].message);

    const updates: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    const data = parsed.data as Record<string, unknown>;
    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined) {
        updates.push(`${key} = $${idx++}`);
        values.push(value);
      }
    }

    if (updates.length === 0) throw badRequest('No scores provided');

    updates.push('updated_at = NOW()');
    values.push(ctx.params.listingId, ctx.workspaceId);

    const { rows } = await ctx.db.query(
      `UPDATE opportunity_listings SET ${updates.join(', ')}
       WHERE id = $${idx++} AND workspace_id = $${idx}
       RETURNING id, score_geological, score_infrastructure, score_legal,
                 score_environmental, score_social, score_overall`,
      values
    );

    if (rows.length === 0) throw notFound('Listing not found');
    return NextResponse.json({ scores: rows[0] });
  },
});
