import { NextRequest, NextResponse } from 'next/server';
import { signToken, signRefreshToken, comparePassword } from '@/lib/auth';
import { loginSchema } from '@/lib/validation';
import { errorResponse, unauthorized, badRequest } from '@/lib/errors';
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
