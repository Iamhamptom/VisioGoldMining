import { PRIORS } from '../config/priors.js';
import { createSeededRng, sampleTriangular, percentile } from './distributions.js';

const DEPARTMENTS = [
  'legal_and_tenure',
  'licensing_and_filing',
  'environmental_and_esg',
  'community_engagement',
  'camp_and_logistics',
  'security',
  'mapping_and_remote_sensing',
  'sampling_and_fieldwork',
  'laboratory_assays',
  'drilling_campaign',
  'technical_studies_pea',
  'reporting_and_disclosure',
] as const;

const DEPT_LABELS: Record<string, string> = {
  legal_and_tenure: 'Legal & Tenure',
  licensing_and_filing: 'Licensing & Filing',
  environmental_and_esg: 'Environmental & ESG',
  community_engagement: 'Community Engagement',
  camp_and_logistics: 'Camp & Logistics',
  security: 'Security',
  mapping_and_remote_sensing: 'Mapping & Remote Sensing',
  sampling_and_fieldwork: 'Sampling & Fieldwork',
  laboratory_assays: 'Laboratory Assays',
  drilling_campaign: 'Drilling Campaign',
  technical_studies_pea: 'Technical Studies / PEA',
  reporting_and_disclosure: 'Reporting & Disclosure',
};

interface CostInput {
  project_type: 'exploration' | 'small_mine' | 'industrial';
  logistics_mode: string;
  security_posture: string;
  camp_standard: string;
  compliance_rigor: string;
  samples_count: number;
  assay_package: string;
  labs: string;
  drilling_meters: number;
  drilling_type: string;
  seed: number;
}

export interface DepartmentCostResult {
  department: string;
  label: string;
  cost: { min: number; p50: number; p90: number; confidence: number };
  drivers: string[];
  notes: string;
}

export interface CostEngineOutput {
  department_costs: DepartmentCostResult[];
  total_cost: { min: number; p50: number; p90: number; confidence: number };
}

function getMultiplier(dept: string, multiplierMap: Record<string, number>): number {
  return multiplierMap[dept] ?? 1.0;
}

/**
 * Compute confidence based on the coefficient of variation (CV).
 * Lower CV = tighter distribution = higher confidence.
 */
function computeConfidence(values: number[]): number {
  const n = values.length;
  if (n === 0) return 0;
  const mean = values.reduce((s, v) => s + v, 0) / n;
  if (mean === 0) return 0;
  const variance = values.reduce((s, v) => s + (v - mean) ** 2, 0) / n;
  const cv = Math.sqrt(variance) / mean;
  // Map CV to confidence: CV of 0 → 1.0, CV of 1+ → ~0.1
  return Math.max(0.1, Math.min(1.0, 1.0 - cv * 0.7));
}

export function computeCosts(input: CostInput, iterations: number = 1000): CostEngineOutput {
  const rng = createSeededRng(input.seed);
  const baseCosts = PRIORS.base_costs[input.project_type];

  // Pre-compute effective multipliers per department
  const effectiveMult: Record<string, number> = {};
  const driversByDept: Record<string, string[]> = {};

  for (const dept of DEPARTMENTS) {
    let mult = 1.0;
    const drivers: string[] = [];

    const logMult = getMultiplier(dept, PRIORS.logistics_multiplier[input.logistics_mode] || {});
    if (logMult !== 1.0) { mult *= logMult; drivers.push(`Logistics (${input.logistics_mode}): ×${logMult}`); }

    const secMult = getMultiplier(dept, PRIORS.security_multiplier[input.security_posture] || {});
    if (secMult !== 1.0) { mult *= secMult; drivers.push(`Security (${input.security_posture}): ×${secMult}`); }

    const campMult = getMultiplier(dept, PRIORS.camp_multiplier[input.camp_standard] || {});
    if (campMult !== 1.0) { mult *= campMult; drivers.push(`Camp (${input.camp_standard}): ×${campMult}`); }

    const compMult = getMultiplier(dept, PRIORS.compliance_multiplier[input.compliance_rigor] || {});
    if (compMult !== 1.0) { mult *= compMult; drivers.push(`Compliance (${input.compliance_rigor}): ×${compMult}`); }

    effectiveMult[dept] = mult;
    driversByDept[dept] = drivers;
  }

  // Run Monte Carlo iterations
  const iterationResults: Record<string, number[]> = {};
  const totalIterations: number[] = [];

  for (const dept of DEPARTMENTS) {
    iterationResults[dept] = [];
  }

  for (let i = 0; i < iterations; i++) {
    let iterTotal = 0;

    for (const dept of DEPARTMENTS) {
      let cost: number;

      if (dept === 'laboratory_assays') {
        // Quantity-driven: samples_count × per-sample cost
        const assayPrior = PRIORS.assay_cost_priors[input.assay_package];
        const labMult = PRIORS.lab_location_multiplier[input.labs] ?? 1.0;
        const perSample = sampleTriangular(rng, assayPrior.range[0], assayPrior.range[1], assayPrior.range[2]);
        cost = input.samples_count * perSample * assayPrior.shipping_multiplier * labMult;
      } else if (dept === 'drilling_campaign') {
        // Quantity-driven: drilling_meters × per-meter cost + mobilization
        const drillPrior = PRIORS.drilling_cost_priors[input.drilling_type];
        const perMeter = sampleTriangular(rng, drillPrior.per_meter_range[0], drillPrior.per_meter_range[1], drillPrior.per_meter_range[2]);
        const mobCost = sampleTriangular(rng, PRIORS.drilling_mobilization_range[0], PRIORS.drilling_mobilization_range[1], PRIORS.drilling_mobilization_range[2]);
        cost = input.drilling_meters > 0 ? (input.drilling_meters * perMeter + mobCost) : 0;
      } else {
        // Base cost with multipliers
        const base = baseCosts[dept as keyof typeof baseCosts] as readonly number[];
        cost = sampleTriangular(rng, base[0], base[1], base[2]) * effectiveMult[dept];
      }

      iterationResults[dept].push(cost);
      iterTotal += cost;
    }

    totalIterations.push(iterTotal);
  }

  // Compute percentiles
  const departmentCosts: DepartmentCostResult[] = [];

  for (const dept of DEPARTMENTS) {
    const sorted = [...iterationResults[dept]].sort((a, b) => a - b);
    const drivers = [...driversByDept[dept]];

    if (dept === 'laboratory_assays') {
      drivers.push(`${input.samples_count} samples × ${input.assay_package}`);
      drivers.push(`Lab: ${input.labs}`);
    }
    if (dept === 'drilling_campaign' && input.drilling_meters > 0) {
      drivers.push(`${input.drilling_meters}m ${input.drilling_type} drilling`);
    }

    departmentCosts.push({
      department: dept,
      label: DEPT_LABELS[dept],
      cost: {
        min: Math.round(percentile(sorted, 0.10)),
        p50: Math.round(percentile(sorted, 0.50)),
        p90: Math.round(percentile(sorted, 0.90)),
        confidence: Math.round(computeConfidence(iterationResults[dept]) * 100) / 100,
      },
      drivers,
      notes: 'Based on calibrated DRC priors. Replace with vendor quotes for higher confidence.',
    });
  }

  const sortedTotals = [...totalIterations].sort((a, b) => a - b);

  return {
    department_costs: departmentCosts,
    total_cost: {
      min: Math.round(percentile(sortedTotals, 0.10)),
      p50: Math.round(percentile(sortedTotals, 0.50)),
      p90: Math.round(percentile(sortedTotals, 0.90)),
      confidence: Math.round(computeConfidence(totalIterations) * 100) / 100,
    },
  };
}
