import { NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { MOCK_MODE } from '@/lib/db';
import { badRequest } from '@/lib/errors';
import { targetScoringInputSchema } from '@/lib/validation';
import { rankTargets } from '@/lib/engine/target-ranking';
import { getMockMiningState, mockId, nowIso } from '@/lib/mock-mining-store';

export const POST = createHandler({
  roles: ['ANALYST', 'ADMIN', 'OWNER'],
  audit: { action: 'TARGET_SCORE_RUN', resourceType: 'target_score_run' },
  handler: async (req, ctx) => {
    const body = await req.json();
    const parsed = targetScoringInputSchema.safeParse(body);
    if (!parsed.success) throw badRequest(parsed.error.errors[0].message);

    const input = parsed.data;
    if (!input.branch_id) throw badRequest('branch_id is required');

    if (MOCK_MODE) {
      const state = getMockMiningState();
      const ranked = rankTargets(input.targets);
      const runId = mockId('score_run');
      const createdAt = nowIso();

      state.targetScoreRuns.unshift({
        id: runId,
        workspace_id: ctx.workspaceId,
        repo_id: ctx.params.repoId,
        branch_id: input.branch_id,
        name: input.name,
        scoring_model_version: 'vg-target-1.0',
        seed: input.seed || null,
        status: 'completed',
        input_snapshot: { targets: input.targets.length },
        output_summary: { top_confidence: ranked[0]?.confidence_score ?? 0, targets: ranked.length },
        created_at: createdAt,
      });

      const mockTargets = ranked.map((target) => ({
        id: mockId('target'),
        workspace_id: ctx.workspaceId,
        repo_id: ctx.params.repoId,
        branch_id: input.branch_id,
        score_run_id: runId,
        external_target_id: target.external_target_id || null,
        name: target.name,
        rank: target.rank,
        confidence_score: target.confidence_score,
        data_completeness: target.data_completeness,
        latitude: target.latitude || null,
        longitude: target.longitude || null,
        reason_codes: target.reason_codes,
        risk_flags: target.risk_flags,
        recommended_phase: target.recommended_phase,
        promoted_to_plan: false,
        metadata: target.metadata,
        created_at: createdAt,
      }));

      state.drillTargets.unshift(...mockTargets);

      return NextResponse.json({
        score_run: state.targetScoreRuns[0],
        targets: mockTargets,
      }, { status: 201 });
    }

    const { rows: branchRows } = await ctx.db.query(
      'SELECT id FROM branches WHERE id = $1 AND repo_id = $2 AND workspace_id = $3',
      [input.branch_id, ctx.params.repoId, ctx.workspaceId]
    );

    if (branchRows.length === 0) throw badRequest('Branch not found for repo');

    const ranked = rankTargets(input.targets);

    const { rows: runRows } = await ctx.db.query(
      `INSERT INTO target_score_runs (
        workspace_id, repo_id, branch_id, name, scoring_model_version,
        seed, status, input_snapshot, output_summary, created_by
      ) VALUES ($1,$2,$3,$4,$5,$6,'completed',$7,$8,$9)
      RETURNING *`,
      [
        ctx.workspaceId,
        ctx.params.repoId,
        input.branch_id,
        input.name,
        'vg-target-1.0',
        input.seed || null,
        JSON.stringify({ targets: input.targets.length }),
        JSON.stringify({ top_confidence: ranked[0]?.confidence_score ?? 0, targets: ranked.length }),
        ctx.user.sub,
      ]
    );

    const run = runRows[0];

    for (const target of ranked) {
      await ctx.db.query(
        `INSERT INTO drill_targets (
          workspace_id, repo_id, branch_id, score_run_id, external_target_id,
          name, rank, confidence_score, data_completeness, latitude, longitude,
          reason_codes, risk_flags, recommended_phase, metadata, created_by
        ) VALUES (
          $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16
        )`,
        [
          ctx.workspaceId,
          ctx.params.repoId,
          input.branch_id,
          run.id,
          target.external_target_id || null,
          target.name,
          target.rank,
          target.confidence_score,
          target.data_completeness,
          target.latitude || null,
          target.longitude || null,
          target.reason_codes,
          target.risk_flags,
          target.recommended_phase,
          JSON.stringify(target.metadata),
          ctx.user.sub,
        ]
      );
    }

    try {
      await ctx.db.query('REFRESH MATERIALIZED VIEW exploration_kpi_summary');
    } catch {
      // View may not exist yet in partially migrated environments.
    }

    return NextResponse.json({
      score_run: run,
      targets: ranked,
    }, { status: 201 });
  },
});
