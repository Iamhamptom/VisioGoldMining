import { NextRequest, NextResponse } from 'next/server';
import { signToken, signRefreshToken, comparePassword } from '@/lib/auth';
import { loginSchema } from '@/lib/validation';
import { errorResponse, unauthorized, badRequest } from '@/lib/errors';
import {
  DEFAULT_WORKSPACE,
  MOCK_AUTH_MODE,
  getDemoUserByEmail,
  getDemoWorkspaceMemberships,
} from '@/lib/mock-data';
import { supabaseRpc } from '@/lib/supabase-rest';
import type { MemberRole } from '@/types';

interface AuthResult {
  id: string;
  email: string;
  display_name: string;
  password_hash: string;
  memberships: Array<{
    workspace_id: string;
    role: MemberRole;
    workspace_name: string;
  }>;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      throw badRequest(parsed.error.errors[0].message);
    }

    const { email, password } = parsed.data;

    if (MOCK_AUTH_MODE) {
      const demoUser = getDemoUserByEmail(email);
      if (!demoUser || password !== 'password123') {
        throw unauthorized('Invalid email or password');
      }

      const memberships = getDemoWorkspaceMemberships(demoUser.role);
      const token = await signToken({
        sub: demoUser.id,
        email: demoUser.email,
        workspaceId: DEFAULT_WORKSPACE.id,
        role: demoUser.role,
      });

      const refreshToken = await signRefreshToken({
        sub: demoUser.id,
        email: demoUser.email,
      });

      return NextResponse.json({
        token,
        refreshToken,
        user: {
          id: demoUser.id,
          email: demoUser.email,
          displayName: demoUser.displayName,
        },
        workspaces: memberships.map((membership) => ({
          id: membership.workspace_id,
          name: membership.workspace_name,
          slug: DEFAULT_WORKSPACE.slug,
          role: membership.role,
        })),
        currentWorkspace: {
          id: DEFAULT_WORKSPACE.id,
          role: demoUser.role,
        },
      });
    }

    // Authenticate via Supabase RPC (HTTPS, no direct pg connection)
    const userData = await supabaseRpc<AuthResult | null>('vg_authenticate', {
      p_email: email,
    });

    if (!userData) {
      throw unauthorized('Invalid email or password');
    }

    // Verify password with bcrypt
    const valid = await comparePassword(password, userData.password_hash);
    if (!valid) {
      throw unauthorized('Invalid email or password');
    }

    const memberships = userData.memberships || [];
    const defaultMembership = memberships[0];
    if (!defaultMembership) {
      throw unauthorized('User has no workspace memberships');
    }

    // Sign JWT + refresh token
    const token = await signToken({
      sub: userData.id,
      email: userData.email,
      workspaceId: defaultMembership.workspace_id,
      role: defaultMembership.role,
    });

    const refreshToken = await signRefreshToken({
      sub: userData.id,
      email: userData.email,
    });

    return NextResponse.json({
      token,
      refreshToken,
      user: {
        id: userData.id,
        email: userData.email,
        displayName: userData.display_name,
      },
      workspaces: memberships.map((m) => ({
        id: m.workspace_id,
        name: m.workspace_name,
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
