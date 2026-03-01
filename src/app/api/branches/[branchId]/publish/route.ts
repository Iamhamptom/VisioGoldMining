import { NextRequest, NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { publishSchema } from '@/lib/validation';
import { badRequest, notFound } from '@/lib/errors';

// POST /api/branches/:branchId/publish — publish a branch as a public snapshot
export const POST = createHandler({
  roles: ['ADMIN', 'OWNER'],
  audit: { action: 'PUBLISH', resourceType: 'public_snapshot' },
  handler: async (req, ctx) => {
    const body = await req.json();
    const parsed = publishSchema.safeParse(body);
    if (!parsed.success) {
      throw badRequest(parsed.error.errors[0].message);
    }

    const { slug, title, description, redactionRules } = parsed.data;

    // Get branch and its head commit
    const { rows: branches } = await ctx.db.query(
      'SELECT id, repo_id, head_commit_id FROM branches WHERE id = $1',
      [ctx.params.branchId]
    );

    if (branches.length === 0) {
      throw notFound('Branch not found');
    }

    const branch = branches[0];
    if (!branch.head_commit_id) {
      throw badRequest('Branch has no commits to publish');
    }

    const { rows: [snapshot] } = await ctx.db.query(
      `INSERT INTO public_snapshots (workspace_id, branch_id, commit_id, slug, title, description, redaction_rules, published, published_by, published_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, true, $8, NOW()) RETURNING *`,
      [
        ctx.workspaceId, branch.id, branch.head_commit_id,
        slug, title, description || null,
        JSON.stringify(redactionRules),
        ctx.user.sub
      ]
    );

    return NextResponse.json({ snapshot }, { status: 201 });
  },
});
