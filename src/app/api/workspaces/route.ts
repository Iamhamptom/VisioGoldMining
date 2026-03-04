import { NextRequest, NextResponse } from 'next/server';
import { extractAuth } from '@/lib/middleware/with-auth';
import { MOCK_MODE, queryNoRLS, getAdminClient } from '@/lib/db';
import { getMockWorkspaces } from '@/lib/mock-data';
import { createWorkspaceSchema } from '@/lib/validation';
import { errorResponse, badRequest } from '@/lib/errors';

// GET /api/workspaces — list workspaces the user belongs to (no RLS needed)
export async function GET(req: NextRequest) {
  try {
    const user = await extractAuth(req);

    if (MOCK_MODE) {
      return NextResponse.json({
        workspaces: getMockWorkspaces(user.role),
      });
    }

    const workspaces = await queryNoRLS(
      `SELECT w.id, w.name, w.slug, w.created_at, wm.role
       FROM workspaces w
       JOIN workspace_members wm ON wm.workspace_id = w.id
       WHERE wm.user_id = $1
       ORDER BY w.name`,
      [user.sub]
    );

    return NextResponse.json({ workspaces });
  } catch (error) {
    return errorResponse(error);
  }
}

// POST /api/workspaces — create a new workspace, creator becomes OWNER
export async function POST(req: NextRequest) {
  try {
    const user = await extractAuth(req);
    const body = await req.json();
    const parsed = createWorkspaceSchema.safeParse(body);
    if (!parsed.success) {
      throw badRequest(parsed.error.errors[0].message);
    }

    const { name, slug } = parsed.data;

    if (MOCK_MODE) {
      return NextResponse.json(
        {
          workspace: {
            id: crypto.randomUUID(),
            name,
            slug,
            created_at: new Date().toISOString(),
            role: 'OWNER',
          },
        },
        { status: 201 }
      );
    }

    // Use admin client to bypass RLS for workspace creation
    const client = await getAdminClient();
    try {
      await client.query('BEGIN');

      const { rows: [workspace] } = await client.query(
        'INSERT INTO workspaces (name, slug) VALUES ($1, $2) RETURNING *',
        [name, slug]
      );

      await client.query(
        `INSERT INTO workspace_members (workspace_id, user_id, role) VALUES ($1, $2, 'OWNER')`,
        [workspace.id, user.sub]
      );

      await client.query(
        `INSERT INTO audit_log (workspace_id, user_id, action, resource_type, resource_id, details)
         VALUES ($1, $2, 'WORKSPACE_CREATE', 'workspace', $3, $4)`,
        [workspace.id, user.sub, workspace.id, JSON.stringify({ name, slug })]
      );

      await client.query('COMMIT');

      return NextResponse.json({ workspace }, { status: 201 });
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  } catch (error) {
    return errorResponse(error);
  }
}
