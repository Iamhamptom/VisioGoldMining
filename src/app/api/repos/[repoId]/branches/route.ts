import { NextRequest, NextResponse } from 'next/server';
import { MOCK_MODE } from '@/lib/db';
import { createHandler } from '@/lib/handler';
import { getMockRepo, getMockRepoBranches } from '@/lib/mock-data';
import { createBranchSchema } from '@/lib/validation';
import { badRequest } from '@/lib/errors';

// GET /api/repos/:repoId/branches
export const GET = createHandler({
  handler: async (_req, ctx) => {
    if (MOCK_MODE) {
      return NextResponse.json({ branches: getMockRepoBranches(ctx.params.repoId) });
    }

    const { rows } = await ctx.db.query(
      `SELECT b.*, u.display_name as created_by_name
       FROM branches b
       LEFT JOIN users u ON u.id = b.created_by
       WHERE b.repo_id = $1
       ORDER BY b.created_at`,
      [ctx.params.repoId]
    );

    return NextResponse.json({ branches: rows });
  },
});

// POST /api/repos/:repoId/branches — create a new branch
export const POST = createHandler({
  roles: ['ANALYST', 'ADMIN', 'OWNER'],
  audit: { action: 'BRANCH_CREATE', resourceType: 'branch' },
  handler: async (req, ctx) => {
    const body = await req.json();
    const parsed = createBranchSchema.safeParse(body);
    if (!parsed.success) {
      throw badRequest(parsed.error.errors[0].message);
    }

    const { name, visibility, fromBranchId } = parsed.data;

    if (MOCK_MODE) {
      const entry = getMockRepo(ctx.params.repoId);
      if (!entry) {
        throw badRequest('Repo not found');
      }

      const branch = {
        id: crypto.randomUUID(),
        workspace_id: ctx.workspaceId,
        repo_id: ctx.params.repoId,
        name,
        visibility,
        parent_branch_id: fromBranchId || null,
        head_commit_id: null,
        created_by: ctx.user.sub,
        created_at: new Date().toISOString(),
      };

      return NextResponse.json({ branch }, { status: 201 });
    }

    // If branching from another branch, inherit its head commit
    let headCommitId: string | null = null;
    let parentBranchId: string | null = null;

    if (fromBranchId) {
      const { rows: sourceBranches } = await ctx.db.query(
        'SELECT id, head_commit_id FROM branches WHERE id = $1',
        [fromBranchId]
      );
      if (sourceBranches.length > 0) {
        headCommitId = sourceBranches[0].head_commit_id;
        parentBranchId = sourceBranches[0].id;
      }
    }

    const { rows: [branch] } = await ctx.db.query(
      `INSERT INTO branches (workspace_id, repo_id, name, visibility, parent_branch_id, head_commit_id, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [ctx.workspaceId, ctx.params.repoId, name, visibility, parentBranchId, headCommitId, ctx.user.sub]
    );

    return NextResponse.json({ branch }, { status: 201 });
  },
});
