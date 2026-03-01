import { describe, it, expect } from 'vitest';
import { compareScenarios } from '../engine/compareEngine.js';

const scenarioA = {
  id: 'a',
  name: 'Scenario A',
  department_costs: [
    { department: 'security', label: 'Security', cost: { p50: 100000 } },
    { department: 'drilling_campaign', label: 'Drilling', cost: { p50: 500000 } },
  ],
  total_cost: { p50: 600000 },
  schedule: { p50_days: 300 },
  risk_impact: {
    security_risk_score: { score: 40 },
    legal_complexity_score: { score: 50 },
    esg_risk_score: { score: 30 },
    access_risk_score: { score: 45 },
    data_completeness_score: { score: 60 },
  },
};

const scenarioB = {
  id: 'b',
  name: 'Scenario B',
  department_costs: [
    { department: 'security', label: 'Security', cost: { p50: 200000 } },
    { department: 'drilling_campaign', label: 'Drilling', cost: { p50: 300000 } },
  ],
  total_cost: { p50: 500000 },
  schedule: { p50_days: 400 },
  risk_impact: {
    security_risk_score: { score: 20 },
    legal_complexity_score: { score: 50 },
    esg_risk_score: { score: 30 },
    access_risk_score: { score: 55 },
    data_completeness_score: { score: 60 },
  },
};

describe('compareEngine', () => {
  it('computes correct cost deltas', () => {
    const result = compareScenarios(scenarioA, scenarioB);
    const securityDelta = result.delta_cost.find(d => d.department === 'security');
    expect(securityDelta?.delta_p50).toBe(100000); // B is 100k more for security
    const drillingDelta = result.delta_cost.find(d => d.department === 'drilling_campaign');
    expect(drillingDelta?.delta_p50).toBe(-200000); // B is 200k less for drilling
  });

  it('computes correct total delta', () => {
    const result = compareScenarios(scenarioA, scenarioB);
    expect(result.delta_total).toBe(-100000); // B is 100k cheaper overall
  });

  it('computes correct schedule delta', () => {
    const result = compareScenarios(scenarioA, scenarioB);
    expect(result.delta_schedule_days).toBe(100); // B takes 100 more days
  });

  it('computes risk deltas', () => {
    const result = compareScenarios(scenarioA, scenarioB);
    const secRisk = result.delta_risk.find(r => r.name === 'Security Risk');
    expect(secRisk?.delta).toBe(-20); // B has 20 lower security risk
  });

  it('generates a recommendation string', () => {
    const result = compareScenarios(scenarioA, scenarioB);
    expect(result.recommendation.length).toBeGreaterThan(0);
  });

  it('identifies significant cost differences', () => {
    const expensiveB = {
      ...scenarioB,
      total_cost: { p50: 1200000 }, // 100% more expensive
    };
    const result = compareScenarios(scenarioA, expensiveB);
    expect(result.recommendation).toContain('more expensive');
  });
});
