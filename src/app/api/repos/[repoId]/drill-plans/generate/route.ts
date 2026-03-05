import { NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { MOCK_MODE } from '@/lib/db';
import { badRequest } from '@/lib/errors';
import { drillPlanInputSchema } from '@/lib/validation';
import { buildPhasePlan } from '@/lib/engine/target-ranking';
import { getMockMiningState, mockId, nowIso } from '@/lib/mock-mining-store';

interface DrillTargetRow {
  id: string;
  name: string;
  confidence_score: number;
  data_completeness: number;
  reason_codes: string[];
  risk_flags: string[];
  recommended_phase: number;
  metadata: Record<string, unknown>;
}

export const POST = createHandler({
  roles: ['ANALYST', 'ADMIN', 'OWNER'],
  audit: { action: 'DRILL_PLAN_GENERATE', resourceType: 'drill_plan' },
  handler: async (req, ctx) => {
    const body = await req.json();
    const parsed = drillPlanInputSchema.safeParse(body);
    if (!parsed.success) throw badRequest(parsed.error.errors[0].message);

    const input = parsed.data;

    if (MOCK_MODE) {
      const state = getMockMiningState();
      const targets = state.drillTargets
        .filter((target) => target.workspace_id === ctx.workspaceId && target.repo_id === ctx.params.repoId && target.branch_id === input.branch_id)
        .sort((a, b) => a.rank - b.rank)
        .slice(0, 20);

      if (targets.length === 0) throw badRequest('No drill targets available');

      const rankedLike = targets.map((target, index) => ({
        name: target.name,
        rank: index + 1,
        confidence_score: Number(target.confidence_score),
        data_completeness: Number(target.data_completeness),
        reason_codes: target.reason_codes,
        risk_flags: target.risk_flags,
        recommended_phase: Number(target.recommended_phase),
        metadata: target.metadata,
      }));

      const phasePlan = buildPhasePlan(rankedLike);
      const budgetRange = {
        min: input.budget_min ?? 150000,
        max: input.budget_max ?? 450000,
        currency: 'USD',
      };
      const riskMap = {
        elevated_security_targets: targets.filter((t) => t.risk_flags.includes('SECURITY_RISK_ELEVATED')).map((t) => t.name),
        data_gap_targets: targets.filter((t) => t.risk_flags.includes('DATA_GAP')).map((t) => t.name),
      };

      const plan = {
        id: mockId('drill_plan'),
        workspace_id: ctx.workspaceId,
        repo_id: ctx.params.repoId,
        branch_id: input.branch_id,
        score_run_id: input.score_run_id || null,
        name: input.name,
        phase_plan: phasePlan,
        budget_range: budgetRange,
        risk_map: riskMap,
        status: 'draft' as const,
        created_at: nowIso(),
      };

      state.drillPlans.unshift(plan);
      targets.forEach((target) => { target.promoted_to_plan = true; });

      return NextResponse.json({ drill_plan: plan, selected_targets: targets }, { status: 201 });
    }

    const { rows: branchRows } = await ctx.db.query(
      'SELECT id FROM branches WHERE id = $1 AND repo_id = $2 AND workspace_id = $3',
      [input.branch_id, ctx.params.repoId, ctx.workspaceId]
    );

    if (branchRows.length === 0) throw badRequest('Branch not found for repo');

    let targets: DrillTargetRow[] = [];

    if (input.target_ids && input.target_ids.length > 0) {
      const { rows } = await ctx.db.query(
        `SELECT * FROM drill_targets
         WHERE workspace_id = $1 AND repo_id = $2 AND branch_id = $3 AND id = ANY($4::uuid[])
         ORDER BY rank ASC`,
        [ctx.workspaceId, ctx.params.repoId, input.branch_id, input.target_ids]
      );
      targets = rows as DrillTargetRow[];
    } else {
      const { rows } = await ctx.db.query(
        `SELECT * FROM drill_targets
         WHERE workspace_id = $1 AND repo_id = $2 AND branch_id = $3
         ORDER BY rank ASC
         LIMIT 20`,
        [ctx.workspaceId, ctx.params.repoId, input.branch_id]
      );
      targets = rows as DrillTargetRow[];
    }

    if (targets.length === 0) throw badRequest('No drill targets available');

    const rankedLike = targets.map((target, index) => ({
      name: target.name,
      rank: index + 1,
      confidence_score: Number(target.confidence_score),
      data_completeness: Number(target.data_completeness),
      reason_codes: target.reason_codes,
      risk_flags: target.risk_flags,
      recommended_phase: Number(target.recommended_phase),
      metadata: target.metadata,
    }));

    const phasePlan = buildPhasePlan(rankedLike);

    const estimatedCosts = targets.map((t) => Number((t.metadata?.estimated_cost as number) || 0));
    const defaultBudget = {
      min: Math.round(estimatedCosts.reduce((sum, value) => sum + value * 0.85, 0)),
      max: Math.round(estimatedCosts.reduce((sum, value) => sum + value * 1.2, 0)),
    };

    const budgetRange = {
      min: input.budget_min ?? defaultBudget.min,
      max: input.budget_max ?? defaultBudget.max,
      currency: 'USD',
    };

    const riskMap = {
      elevated_security_targets: targets.filter((t) => t.risk_flags.includes('SECURITY_RISK_ELEVATED')).map((t) => t.name),
      data_gap_targets: targets.filter((t) => t.risk_flags.includes('DATA_GAP')).map((t) => t.name),
    };

    const { rows: planRows } = await ctx.db.query(
      `INSERT INTO drill_plans (
        workspace_id, repo_id, branch_id, score_run_id, name,
        phase_plan, budget_range, risk_map, created_by
      ) VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9
      ) RETURNING *`,
      [
        ctx.workspaceId,
        ctx.params.repoId,
        input.branch_id,
        input.score_run_id || null,
        input.name,
        JSON.stringify(phasePlan),
        JSON.stringify(budgetRange),
        JSON.stringify(riskMap),
        ctx.user.sub,
      ]
    );

    await ctx.db.query(
      `UPDATE drill_targets
       SET promoted_to_plan = true
       WHERE workspace_id = $1 AND repo_id = $2 AND branch_id = $3 AND id = ANY($4::uuid[])`,
      [ctx.workspaceId, ctx.params.repoId, input.branch_id, targets.map((t) => t.id)]
    );

    return NextResponse.json({
      drill_plan: planRows[0],
      selected_targets: targets,
    }, { status: 201 });
  },
});
