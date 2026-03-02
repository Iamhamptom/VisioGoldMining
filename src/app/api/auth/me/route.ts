import { NextRequest, NextResponse } from 'next/server';
import { extractAuth } from '@/lib/middleware/with-auth';
import { errorResponse, notFound } from '@/lib/errors';
import { supabaseRpc } from '@/lib/supabase-rest';

interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  is_active: boolean;
  created_at: string;
  memberships: Array<{
    workspace_id: string;
    role: string;
    workspace_name: string;
    workspace_slug: string;
  }>;
}

export async function GET(req: NextRequest) {
  try {
    const payload = await extractAuth(req);

    const profile = await supabaseRpc<UserProfile | null>('vg_get_user_profile', {
      p_user_id: payload.sub,
    });

    if (!profile) {
      throw notFound('User not found');
    }

    return NextResponse.json({
      user: {
        id: profile.id,
        email: profile.email,
        displayName: profile.display_name,
        isActive: profile.is_active,
        createdAt: profile.created_at,
      },
      workspaces: profile.memberships.map((m) => ({
        id: m.workspace_id,
        name: m.workspace_name,
        slug: m.workspace_slug,
        role: m.role,
      })),
    });
  } catch (error) {
    return errorResponse(error);
  }
}
