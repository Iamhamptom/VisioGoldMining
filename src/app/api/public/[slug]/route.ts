import { NextRequest, NextResponse } from 'next/server';
import { createPublicHandler } from '@/lib/handler';
import { getAdminClient } from '@/lib/db';
import { notFound } from '@/lib/errors';

// GET /api/public/:slug — get public snapshot (no auth required)
export const GET = createPublicHandler(async (_req, params) => {
  const client = await getAdminClient();
  try {
    const { rows } = await client.query(
      `SELECT ps.*, r.name as repo_name, r.country, r.commodity,
              b.name as branch_name, u.display_name as published_by_name
       FROM public_snapshots ps
       JOIN branches b ON b.id = ps.branch_id
       JOIN repos r ON r.id = b.repo_id
       LEFT JOIN users u ON u.id = ps.published_by
       WHERE ps.slug = $1 AND ps.published = true`,
      [params.slug]
    );

    if (rows.length === 0) {
      throw notFound('Snapshot not found');
    }

    return NextResponse.json({ snapshot: rows[0] });
  } finally {
    client.release();
  }
});
