import { NextRequest, NextResponse } from 'next/server';
import { createPublicHandler } from '@/lib/handler';
import { getAdminClient } from '@/lib/db';
import { notFound } from '@/lib/errors';
import type { RedactionRule } from '@/types';

function applyRedactionRules(
  artifacts: Record<string, unknown>[],
  rules: RedactionRule[]
): Record<string, unknown>[] {
  let filtered = [...artifacts];

  for (const rule of rules) {
    if (rule.type === 'exclude_artifact_types' && rule.types) {
      filtered = filtered.filter(
        (a) => !(rule.types as string[]).includes(a.type as string)
      );
    }

    if (rule.type === 'exclude_paths' && rule.patterns) {
      filtered = filtered.filter((a) => {
        const artPath = a.path as string || '';
        return !rule.patterns!.some((pattern) => {
          const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
          return regex.test(artPath);
        });
      });
    }

    if (rule.type === 'exclude_metadata_fields' && rule.fields) {
      filtered = filtered.map((a) => {
        const metadata = { ...(a.metadata_json as Record<string, unknown> || {}) };
        for (const field of rule.fields!) {
          delete metadata[field];
        }
        return { ...a, metadata_json: metadata };
      });
    }
  }

  return filtered;
}

// GET /api/public/:slug/artifacts — list public artifacts with redaction
export const GET = createPublicHandler(async (_req, params) => {
  const client = await getAdminClient();
  try {
    const { rows: snapshots } = await client.query(
      'SELECT * FROM public_snapshots WHERE slug = $1 AND published = true',
      [params.slug]
    );

    if (snapshots.length === 0) {
      throw notFound('Snapshot not found');
    }

    const snapshot = snapshots[0];

    // Get artifacts at the published commit
    const { rows: artifacts } = await client.query(
      `WITH RECURSIVE chain AS (
        SELECT id, parent_commit_id, 0 AS depth
        FROM commits WHERE id = $1
        UNION ALL
        SELECT c.id, c.parent_commit_id, chain.depth + 1
        FROM commits c
        JOIN chain ON chain.parent_commit_id = c.id
      )
      SELECT DISTINCT ON (ca.path) ca.path, ca.change_type,
             a.id, a.type, a.title, a.filename, a.sha256, a.size_bytes, a.metadata_json, a.created_at
      FROM chain
      JOIN commit_artifacts ca ON ca.commit_id = chain.id
      JOIN artifacts a ON a.id = ca.artifact_id
      WHERE ca.change_type != 'DELETE'
      ORDER BY ca.path, chain.depth ASC`,
      [snapshot.commit_id]
    );

    // Apply redaction rules
    const redactionRules = (snapshot.redaction_rules || []) as RedactionRule[];
    const redactedArtifacts = applyRedactionRules(artifacts, redactionRules);

    return NextResponse.json({ artifacts: redactedArtifacts });
  } finally {
    client.release();
  }
});
