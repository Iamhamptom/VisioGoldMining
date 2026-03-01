import { describe, it, expect } from 'vitest';
import { computeSchedule } from '../engine/scheduleEngine.js';

describe('scheduleEngine', () => {
  it('returns valid schedule range', () => {
    const result = computeSchedule({
      project_type: 'exploration',
      timeline_aggressiveness: 'normal',
      drilling_meters: 5000,
      seed: 42,
    });
    expect(result.min_days).toBeGreaterThan(0);
    expect(result.min_days).toBeLessThanOrEqual(result.p50_days);
    expect(result.p50_days).toBeLessThanOrEqual(result.p90_days);
  });

  it('fast timeline produces shorter schedule', () => {
    const normal = computeSchedule({ project_type: 'exploration', timeline_aggressiveness: 'normal', drilling_meters: 5000, seed: 42 });
    const fast = computeSchedule({ project_type: 'exploration', timeline_aggressiveness: 'fast', drilling_meters: 5000, seed: 42 });
    expect(fast.p50_days).toBeLessThan(normal.p50_days);
  });

  it('conservative timeline produces longer schedule', () => {
    const normal = computeSchedule({ project_type: 'exploration', timeline_aggressiveness: 'normal', drilling_meters: 5000, seed: 42 });
    const conservative = computeSchedule({ project_type: 'exploration', timeline_aggressiveness: 'conservative', drilling_meters: 5000, seed: 42 });
    expect(conservative.p50_days).toBeGreaterThan(normal.p50_days);
  });

  it('industrial projects have longer schedules than exploration', () => {
    const exploration = computeSchedule({ project_type: 'exploration', timeline_aggressiveness: 'normal', drilling_meters: 5000, seed: 42 });
    const industrial = computeSchedule({ project_type: 'industrial', timeline_aggressiveness: 'normal', drilling_meters: 5000, seed: 42 });
    expect(industrial.p50_days).toBeGreaterThan(exploration.p50_days);
  });

  it('identifies critical path phases', () => {
    const result = computeSchedule({ project_type: 'exploration', timeline_aggressiveness: 'normal', drilling_meters: 5000, seed: 42 });
    expect(result.critical_path.length).toBeGreaterThan(0);
  });

  it('flags aggressive industrial timelines', () => {
    const result = computeSchedule({ project_type: 'industrial', timeline_aggressiveness: 'fast', drilling_meters: 5000, seed: 42 });
    expect(result.risk_flags.some(f => f.includes('Industrial'))).toBe(true);
  });
});
