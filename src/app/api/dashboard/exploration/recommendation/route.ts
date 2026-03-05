import { NextResponse } from 'next/server';
import { createHandler } from '@/lib/handler';
import { MOCK_MODE } from '@/lib/db';
import { badRequest } from '@/lib/errors';
import { recommendExplorationAction } from '@/lib/dashboard/exploration';
import { getMockMiningState } from '@/lib/mock-mining-store';

export const GET = createHandler({
  roles: ['VIEWER', 'ANALYST', 'ADMIN', 'OWNER'],
  handler: async (req, ctx) => {
    const url = new URL(req.url);
    const repoId = url.searchParams.get('repo_id');
    const branchId = url.searchParams.get('branch_id');

    if (!repoId || !branchId) throw badRequest('repo_id and branch_id are required');

    if (MOCK_MODE) {
      const targets = getMockMiningState().drillTargets.filter(
        (target) => target.workspace_id === ctx.workspaceId && target.repo_id === repoId && target.branch_id === branchId
      );

      const targetsCount = targets.length;
      const avgConfidence = targetsCount > 0
        ? targets.reduce((acc, target) => acc + Number(target.confidence_score || 0), 0) / targetsCount
        : 0;
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
      const costPerTarget = targetsCount > 0 ? totalTargetCost / targetsCount : 0;
      const budgetBurnRatio = Number((totalTargetCost / Math.max(totalTargetCost * 1.05, 1)).toFixed(4));

      const recommendation = recommendExplorationAction({
        metersDrilled: Number(metersDrilled.toFixed(2)),
        hitRate: Number(hitRate.toFixed(4)),
        costPerTarget,
        avgConfidence: Number(avgConfidence.toFixed(2)),
        budgetBurnRatio,
        targetsCount,
      });

      return NextResponse.json({
        recommendation,
        metrics: {
          meters_drilled: Number(metersDrilled.toFixed(2)),
          hit_rate: Number(hitRate.toFixed(4)),
          cost_per_target: Number(costPerTarget.toFixed(2)),
          avg_confidence: Number(avgConfidence.toFixed(2)),
          budget_burn_ratio: budgetBurnRatio,
        },
      });
    }

    const { rows } = await ctx.db.query(
      `SELECT * FROM exploration_kpi_summary
       WHERE workspace_id = $1 AND repo_id = $2 AND branch_id = $3`,
      [ctx.workspaceId, repoId, branchId]
    );

    const kpi = rows[0] || {
      targets_count: 0,
      avg_confidence: 0,
      hit_rate: 0,
      meters_drilled: 0,
      total_target_cost: 0,
    };

    const targetsCount = Number(kpi.targets_count || 0);
    const totalTargetCost = Number(kpi.total_target_cost || 0);
    const costPerTarget = targetsCount > 0 ? totalTargetCost / targetsCount : 0;

    const recommendation = recommendExplorationAction({
      metersDrilled: Number(kpi.meters_drilled || 0),
      hitRate: Number(kpi.hit_rate || 0),
      costPerTarget,
      avgConfidence: Number(kpi.avg_confidence || 0),
      budgetBurnRatio: 1,
      targetsCount,
    });

    return NextResponse.json({
      recommendation,
      metrics: {
        meters_drilled: Number(kpi.meters_drilled || 0),
        hit_rate: Number(kpi.hit_rate || 0),
        cost_per_target: Number(costPerTarget.toFixed(2)),
        avg_confidence: Number(kpi.avg_confidence || 0),
        budget_burn_ratio: 1,
      },
    });
  },
});
