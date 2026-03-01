import { PRIORS } from '../config/priors.js';
import { createSeededRng, sampleTriangular, percentile } from './distributions.js';

interface ScheduleInput {
  project_type: 'exploration' | 'small_mine' | 'industrial';
  timeline_aggressiveness: string;
  drilling_meters: number;
  seed: number;
}

const PHASE_NAMES: Record<string, string> = {
  targeting: 'Targeting + Data Intake',
  company_setup: 'Company Setup + Compliance',
  licensing: 'Licensing Workflow',
  exploration_work: 'Exploration (Mapping/Sampling)',
  drilling: 'Drilling Campaign',
  feasibility: 'Feasibility Studies',
  permitting_esg: 'Permitting + ESG',
  construction: 'Construction + Mobilization',
  operations: 'Operations Readiness',
};

export interface ScheduleOutput {
  min_days: number;
  p50_days: number;
  p90_days: number;
  critical_path: string[];
  risk_flags: string[];
}

export function computeSchedule(input: ScheduleInput, iterations: number = 1000): ScheduleOutput {
  const rng = createSeededRng(input.seed + 7777); // offset seed to avoid correlation with cost
  const phaseDays = PRIORS.schedule_base_days[input.project_type];
  const timelineFactor = PRIORS.timeline_factor[input.timeline_aggressiveness] ?? 1.0;

  const phases = Object.keys(phaseDays);
  const totalIterations: number[] = [];
  const phaseIterations: Record<string, number[]> = {};

  for (const phase of phases) {
    phaseIterations[phase] = [];
  }

  for (let i = 0; i < iterations; i++) {
    let total = 0;
    for (const phase of phases) {
      const base = phaseDays[phase];
      if (base[2] === 0) {
        phaseIterations[phase].push(0);
        continue;
      }
      const days = sampleTriangular(rng, base[0], base[1], base[2]) * timelineFactor;
      phaseIterations[phase].push(days);
      total += days;
    }
    totalIterations.push(total);
  }

  const sortedTotals = [...totalIterations].sort((a, b) => a - b);

  // Determine critical path: phases with highest median duration
  const phaseMedians: { phase: string; median: number }[] = [];
  for (const phase of phases) {
    const sorted = [...phaseIterations[phase]].sort((a, b) => a - b);
    const med = percentile(sorted, 0.50);
    if (med > 0) {
      phaseMedians.push({ phase, median: med });
    }
  }
  phaseMedians.sort((a, b) => b.median - a.median);
  const criticalPath = phaseMedians.slice(0, 4).map(p => PHASE_NAMES[p.phase] || p.phase);

  // Risk flags
  const riskFlags: string[] = [];
  const p50Days = Math.round(percentile(sortedTotals, 0.50));

  if (input.timeline_aggressiveness === 'fast') {
    riskFlags.push('Aggressive timeline increases execution risk and cost overruns');
  }
  if (p50Days > 730) {
    riskFlags.push('Project timeline exceeds 2 years — consider phased approach');
  }
  if (input.drilling_meters > 20000) {
    riskFlags.push('Large drilling program may face mobilization delays');
  }
  if (input.project_type === 'industrial' && input.timeline_aggressiveness === 'fast') {
    riskFlags.push('Industrial projects rarely meet aggressive timelines in DRC');
  }

  return {
    min_days: Math.round(percentile(sortedTotals, 0.10)),
    p50_days: p50Days,
    p90_days: Math.round(percentile(sortedTotals, 0.90)),
    critical_path: criticalPath,
    risk_flags: riskFlags,
  };
}
