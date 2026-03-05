import { describe, it, expect } from 'vitest';
import { recommendExplorationAction } from '@/lib/dashboard/exploration';

describe('exploration recommendation engine', () => {
  it('returns CONTINUE when metrics are strong', () => {
    const output = recommendExplorationAction({
      metersDrilled: 12000,
      hitRate: 0.5,
      costPerTarget: 90000,
      avgConfidence: 78,
      budgetBurnRatio: 0.9,
      targetsCount: 10,
    });

    expect(output.recommendation).toBe('CONTINUE');
    expect(output.reasons.length).toBeGreaterThan(0);
  });

  it('returns STOP when metrics degrade', () => {
    const output = recommendExplorationAction({
      metersDrilled: 4000,
      hitRate: 0.1,
      costPerTarget: 350000,
      avgConfidence: 42,
      budgetBurnRatio: 1.2,
      targetsCount: 2,
    });

    expect(output.recommendation).toBe('STOP');
  });

  it('returns PIVOT for mixed metrics', () => {
    const output = recommendExplorationAction({
      metersDrilled: 7000,
      hitRate: 0.3,
      costPerTarget: 140000,
      avgConfidence: 61,
      budgetBurnRatio: 1,
      targetsCount: 4,
    });

    expect(output.recommendation).toBe('PIVOT');
  });
});
