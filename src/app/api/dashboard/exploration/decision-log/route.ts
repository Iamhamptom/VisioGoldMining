import { NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { MOCK_MODE } from '@/lib/db';
import { badRequest } from '@/lib/errors';
import { decisionLogSchema } from '@/lib/validation';
import { getMockMiningState, mockId, nowIso } from '@/lib/mock-mining-store';

export const POST = createHandler({
  roles: ['ANALYST', 'ADMIN', 'OWNER'],
  audit: { action: 'DECISION_LOG', resourceType: 'decision_log' },
  handler: async (req, ctx) => {
    const body = await req.json();
    const parsed = decisionLogSchema.safeParse(body);
    if (!parsed.success) throw badRequest(parsed.error.errors[0].message);

    const input = parsed.data;

    if (MOCK_MODE) {
      const state = getMockMiningState();
      const decisionLog = {
        id: mockId('decision'),
        workspace_id: ctx.workspaceId,
        repo_id: input.repo_id,
        branch_id: input.branch_id,
        recommendation: input.recommendation,
        reasons: input.reasons,
        metrics: input.metrics,
        notes: input.notes || null,
        decided_at: nowIso(),
        decided_by_name: ctx.user.sub,
      };

      state.decisionLogs.unshift(decisionLog);
      return NextResponse.json({ decision_log: decisionLog }, { status: 201 });
    }

    const { rows: branchRows } = await ctx.db.query(
      `SELECT id FROM branches WHERE id = $1 AND repo_id = $2 AND workspace_id = $3`,
      [input.branch_id, input.repo_id, ctx.workspaceId]
    );

    if (branchRows.length === 0) throw badRequest('Branch not found for repo');

    const { rows } = await ctx.db.query(
      `INSERT INTO decision_logs (
        workspace_id, repo_id, branch_id, recommendation, reasons, metrics, notes, decided_by
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8
      ) RETURNING *`,
      [
        ctx.workspaceId,
        input.repo_id,
        input.branch_id,
        input.recommendation,
        input.reasons,
        JSON.stringify(input.metrics),
        input.notes || null,
        ctx.user.sub,
      ]
    );

    return NextResponse.json({ decision_log: rows[0] }, { status: 201 });
  },
});

export const GET = createHandler({
  roles: ['VIEWER', 'ANALYST', 'ADMIN', 'OWNER'],
  handler: async (req, ctx) => {
    const url = new URL(req.url);
    const repoId = url.searchParams.get('repo_id');
    const branchId = url.searchParams.get('branch_id');

    if (!repoId || !branchId) throw badRequest('repo_id and branch_id are required');

    if (MOCK_MODE) {
      const decisionLogs = getMockMiningState().decisionLogs.filter(
        (log) => log.workspace_id === ctx.workspaceId && log.repo_id === repoId && log.branch_id === branchId
      );
      return NextResponse.json({ decision_logs: decisionLogs });
    }

    const { rows } = await ctx.db.query(
      `SELECT l.*, u.display_name as decided_by_name
       FROM decision_logs l
       LEFT JOIN users u ON u.id = l.decided_by
       WHERE l.workspace_id = $1 AND l.repo_id = $2 AND l.branch_id = $3
       ORDER BY l.decided_at DESC LIMIT 100`,
      [ctx.workspaceId, repoId, branchId]
    );

    return NextResponse.json({ decision_logs: rows });
  },
});
