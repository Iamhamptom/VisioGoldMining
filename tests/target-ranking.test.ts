import { describe, it, expect } from 'vitest';
import { rankTargets } from '@/lib/engine/target-ranking';

describe('target ranking engine', () => {
  const targets = [
    {
      name: 'High Confidence',
      geochem_anomaly: 90,
      structure_score: 85,
      alteration_score: 80,
      occurrence_proximity_score: 82,
      access_score: 70,
      security_score: 68,
      data_completeness: 75,
      planned_meters: 2000,
      estimated_cost: 250000,
    },
    {
      name: 'Low Confidence',
      geochem_anomaly: 35,
      structure_score: 40,
      alteration_score: 30,
      occurrence_proximity_score: 42,
      access_score: 38,
      security_score: 45,
      data_completeness: 30,
      planned_meters: 900,
      estimated_cost: 120000,
    },
  ];

  it('ranks by descending confidence score', () => {
    const ranked = rankTargets(targets);
    expect(ranked[0].name).toBe('High Confidence');
    expect(ranked[0].rank).toBe(1);
    expect(ranked[1].rank).toBe(2);
  });

  it('always emits reason codes', () => {
    const ranked = rankTargets(targets);
    expect(ranked[0].reason_codes.length).toBeGreaterThan(0);
    expect(ranked[1].reason_codes.length).toBeGreaterThan(0);
  });

  it('keeps deterministic output for same input', () => {
    const runA = rankTargets(targets);
    const runB = rankTargets(targets);
    expect(runA).toEqual(runB);
  });
});
