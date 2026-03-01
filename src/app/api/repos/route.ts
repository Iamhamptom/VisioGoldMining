import { NextRequest, NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { createRepoSchema } from '@/lib/validation';
import { badRequest } from '@/lib/errors';

// GET /api/repos — list repos in the current workspace
export const GET = createHandler({
  audit: { action: 'REPO_READ', resourceType: 'repo' },
  handler: async (_req, ctx) => {
    const { rows } = await ctx.db.query(
      `SELECT r.*, b.name as default_branch_name
       FROM repos r
       LEFT JOIN branches b ON b.id = r.default_branch_id
       WHERE r.workspace_id = $1
       ORDER BY r.created_at DESC`,
      [ctx.workspaceId]
    );

    return NextResponse.json({ repos: rows });
  },
});

// POST /api/repos — create a repo with an auto-created 'main' branch
export const POST = createHandler({
  roles: ['ADMIN', 'OWNER'],
  audit: { action: 'REPO_CREATE', resourceType: 'repo' },
  handler: async (req, ctx) => {
    const body = await req.json();
    const parsed = createRepoSchema.safeParse(body);
    if (!parsed.success) {
      throw badRequest(parsed.error.errors[0].message);
    }

    const { name, slug, description, country, commodity } = parsed.data;

    // Create repo
    const { rows: [repo] } = await ctx.db.query(
      `INSERT INTO repos (workspace_id, name, slug, description, country, commodity, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [ctx.workspaceId, name, slug, description || null, country, commodity, ctx.user.sub]
    );

    // Auto-create 'main' branch
    const { rows: [branch] } = await ctx.db.query(
      `INSERT INTO branches (workspace_id, repo_id, name, visibility, created_by)
       VALUES ($1, $2, 'main', 'PRIVATE', $3) RETURNING *`,
      [ctx.workspaceId, repo.id, ctx.user.sub]
    );

    // Set default branch
    await ctx.db.query(
      'UPDATE repos SET default_branch_id = $1 WHERE id = $2',
      [branch.id, repo.id]
    );

    repo.default_branch_id = branch.id;

    return NextResponse.json({ repo, branch }, { status: 201 });
  },
});
