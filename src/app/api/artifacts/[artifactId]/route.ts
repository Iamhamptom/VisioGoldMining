import { NextRequest, NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { readFile } from '@/lib/storage';
import { notFound } from '@/lib/errors';

// GET /api/artifacts/:artifactId — get artifact detail + download
export const GET = createHandler({
  audit: { action: 'ARTIFACT_DOWNLOAD', resourceType: 'artifact' },
  handler: async (req, ctx) => {
    const { rows } = await ctx.db.query(
      'SELECT * FROM artifacts WHERE id = $1',
      [ctx.params.artifactId]
    );

    if (rows.length === 0) {
      throw notFound('Artifact not found');
    }

    const artifact = rows[0];

    // Check if download requested
    const download = req.nextUrl.searchParams.get('download');
    if (download === 'true') {
      const buffer = await readFile(artifact.storage_path);
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          'Content-Type': artifact.mime_type || 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${artifact.filename}"`,
          'Content-Length': String(buffer.length),
        },
      });
    }

    return NextResponse.json({ artifact });
  },
});
