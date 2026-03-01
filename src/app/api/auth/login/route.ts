import { NextRequest, NextResponse } from 'next/server';
import { queryNoRLS } from '@/lib/db';
import { signToken, comparePassword } from '@/lib/auth';
import { loginSchema } from '@/lib/validation';
import { errorResponse, unauthorized, badRequest } from '@/lib/errors';
import type { User, WorkspaceMember } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      throw badRequest(parsed.error.errors[0].message);
    }

    const { email, password } = parsed.data;

    // Find user
    const users = await queryNoRLS<User>(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );

    if (users.length === 0) {
      throw unauthorized('Invalid email or password');
    }

    const user = users[0];

    // Verify password
    const valid = await comparePassword(password, user.password_hash);
    if (!valid) {
      throw unauthorized('Invalid email or password');
    }

    // Get user's workspace memberships
    const memberships = await queryNoRLS<WorkspaceMember & { workspace_name: string }>(
      `SELECT wm.*, w.name as workspace_name
       FROM workspace_members wm
       JOIN workspaces w ON w.id = wm.workspace_id
       WHERE wm.user_id = $1`,
      [user.id]
    );

    // Default to first workspace
    const defaultMembership = memberships[0];
    if (!defaultMembership) {
      throw unauthorized('User has no workspace memberships');
    }

    // Sign JWT
    const token = await signToken({
      sub: user.id,
      email: user.email,
      workspaceId: defaultMembership.workspace_id,
      role: defaultMembership.role,
    });

    return NextResponse.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.display_name,
      },
      workspaces: memberships.map((m) => ({
        id: m.workspace_id,
        name: (m as unknown as { workspace_name: string }).workspace_name,
        role: m.role,
      })),
      currentWorkspace: {
        id: defaultMembership.workspace_id,
        role: defaultMembership.role,
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
