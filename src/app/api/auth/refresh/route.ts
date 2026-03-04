import { NextRequest, NextResponse } from 'next/server';
import { verifyRefreshToken, signToken, signRefreshToken } from '@/lib/auth';
import { errorResponse, unauthorized, badRequest } from '@/lib/errors';
import { DEFAULT_WORKSPACE, MOCK_AUTH_MODE, getDemoUserById } from '@/lib/mock-data';
import { supabaseRpc } from '@/lib/supabase-rest';
import type { MemberRole } from '@/types';

interface RefreshUser {
  id: string;
  email: string;
  display_name: string;
  memberships: Array<{
    workspace_id: string;
    role: MemberRole;
  }>;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const refreshToken = body.refreshToken;

    if (!refreshToken || typeof refreshToken !== 'string') {
      throw badRequest('refreshToken is required');
    }

    const { sub } = await verifyRefreshToken(refreshToken);

    if (MOCK_AUTH_MODE) {
      const demoUser = getDemoUserById(sub);
      if (!demoUser) {
        throw unauthorized('User not found or inactive');
      }

      const newToken = await signToken({
        sub: demoUser.id,
        email: demoUser.email,
        workspaceId: DEFAULT_WORKSPACE.id,
        role: demoUser.role,
      });

      const newRefreshToken = await signRefreshToken({
        sub: demoUser.id,
        email: demoUser.email,
      });

      return NextResponse.json({
        token: newToken,
        refreshToken: newRefreshToken,
      });
    }

    const userData = await supabaseRpc<RefreshUser | null>('vg_get_user_for_refresh', {
      p_user_id: sub,
    });

    if (!userData) {
      throw unauthorized('User not found or inactive');
    }

    const defaultMembership = userData.memberships[0];
    if (!defaultMembership) {
      throw unauthorized('User has no workspace memberships');
    }

    const newToken = await signToken({
      sub: userData.id,
      email: userData.email,
      workspaceId: defaultMembership.workspace_id,
      role: defaultMembership.role,
    });

    const newRefreshToken = await signRefreshToken({
      sub: userData.id,
      email: userData.email,
    });

    return NextResponse.json({
      token: newToken,
      refreshToken: newRefreshToken,
    });
  } catch (error) {
    return errorResponse(error);
  }
}
