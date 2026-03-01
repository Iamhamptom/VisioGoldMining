import { NextRequest, NextResponse } from 'next/server';
import { extractAuth } from '@/lib/middleware/with-auth';
import { queryNoRLS } from '@/lib/db';
import { errorResponse, notFound } from '@/lib/errors';
import type { User, WorkspaceMember } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const payload = await extractAuth(req);

    const users = await queryNoRLS<User>(
      'SELECT id, email, display_name, is_active, created_at FROM users WHERE id = $1',
      [payload.sub]
    );

    if (users.length === 0) {
      throw notFound('User not found');
    }

    const user = users[0];

    const memberships = await queryNoRLS<WorkspaceMember & { workspace_name: string; workspace_slug: string }>(
      `SELECT wm.workspace_id, wm.role, w.name as workspace_name, w.slug as workspace_slug
       FROM workspace_members wm
       JOIN workspaces w ON w.id = wm.workspace_id
       WHERE wm.user_id = $1`,
      [user.id]
    );

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        isActive: user.is_active,
        createdAt: user.created_at,
      },
      workspaces: memberships.map((m) => ({
        id: m.workspace_id,
        name: (m as unknown as { workspace_name: string }).workspace_name,
        slug: (m as unknown as { workspace_slug: string }).workspace_slug,
        role: m.role,
      })),
    });
  } catch (error) {
    return errorResponse(error);
  }
}
