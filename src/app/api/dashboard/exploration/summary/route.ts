import { NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { MOCK_MODE } from '@/lib/db';
import { getMockMiningState } from '@/lib/mock-mining-store';

function safeAvg(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((acc, value) => acc + value, 0) / values.length;
}

function kpiFromTargets(targets: Array<{ confidence_score: number; metadata: Record<string, unknown> }>) {
  const targetsCount = targets.length;
  const avgConfidence = safeAvg(targets.map((target) => Number(target.confidence_score || 0)));
  const hitRate = targetsCount > 0
    ? targets.filter((target) => Number(target.confidence_score || 0) >= 0.7).length / targetsCount
    : 0;

  const metersDrilled = targets.reduce((acc, target) => {
    const value = target.metadata?.recommended_meters;
    return acc + (typeof value === 'number' && Number.isFinite(value) ? value : 120);
  }, 0);

  const totalTargetCost = targets.reduce((acc, target) => {
    const value = target.metadata?.estimated_cost;
    return acc + (typeof value === 'number' && Number.isFinite(value) ? value : 35000);
  }, 0);

  return {
    targets_count: targetsCount,
    avg_confidence: Number(avgConfidence.toFixed(2)),
    hit_rate: Number(hitRate.toFixed(4)),
    meters_drilled: metersDrilled,
    total_target_cost: totalTargetCost,
  };
}

export const GET = createHandler({
  roles: ['VIEWER', 'ANALYST', 'ADMIN', 'OWNER'],
  handler: async (req, ctx) => {
    const url = new URL(req.url);
    const repoId = url.searchParams.get('repo_id');
    const branchId = url.searchParams.get('branch_id');

    if (MOCK_MODE) {
      const state = getMockMiningState();
      const workspaceTargets = state.drillTargets.filter((target) => target.workspace_id === ctx.workspaceId);
      const scopedTargets = repoId && branchId
        ? workspaceTargets.filter((target) => target.repo_id === repoId && target.branch_id === branchId)
        : workspaceTargets;

      const kpi = kpiFromTargets(scopedTargets);
      const costPerTarget = Number(kpi.targets_count) > 0
        ? Number(kpi.total_target_cost) / Number(kpi.targets_count)
        : 0;

      return NextResponse.json({
        summary: {
          ...kpi,
          cost_per_target: Number(costPerTarget.toFixed(2)),
          budget_burn_ratio: Number((Number(kpi.total_target_cost) / Math.max(Number(kpi.total_target_cost) * 1.05, 1)).toFixed(4)),
          ...(repoId && branchId ? { workspace_id: ctx.workspaceId, repo_id: repoId, branch_id: branchId } : {}),
        },
      });
    }

    if (repoId && branchId) {
      const { rows } = await ctx.db.query(
        `SELECT * FROM exploration_kpi_summary
         WHERE workspace_id = $1 AND repo_id = $2 AND branch_id = $3`,
        [ctx.workspaceId, repoId, branchId]
      );

      const kpi = rows[0] || {
        workspace_id: ctx.workspaceId,
        repo_id: repoId,
        branch_id: branchId,
        targets_count: 0,
        avg_confidence: 0,
        hit_rate: 0,
        meters_drilled: 0,
        total_target_cost: 0,
      };

      const costPerTarget = Number(kpi.targets_count) > 0
        ? Number(kpi.total_target_cost) / Number(kpi.targets_count)
        : 0;

      return NextResponse.json({
        summary: {
          ...kpi,
          cost_per_target: Number(costPerTarget.toFixed(2)),
          budget_burn_ratio: Number((Number(kpi.total_target_cost) / Math.max(Number(kpi.total_target_cost) * 1.05, 1)).toFixed(4)),
        },
      });
    }

    const { rows } = await ctx.db.query(
      `SELECT
        COALESCE(SUM(targets_count), 0) AS targets_count,
        COALESCE(AVG(avg_confidence), 0)::NUMERIC(5,2) AS avg_confidence,
        COALESCE(AVG(hit_rate), 0)::NUMERIC(6,4) AS hit_rate,
        COALESCE(SUM(meters_drilled), 0) AS meters_drilled,
        COALESCE(SUM(total_target_cost), 0) AS total_target_cost
       FROM exploration_kpi_summary
       WHERE workspace_id = $1`,
      [ctx.workspaceId]
    );

    const aggregate = rows[0];
    const targets = Number(aggregate.targets_count || 0);
    const costPerTarget = targets > 0 ? Number(aggregate.total_target_cost || 0) / targets : 0;

    return NextResponse.json({
      summary: {
        ...aggregate,
        cost_per_target: Number(costPerTarget.toFixed(2)),
      },
    });
  },
});
