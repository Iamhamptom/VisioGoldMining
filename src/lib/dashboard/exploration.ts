export interface ExplorationSummaryInput {
  metersDrilled: number;
  hitRate: number;
  costPerTarget: number;
  avgConfidence: number;
  budgetBurnRatio: number;
  targetsCount: number;
}

export interface ExplorationRecommendation {
  recommendation: 'STOP' | 'CONTINUE' | 'PIVOT';
  reasons: string[];
}

export function recommendExplorationAction(input: ExplorationSummaryInput): ExplorationRecommendation {
  const reasons: string[] = [];
  let score = 0;

  if (input.hitRate >= 0.45) {
    score += 2;
    reasons.push('Hit rate is above target threshold.');
  } else if (input.hitRate <= 0.2) {
    score -= 2;
    reasons.push('Hit rate is below minimum threshold.');
  } else {
    reasons.push('Hit rate is moderate but unstable.');
  }

  if (input.avgConfidence >= 70) {
    score += 2;
    reasons.push('Average confidence remains strong.');
  } else if (input.avgConfidence <= 50) {
    score -= 2;
    reasons.push('Average confidence is weak across ranked targets.');
  }

  if (input.costPerTarget <= 120000) {
    score += 1;
    reasons.push('Cost per target remains efficient.');
  } else if (input.costPerTarget >= 300000) {
    score -= 2;
    reasons.push('Cost per target is high relative to expected uplift.');
  }

  if (input.budgetBurnRatio > 1.05) {
    score -= 2;
    reasons.push('Budget burn exceeded planned envelope.');
  } else if (input.budgetBurnRatio < 0.85) {
    reasons.push('Budget burn is below planned spend; capacity remains.');
  }

  if (input.targetsCount < 3) {
    score -= 1;
    reasons.push('Low target count reduces portfolio optionality.');
  }

  if (score >= 2) return { recommendation: 'CONTINUE', reasons };
  if (score <= -2) return { recommendation: 'STOP', reasons };
  return { recommendation: 'PIVOT', reasons };
}
