import pool from '../db/pool.js';
import { computeCosts } from '../engine/costEngine.js';
import { computeSchedule } from '../engine/scheduleEngine.js';
import { computeRiskImpact } from '../engine/riskEngine.js';
import { compareScenarios } from '../engine/compareEngine.js';
import { createArtifact, getDefaultContext } from './foundation.service.js';

interface RunSimulationInput {
  name: string;
  project_type: 'exploration' | 'small_mine' | 'industrial';
  logistics_mode: string;
  security_posture: string;
  sampling_density_m: number;
  samples_count: number;
  drilling_meters: number;
  drilling_type: string;
  assay_package: string;
  labs: string;
  timeline_aggressiveness: string;
  camp_standard: string;
  compliance_rigor: string;
  currency: string;
  gold_price_assumption: number;
  seed?: number;
}

export async function runSimulation(repoId: string, branchId: string, input: RunSimulationInput) {
  const seed = input.seed ?? Math.floor(Math.random() * 1_000_000);
  const ctx = await getDefaultContext();
  const workspaceId = ctx?.workspaceId;

  // Run cost engine
  const costResult = computeCosts({
    project_type: input.project_type,
    logistics_mode: input.logistics_mode,
    security_posture: input.security_posture,
    camp_standard: input.camp_standard,
    compliance_rigor: input.compliance_rigor,
    samples_count: input.samples_count,
    assay_package: input.assay_package,
    labs: input.labs,
    drilling_meters: input.drilling_meters,
    drilling_type: input.drilling_type,
    seed,
  });

  // Run schedule engine
  const scheduleResult = computeSchedule({
    project_type: input.project_type,
    timeline_aggressiveness: input.timeline_aggressiveness,
    drilling_meters: input.drilling_meters,
    seed,
  });

  // Run risk engine
  const riskResult = computeRiskImpact({
    project_type: input.project_type,
    logistics_mode: input.logistics_mode,
    security_posture: input.security_posture,
    compliance_rigor: input.compliance_rigor,
    drilling_meters: input.drilling_meters,
    samples_count: input.samples_count,
  });

  const outputs = {
    department_costs: costResult.department_costs,
    total_cost: costResult.total_cost,
    schedule: scheduleResult,
    risk_impact: riskResult,
    assumptions: [
      'All costs based on DRC-calibrated priors (v0.1)',
      `Gold price assumption: $${input.gold_price_assumption}/oz`,
      `Currency: ${input.currency}`,
      `Seed: ${seed} (deterministic — same inputs + seed = same outputs)`,
      'Replace priors with vendor quotes for higher confidence',
    ],
  };

  // Persist to database
  const { rows } = await pool.query(
    `INSERT INTO simulations (workspace_id, repo_id, branch_id, name, seed, inputs, outputs)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [workspaceId, repoId, branchId, input.name || 'Untitled Scenario', seed, JSON.stringify(input), JSON.stringify(outputs)]
  );

  const simulation = rows[0];

  // Create artifact
  await createArtifact(branchId, 'SIMULATION', simulation.id, { inputs: input, outputs });

  return {
    id: simulation.id,
    name: simulation.name,
    seed,
    inputs: input,
    outputs,
    created_at: simulation.created_at,
  };
}

export async function getSimulation(id: string) {
  const { rows } = await pool.query('SELECT * FROM simulations WHERE id = $1', [id]);
  if (rows.length === 0) return null;
  const row = rows[0];
  return {
    ...row,
    inputs: row.inputs,
    outputs: row.outputs,
  };
}

export async function listSimulations(branchId: string) {
  const { rows } = await pool.query(
    'SELECT id, name, seed, inputs, created_at FROM simulations WHERE branch_id = $1 ORDER BY created_at DESC',
    [branchId]
  );
  return rows;
}

export async function compareSimulations(idA: string, idB: string) {
  const simA = await getSimulation(idA);
  const simB = await getSimulation(idB);

  if (!simA || !simB) {
    throw new Error('One or both simulations not found');
  }

  return compareScenarios(
    { id: simA.id, name: simA.name, ...simA.outputs },
    { id: simB.id, name: simB.name, ...simB.outputs }
  );
}
