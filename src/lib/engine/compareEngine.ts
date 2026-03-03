interface SimOutputSummary {
  id: string;
  name: string;
  department_costs: { department: string; label: string; cost: { p50: number } }[];
  total_cost: { p50: number };
  schedule: { p50_days: number };
  risk_impact: {
    security_risk_score: { score: number };
    legal_complexity_score: { score: number };
    esg_risk_score: { score: number };
    access_risk_score: { score: number };
    data_completeness_score: { score: number };
  };
}

export interface ComparisonResult {
  scenario_a: { id: string; name: string; total_p50: number };
  scenario_b: { id: string; name: string; total_p50: number };
  delta_cost: { department: string; label: string; delta_p50: number }[];
  delta_total: number;
  delta_schedule_days: number;
  delta_risk: { name: string; delta: number }[];
  recommendation: string;
}

export function compareScenarios(a: SimOutputSummary, b: SimOutputSummary): ComparisonResult {
  const deltaCost = a.department_costs.map((deptA) => {
    const deptB = b.department_costs.find(d => d.department === deptA.department);
    return {
      department: deptA.department,
      label: deptA.label,
      delta_p50: (deptB?.cost.p50 ?? 0) - deptA.cost.p50,
    };
  });

  const deltaTotal = b.total_cost.p50 - a.total_cost.p50;
  const deltaSchedule = b.schedule.p50_days - a.schedule.p50_days;

  const riskKeys = ['security_risk_score', 'legal_complexity_score', 'esg_risk_score', 'access_risk_score', 'data_completeness_score'] as const;
  const riskNames: Record<string, string> = {
    security_risk_score: 'Security Risk',
    legal_complexity_score: 'Legal Complexity',
    esg_risk_score: 'ESG Risk',
    access_risk_score: 'Access Risk',
    data_completeness_score: 'Data Completeness',
  };

  const deltaRisk = riskKeys.map(key => ({
    name: riskNames[key],
    delta: b.risk_impact[key].score - a.risk_impact[key].score,
  }));

  const recommendation = generateRecommendation(a, b, deltaTotal, deltaSchedule, deltaRisk);

  return {
    scenario_a: { id: a.id, name: a.name, total_p50: a.total_cost.p50 },
    scenario_b: { id: b.id, name: b.name, total_p50: b.total_cost.p50 },
    delta_cost: deltaCost,
    delta_total: deltaTotal,
    delta_schedule_days: deltaSchedule,
    delta_risk: deltaRisk,
    recommendation,
  };
}

function generateRecommendation(
  a: SimOutputSummary,
  b: SimOutputSummary,
  deltaTotal: number,
  deltaSchedule: number,
  deltaRisk: { name: string; delta: number }[]
): string {
  const parts: string[] = [];
  const costDeltaPct = Math.abs(deltaTotal) / Math.max(a.total_cost.p50, 1) * 100;
  const cheaper = deltaTotal > 0 ? 'A' : 'B';
  const moreExpensive = deltaTotal > 0 ? 'B' : 'A';

  if (costDeltaPct > 20) {
    parts.push(`Scenario ${moreExpensive} is ${costDeltaPct.toFixed(0)}% more expensive than Scenario ${cheaper} at p50.`);
  } else if (costDeltaPct > 5) {
    parts.push(`Scenario ${moreExpensive} is moderately more expensive (${costDeltaPct.toFixed(0)}% at p50).`);
  } else {
    parts.push('Both scenarios have similar total cost at p50.');
  }

  if (Math.abs(deltaSchedule) > 90) {
    const faster = deltaSchedule > 0 ? 'A' : 'B';
    parts.push(`Scenario ${faster} is ${Math.abs(deltaSchedule)} days faster.`);
  }

  const avgRiskDelta = deltaRisk.reduce((sum, r) => sum + r.delta, 0) / deltaRisk.length;
  if (Math.abs(avgRiskDelta) > 10) {
    const lowerRisk = avgRiskDelta > 0 ? 'A' : 'B';
    parts.push(`Scenario ${lowerRisk} has materially lower overall risk.`);
  }

  if (costDeltaPct <= 5 && Math.abs(avgRiskDelta) <= 5) {
    parts.push('Recommendation: Either scenario is viable. Choose based on strategic priorities.');
  } else if (deltaTotal > 0 && avgRiskDelta >= 0) {
    parts.push('Recommendation: Scenario A is preferred — lower cost and equal or lower risk.');
  } else if (deltaTotal < 0 && avgRiskDelta <= 0) {
    parts.push('Recommendation: Scenario B is preferred — lower cost and equal or lower risk.');
  } else {
    parts.push('Recommendation: Trade-off between cost and risk. Review department-level deltas for decision.');
  }

  return parts.join(' ');
}
