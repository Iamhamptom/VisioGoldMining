import { NextRequest, NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { listingWorkflowSchema } from '@/lib/validation';
import { badRequest, notFound } from '@/lib/errors';

const WORKFLOW_TRANSITIONS: Record<string, Record<string, string>> = {
  draft: { submit: 'submitted', archive: 'archived' },
  submitted: { start_review: 'in_review', revert_to_draft: 'draft' },
  in_review: { approve: 'approved', revert_to_draft: 'draft' },
  approved: { publish: 'published', revert_to_draft: 'draft' },
  published: { archive: 'archived' },
  archived: { revert_to_draft: 'draft' },
};

// POST /api/dashboard/gov/listings/[listingId]/workflow — Status transitions
export const POST = createHandler({
  roles: ['ADMIN', 'OWNER'],
  audit: { action: 'LISTING_WORKFLOW', resourceType: 'opportunity_listing' },
  handler: async (req, ctx) => {
    const body = await req.json();
    const parsed = listingWorkflowSchema.safeParse(body);
    if (!parsed.success) throw badRequest(parsed.error.errors[0].message);

    const { rows: listings } = await ctx.db.query(
      'SELECT id, status FROM opportunity_listings WHERE id = $1 AND workspace_id = $2',
      [ctx.params.listingId, ctx.workspaceId]
    );
    if (listings.length === 0) throw notFound('Listing not found');

    const currentStatus = listings[0].status;
    const transitions = WORKFLOW_TRANSITIONS[currentStatus];
    if (!transitions || !transitions[parsed.data.action]) {
      throw badRequest(`Cannot ${parsed.data.action} from status '${currentStatus}'`);
    }

    const newStatus = transitions[parsed.data.action];
    const timestampField =
      newStatus === 'submitted' ? 'submitted_at' :
      newStatus === 'approved' ? 'approved_at' :
      newStatus === 'published' ? 'published_at' : null;

    const approvedByClause = newStatus === 'approved' ? `, approved_by = $4` : '';
    const params: unknown[] = [newStatus, ctx.params.listingId, ctx.workspaceId];
    if (newStatus === 'approved') params.push(ctx.user.sub);

    const { rows } = await ctx.db.query(
      `UPDATE opportunity_listings
       SET status = $1, updated_at = NOW()
       ${timestampField ? `, ${timestampField} = NOW()` : ''}
       ${approvedByClause}
       WHERE id = $2 AND workspace_id = $3
       RETURNING *`,
      params
    );

    return NextResponse.json({ listing: rows[0] });
  },
});
