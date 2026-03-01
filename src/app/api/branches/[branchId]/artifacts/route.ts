import { NextRequest, NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { storeFile } from '@/lib/storage';
import { sha256 } from '@/lib/hash';
import { badRequest } from '@/lib/errors';

// GET /api/branches/:branchId/artifacts
export const GET = createHandler({
  handler: async (_req, ctx) => {
    const { rows } = await ctx.db.query(
      `SELECT a.*, u.display_name as created_by_name
       FROM artifacts a
       LEFT JOIN users u ON u.id = a.created_by
       WHERE a.branch_id = $1
       ORDER BY a.created_at DESC`,
      [ctx.params.branchId]
    );

    return NextResponse.json({ artifacts: rows });
  },
});

// POST /api/branches/:branchId/artifacts — upload an artifact
export const POST = createHandler({
  roles: ['ANALYST', 'ADMIN', 'OWNER'],
  audit: { action: 'ARTIFACT_UPLOAD', resourceType: 'artifact' },
  handler: async (req, ctx) => {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string | null;
    const type = formData.get('type') as string | null;
    const path = formData.get('path') as string | null;

    if (!file || !title || !type) {
      throw badRequest('file, title, and type are required');
    }

    // Get repo_id from branch
    const { rows: branchRows } = await ctx.db.query(
      'SELECT repo_id FROM branches WHERE id = $1',
      [ctx.params.branchId]
    );

    if (branchRows.length === 0) {
      throw badRequest('Branch not found');
    }

    const repoId = branchRows[0].repo_id;

    // Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileHash = sha256(buffer);

    // Store file
    const storagePath = await storeFile(ctx.workspaceId, repoId, buffer, file.name);

    // Create artifact record
    const { rows: [artifact] } = await ctx.db.query(
      `INSERT INTO artifacts (workspace_id, repo_id, branch_id, type, title, filename, mime_type, size_bytes, sha256, storage_path, metadata_json, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
      [
        ctx.workspaceId, repoId, ctx.params.branchId, type, title,
        file.name, file.type || 'application/octet-stream', buffer.length,
        fileHash, storagePath, JSON.stringify({ originalPath: path || file.name }),
        ctx.user.sub
      ]
    );

    return NextResponse.json({ artifact }, { status: 201 });
  },
});
