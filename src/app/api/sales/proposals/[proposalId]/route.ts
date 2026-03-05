import { NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { MOCK_MODE } from '@/lib/db';
import { badRequest } from '@/lib/errors';
import { getMockMiningState } from '@/lib/mock-mining-store';

export const GET = createHandler({
  roles: ['ANALYST', 'ADMIN', 'OWNER'],
  handler: async (_req, ctx) => {
    const proposalId = ctx.params.proposalId;

    if (MOCK_MODE) {
      const state = getMockMiningState();
      const proposal = state.proposals.find((entry) => entry.id === proposalId && entry.workspace_id === ctx.workspaceId);
      if (!proposal) throw badRequest('Proposal not found');

      const versions = state.proposalVersions
        .filter((entry) => entry.proposal_id === proposalId && entry.workspace_id === ctx.workspaceId)
        .sort((a, b) => b.version_number - a.version_number);
      const lineItems = state.proposalLineItems
        .filter((entry) => entry.proposal_id === proposalId && entry.workspace_id === ctx.workspaceId)
        .sort((a, b) => a.sort_order - b.sort_order);

      return NextResponse.json({
        proposal,
        versions,
        line_items: lineItems,
      });
    }

    const [proposalResult, versionsResult, itemsResult] = await Promise.all([
      ctx.db.query('SELECT * FROM proposals WHERE id = $1 AND workspace_id = $2', [proposalId, ctx.workspaceId]),
      ctx.db.query('SELECT * FROM proposal_versions WHERE proposal_id = $1 AND workspace_id = $2 ORDER BY version_number DESC', [proposalId, ctx.workspaceId]),
      ctx.db.query('SELECT * FROM proposal_line_items WHERE proposal_id = $1 AND workspace_id = $2 ORDER BY sort_order ASC', [proposalId, ctx.workspaceId]),
    ]);

    if (proposalResult.rows.length === 0) throw badRequest('Proposal not found');

    return NextResponse.json({
      proposal: proposalResult.rows[0],
      versions: versionsResult.rows,
      line_items: itemsResult.rows,
    });
  },
});
