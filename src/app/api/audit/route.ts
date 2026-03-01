import { NextRequest, NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';

// GET /api/audit — query audit log with pagination + filters
export const GET = createHandler({
  roles: ['ADMIN', 'OWNER'],
  handler: async (req, ctx) => {
    const url = req.nextUrl;
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '50'), 100);
    const action = url.searchParams.get('action');
    const userId = url.searchParams.get('userId');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    const conditions: string[] = ['a.workspace_id = $1'];
    const params: unknown[] = [ctx.workspaceId];
    let paramIdx = 2;

    if (action) {
      conditions.push(`a.action = $${paramIdx}`);
      params.push(action);
      paramIdx++;
    }

    if (userId) {
      conditions.push(`a.user_id = $${paramIdx}`);
      params.push(userId);
      paramIdx++;
    }

    if (startDate) {
      conditions.push(`a.created_at >= $${paramIdx}`);
      params.push(startDate);
      paramIdx++;
    }

    if (endDate) {
      conditions.push(`a.created_at <= $${paramIdx}`);
      params.push(endDate);
      paramIdx++;
    }

    const where = conditions.join(' AND ');
    const offset = (page - 1) * limit;

    const { rows: entries } = await ctx.db.query(
      `SELECT a.*, u.email, u.display_name
       FROM audit_log a
       LEFT JOIN users u ON u.id = a.user_id
       WHERE ${where}
       ORDER BY a.created_at DESC
       LIMIT $${paramIdx} OFFSET $${paramIdx + 1}`,
      [...params, limit, offset]
    );

    const { rows: [{ count }] } = await ctx.db.query(
      `SELECT COUNT(*) FROM audit_log a WHERE ${where}`,
      params
    );

    return NextResponse.json({
      entries,
      pagination: {
        page,
        limit,
        total: parseInt(count),
        totalPages: Math.ceil(parseInt(count) / limit),
      },
    });
  },
});
