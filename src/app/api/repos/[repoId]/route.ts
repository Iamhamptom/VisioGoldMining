import { NextRequest, NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { updateRepoSchema } from '@/lib/validation';
import { notFound, badRequest } from '@/lib/errors';

// GET /api/repos/:repoId
export const GET = createHandler({
  handler: async (_req, ctx) => {
    const { rows } = await ctx.db.query(
      `SELECT r.*, b.name as default_branch_name
       FROM repos r
       LEFT JOIN branches b ON b.id = r.default_branch_id
       WHERE r.id = $1`,
      [ctx.params.repoId]
    );

    if (rows.length === 0) {
      throw notFound('Repo not found');
    }

    // Get branches
    const { rows: branches } = await ctx.db.query(
      'SELECT * FROM branches WHERE repo_id = $1 ORDER BY created_at',
      [ctx.params.repoId]
    );

    return NextResponse.json({ repo: rows[0], branches });
  },
});

// PATCH /api/repos/:repoId
export const PATCH = createHandler({
  roles: ['ANALYST', 'ADMIN', 'OWNER'],
  audit: { action: 'REPO_UPDATE', resourceType: 'repo' },
  handler: async (req, ctx) => {
    const body = await req.json();
    const parsed = updateRepoSchema.safeParse(body);
    if (!parsed.success) {
      throw badRequest(parsed.error.errors[0].message);
    }

    const updates = parsed.data;
    const setClauses: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        setClauses.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (setClauses.length === 0) {
      throw badRequest('No fields to update');
    }

    setClauses.push(`updated_at = NOW()`);
    values.push(ctx.params.repoId);

    const { rows } = await ctx.db.query(
      `UPDATE repos SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );

    if (rows.length === 0) {
      throw notFound('Repo not found');
    }

    return NextResponse.json({ repo: rows[0] });
  },
});
