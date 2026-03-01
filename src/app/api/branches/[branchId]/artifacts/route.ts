import { NextRequest, NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { storeFile } from '@/lib/storage';
import { sha256 } from '@/lib/hash';
import { generateDEK, encrypt, encryptDEK } from '@/lib/crypto';
import { badRequest } from '@/lib/errors';
import type { ArtifactType } from '@/types';

const VALID_ARTIFACT_TYPES: ArtifactType[] = [
  'DOCUMENT', 'DATASET', 'PLAN', 'SIMULATION',
  'TASKS', 'NOTE', 'RISK_REGISTER', 'VENDOR_REPORT',
];

const MAX_UPLOAD_SIZE = 50 * 1024 * 1024; // 50 MB

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

    // Validate artifact type against enum
    if (!VALID_ARTIFACT_TYPES.includes(type as ArtifactType)) {
      throw badRequest(`Invalid artifact type. Must be one of: ${VALID_ARTIFACT_TYPES.join(', ')}`);
    }

    // Read file buffer and enforce size limit
    const buffer = Buffer.from(await file.arrayBuffer());
    if (buffer.length > MAX_UPLOAD_SIZE) {
      throw badRequest(`File exceeds maximum upload size of ${MAX_UPLOAD_SIZE / (1024 * 1024)} MB`);
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

    // Hash the plaintext content for provenance (always on plaintext)
    const fileHash = sha256(buffer);

    // Encrypt the file with a per-artifact DEK when ROOT_ENCRYPTION_KEY is available
    let storedBuffer = buffer;
    let encryptedDekBytes: Buffer | null = null;
    let encryptionKeyId: string | null = null;

    if (process.env.ROOT_ENCRYPTION_KEY && process.env.ROOT_ENCRYPTION_KEY.length >= 32) {
      const dek = generateDEK();
      storedBuffer = encrypt(buffer, dek);
      encryptedDekBytes = encryptDEK(dek);

      // Get or create active encryption key record for workspace
      const { rows: keyRows } = await ctx.db.query(
        `SELECT id FROM encryption_keys WHERE workspace_id = $1 AND is_active = true ORDER BY key_version DESC LIMIT 1`,
        [ctx.workspaceId]
      );

      if (keyRows.length > 0) {
        encryptionKeyId = keyRows[0].id;
      } else {
        const { rows: newKeyRows } = await ctx.db.query(
          `INSERT INTO encryption_keys (workspace_id, key_version, encrypted_key, is_active)
           VALUES ($1, 1, $2, true) RETURNING id`,
          [ctx.workspaceId, encryptDEK(generateDEK())]
        );
        encryptionKeyId = newKeyRows[0].id;
      }
    }

    // Store (possibly encrypted) file
    const storagePath = await storeFile(ctx.workspaceId, repoId, storedBuffer, file.name);

    // Create artifact record
    const { rows: [artifact] } = await ctx.db.query(
      `INSERT INTO artifacts (workspace_id, repo_id, branch_id, type, title, filename, mime_type, size_bytes, sha256, storage_path, encrypted_dek, encryption_key_id, metadata_json, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *`,
      [
        ctx.workspaceId, repoId, ctx.params.branchId, type, title,
        file.name, file.type || 'application/octet-stream', buffer.length,
        fileHash, storagePath, encryptedDekBytes, encryptionKeyId,
        JSON.stringify({ originalPath: path || file.name }),
        ctx.user.sub
      ]
    );

    return NextResponse.json({ artifact }, { status: 201 });
  },
});
