import { NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { MOCK_MODE } from '@/lib/db';
import { badRequest } from '@/lib/errors';
import { proposalInputSchema } from '@/lib/validation';
import { buildProposal } from '@/lib/sales/proposal-engine';
import { getMockMiningState, mockId, nowIso } from '@/lib/mock-mining-store';

export const GET = createHandler({
  roles: ['ANALYST', 'ADMIN', 'OWNER'],
  handler: async (_req, ctx) => {
    if (MOCK_MODE) {
      const proposals = getMockMiningState().proposals.filter((proposal) => proposal.workspace_id === ctx.workspaceId);
      return NextResponse.json({ proposals });
    }

    const { rows } = await ctx.db.query(
      `SELECT * FROM proposals WHERE workspace_id = $1 ORDER BY created_at DESC LIMIT 100`,
      [ctx.workspaceId]
    );

    return NextResponse.json({ proposals: rows });
  },
});

export const POST = createHandler({
  roles: ['ANALYST', 'ADMIN', 'OWNER'],
  audit: { action: 'PROPOSAL_CREATE', resourceType: 'proposal' },
  handler: async (req, ctx) => {
    const body = await req.json();
    const parsed = proposalInputSchema.safeParse(body);
    if (!parsed.success) throw badRequest(parsed.error.errors[0].message);

    const input = parsed.data;
    const generated = buildProposal(input);

    if (MOCK_MODE) {
      const state = getMockMiningState();
      const now = nowIso();

      const proposal = {
        id: mockId('proposal'),
        workspace_id: ctx.workspaceId,
        name: input.name,
        site_type: input.site_type,
        remoteness: input.remoteness,
        mine_stage: input.mine_stage,
        data_maturity: input.data_maturity,
        desired_bundle: input.desired_bundle || null,
        desired_phase: input.desired_phase || null,
        recommended_package: generated.recommendedPackage,
        price_min: generated.priceMin,
        price_max: generated.priceMax,
        timeline_weeks: generated.timelineWeeks,
        sow_summary: generated.sowSummary,
        milestones: generated.milestones,
        status: 'draft' as const,
        created_at: now,
        updated_at: now,
      };

      state.proposals.unshift(proposal);
      state.proposalVersions.unshift({
        id: mockId('proposal_version'),
        workspace_id: ctx.workspaceId,
        proposal_id: proposal.id,
        version_number: 1,
        input_json: input,
        output_json: generated as unknown as Record<string, unknown>,
        created_at: now,
      });
      generated.lineItems.forEach((item, index) => {
        state.proposalLineItems.push({
          id: mockId('proposal_line_item'),
          workspace_id: ctx.workspaceId,
          proposal_id: proposal.id,
          label: item.label,
          description: item.description,
          amount_min: item.amountMin,
          amount_max: item.amountMax,
          quantity: 1,
          unit: 'lot',
          sort_order: index + 1,
          created_at: now,
        });
      });

      return NextResponse.json({ proposal, generated }, { status: 201 });
    }

    const { rows: proposalRows } = await ctx.db.query(
      `INSERT INTO proposals (
        workspace_id, name, site_type, remoteness, mine_stage, data_maturity,
        desired_bundle, desired_phase, recommended_package, price_min, price_max,
        timeline_weeks, sow_summary, milestones, created_by
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15
      ) RETURNING *`,
      [
        ctx.workspaceId,
        input.name,
        input.site_type,
        input.remoteness,
        input.mine_stage,
        input.data_maturity,
        input.desired_bundle || null,
        input.desired_phase || null,
        generated.recommendedPackage,
        generated.priceMin,
        generated.priceMax,
        generated.timelineWeeks,
        generated.sowSummary,
        JSON.stringify(generated.milestones),
        ctx.user.sub,
      ]
    );

    const proposal = proposalRows[0];

    await ctx.db.query(
      `INSERT INTO proposal_versions (workspace_id, proposal_id, version_number, input_json, output_json, created_by)
       VALUES ($1, $2, 1, $3, $4, $5)`,
      [
        ctx.workspaceId,
        proposal.id,
        JSON.stringify(input),
        JSON.stringify(generated),
        ctx.user.sub,
      ]
    );

    const lineItemRows = generated.lineItems.map((item, index) =>
      ctx.db.query(
        `INSERT INTO proposal_line_items (
          workspace_id, proposal_id, label, description, amount_min, amount_max, quantity, unit, sort_order
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [ctx.workspaceId, proposal.id, item.label, item.description, item.amountMin, item.amountMax, 1, 'lot', index + 1]
      )
    );

    await Promise.all(lineItemRows);

    return NextResponse.json({ proposal, generated }, { status: 201 });
  },
});
