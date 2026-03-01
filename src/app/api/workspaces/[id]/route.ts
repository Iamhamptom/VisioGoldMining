import { NextRequest, NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';

// GET /api/workspaces/:id
export const GET = createHandler({
  handler: async (_req, ctx) => {
    const { rows } = await ctx.db.query(
      'SELECT id, name, slug, settings, created_at, updated_at FROM workspaces WHERE id = $1',
      [ctx.params.id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
    }

    return NextResponse.json({ workspace: rows[0] });
  },
});
