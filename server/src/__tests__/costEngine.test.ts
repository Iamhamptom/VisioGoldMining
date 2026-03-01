import { describe, it, expect } from 'vitest';
import { computeCosts } from '../engine/costEngine.js';

const BASE_INPUT = {
  project_type: 'exploration' as const,
  logistics_mode: 'mixed',
  security_posture: 'med',
  camp_standard: 'standard',
  compliance_rigor: 'standard',
  samples_count: 500,
  assay_package: 'standard',
  labs: 'regional',
  drilling_meters: 5000,
  drilling_type: 'RC',
  seed: 42,
};

describe('costEngine', () => {
  it('produces deterministic output with the same seed', () => {
    const result1 = computeCosts({ ...BASE_INPUT, seed: 42 });
    const result2 = computeCosts({ ...BASE_INPUT, seed: 42 });
    expect(result1.total_cost.p50).toBe(result2.total_cost.p50);
    expect(result1.department_costs.map(d => d.cost.p50)).toEqual(result2.department_costs.map(d => d.cost.p50));
  });

  it('produces different output with different seeds', () => {
    const result1 = computeCosts({ ...BASE_INPUT, seed: 42 });
    const result2 = computeCosts({ ...BASE_INPUT, seed: 99 });
    expect(result1.total_cost.p50).not.toBe(result2.total_cost.p50);
  });

  it('returns all 12 departments', () => {
    const result = computeCosts(BASE_INPUT);
    expect(result.department_costs).toHaveLength(12);
  });

  it('has p10 < p50 < p90 for each department', () => {
    const result = computeCosts(BASE_INPUT);
    for (const dept of result.department_costs) {
      if (dept.cost.p90 > 0) {
        expect(dept.cost.min).toBeLessThanOrEqual(dept.cost.p50);
        expect(dept.cost.p50).toBeLessThanOrEqual(dept.cost.p90);
      }
    }
  });

  it('has p10 < p50 < p90 for total cost', () => {
    const result = computeCosts(BASE_INPUT);
    expect(result.total_cost.min).toBeLessThan(result.total_cost.p50);
    expect(result.total_cost.p50).toBeLessThan(result.total_cost.p90);
  });

  it('higher security posture increases security department cost', () => {
    const lowSec = computeCosts({ ...BASE_INPUT, security_posture: 'low' });
    const highSec = computeCosts({ ...BASE_INPUT, security_posture: 'high' });
    const lowSecCost = lowSec.department_costs.find(d => d.department === 'security')!.cost.p50;
    const highSecCost = highSec.department_costs.find(d => d.department === 'security')!.cost.p50;
    expect(highSecCost).toBeGreaterThan(lowSecCost);
  });

  it('heli logistics increases camp cost vs road', () => {
    const road = computeCosts({ ...BASE_INPUT, logistics_mode: 'road' });
    const heli = computeCosts({ ...BASE_INPUT, logistics_mode: 'heli' });
    const roadCost = road.department_costs.find(d => d.department === 'camp_and_logistics')!.cost.p50;
    const heliCost = heli.department_costs.find(d => d.department === 'camp_and_logistics')!.cost.p50;
    expect(heliCost).toBeGreaterThan(roadCost);
  });

  it('more drilling meters increases drilling campaign cost', () => {
    const small = computeCosts({ ...BASE_INPUT, drilling_meters: 1000 });
    const large = computeCosts({ ...BASE_INPUT, drilling_meters: 20000 });
    const smallCost = small.department_costs.find(d => d.department === 'drilling_campaign')!.cost.p50;
    const largeCost = large.department_costs.find(d => d.department === 'drilling_campaign')!.cost.p50;
    expect(largeCost).toBeGreaterThan(smallCost);
  });

  it('industrial project type costs more than exploration', () => {
    const exploration = computeCosts({ ...BASE_INPUT, project_type: 'exploration' });
    const industrial = computeCosts({ ...BASE_INPUT, project_type: 'industrial' });
    expect(industrial.total_cost.p50).toBeGreaterThan(exploration.total_cost.p50);
  });

  it('confidence is 0.3 for priors-based estimates', () => {
    const result = computeCosts(BASE_INPUT);
    expect(result.total_cost.confidence).toBe(0.3);
    for (const dept of result.department_costs) {
      expect(dept.cost.confidence).toBe(0.3);
    }
  });
});
