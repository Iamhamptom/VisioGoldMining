import { NextRequest, NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { addMemberSchema } from '@/lib/validation';
import { queryNoRLS } from '@/lib/db';
import { badRequest, notFound } from '@/lib/errors';
import type { User } from '@/types';

// GET /api/workspaces/:id/members
export const GET = createHandler({
  handler: async (_req, ctx) => {
    const { rows } = await ctx.db.query(
      `SELECT wm.id, wm.user_id, wm.role, wm.created_at,
              u.email, u.display_name
       FROM workspace_members wm
       JOIN users u ON u.id = wm.user_id
       WHERE wm.workspace_id = $1
       ORDER BY wm.created_at`,
      [ctx.params.id]
    );

    return NextResponse.json({ members: rows });
  },
});

// POST /api/workspaces/:id/members — add a member
export const POST = createHandler({
  roles: ['ADMIN', 'OWNER'],
  audit: { action: 'MEMBER_ADD', resourceType: 'workspace_member' },
  handler: async (req, ctx) => {
    const body = await req.json();
    const parsed = addMemberSchema.safeParse(body);
    if (!parsed.success) {
      throw badRequest(parsed.error.errors[0].message);
    }

    const { email, role } = parsed.data;

    // Find user by email (admin query, user may not be in this workspace)
    const users = await queryNoRLS<User>(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (users.length === 0) {
      throw notFound('User not found');
    }

    const { rows: [member] } = await ctx.db.query(
      `INSERT INTO workspace_members (workspace_id, user_id, role)
       VALUES ($1, $2, $3)
       ON CONFLICT (workspace_id, user_id) DO UPDATE SET role = $3
       RETURNING *`,
      [ctx.params.id, users[0].id, role]
    );

    return NextResponse.json({ member }, { status: 201 });
  },
});
