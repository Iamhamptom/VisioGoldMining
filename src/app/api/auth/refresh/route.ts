import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, signToken, signRefreshToken } from '@/lib/auth';
import { queryNoRLS } from '@/lib/db';
import { errorResponse, unauthorized, badRequest } from '@/lib/errors';
import type { User, WorkspaceMember } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const refreshToken = body.refreshToken;

    if (!refreshToken || typeof refreshToken !== 'string') {
      throw badRequest('refreshToken is required');
    }

    // Verify the refresh token
    const { sub, email } = await verifyRefreshToken(refreshToken);

    // Verify user still exists and is active
    const users = await queryNoRLS<User>(
      'SELECT id, email, display_name, is_active FROM users WHERE id = $1 AND is_active = true',
      [sub]
    );

    if (users.length === 0) {
      throw unauthorized('User not found or inactive');
    }

    const user = users[0];

    // Get workspace memberships for new access token
    const memberships = await queryNoRLS<WorkspaceMember>(
      'SELECT workspace_id, role FROM workspace_members WHERE user_id = $1',
      [user.id]
    );

    const defaultMembership = memberships[0];
    if (!defaultMembership) {
      throw unauthorized('User has no workspace memberships');
    }

    // Issue new access token and refresh token
    const newToken = await signToken({
      sub: user.id,
      email: user.email,
      workspaceId: defaultMembership.workspace_id,
      role: defaultMembership.role,
    });

    const newRefreshToken = await signRefreshToken({
      sub: user.id,
      email: user.email,
    });

    return NextResponse.json({
      token: newToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
