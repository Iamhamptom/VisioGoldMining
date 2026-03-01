import { describe, it, expect } from 'vitest';
import { computeRiskImpact } from '../engine/riskEngine.js';

describe('riskEngine', () => {
  const baseInput = {
    project_type: 'exploration' as const,
    logistics_mode: 'mixed',
    security_posture: 'med',
    compliance_rigor: 'standard',
    drilling_meters: 5000,
    samples_count: 500,
  };

  it('returns all 5 risk scores', () => {
    const result = computeRiskImpact(baseInput);
    expect(result.security_risk_score).toBeDefined();
    expect(result.legal_complexity_score).toBeDefined();
    expect(result.esg_risk_score).toBeDefined();
    expect(result.access_risk_score).toBeDefined();
    expect(result.data_completeness_score).toBeDefined();
  });

  it('all scores are in [0, 100] range', () => {
    const result = computeRiskImpact(baseInput);
    const scores = [
      result.security_risk_score.score,
      result.legal_complexity_score.score,
      result.esg_risk_score.score,
      result.access_risk_score.score,
      result.data_completeness_score.score,
    ];
    for (const score of scores) {
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    }
  });

  it('high security posture reduces security risk', () => {
    const low = computeRiskImpact({ ...baseInput, security_posture: 'low' });
    const high = computeRiskImpact({ ...baseInput, security_posture: 'high' });
    expect(high.security_risk_score.score).toBeLessThan(low.security_risk_score.score);
  });

  it('investor grade compliance reduces ESG risk', () => {
    const min = computeRiskImpact({ ...baseInput, compliance_rigor: 'minimum' });
    const inv = computeRiskImpact({ ...baseInput, compliance_rigor: 'investor_grade' });
    expect(inv.esg_risk_score.score).toBeLessThan(min.esg_risk_score.score);
  });

  it('heli access increases access risk', () => {
    const road = computeRiskImpact({ ...baseInput, logistics_mode: 'road' });
    const heli = computeRiskImpact({ ...baseInput, logistics_mode: 'heli' });
    expect(heli.access_risk_score.score).toBeGreaterThan(road.access_risk_score.score);
  });

  it('all scores have evidence and mitigations', () => {
    const result = computeRiskImpact(baseInput);
    const allScores = [
      result.security_risk_score,
      result.legal_complexity_score,
      result.esg_risk_score,
      result.access_risk_score,
      result.data_completeness_score,
    ];
    for (const score of allScores) {
      expect(score.evidence.length).toBeGreaterThan(0);
      expect(score.mitigations.length).toBeGreaterThan(0);
    }
  });
});
