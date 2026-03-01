import { apiFetch } from './client';
import type { SimulationInput, Simulation, ScenarioComparison } from '../types/simulation';
import type { DefaultContext } from '../types/foundation';

export async function getDefaultContext(): Promise<DefaultContext> {
  return apiFetch<DefaultContext>('/context/default');
}

export async function runSimulation(repoId: string, branchId: string, input: SimulationInput) {
  return apiFetch<{ id: string; name: string; seed: number; inputs: SimulationInput; outputs: Simulation['outputs']; created_at: string }>(
    `/repos/${repoId}/branches/${branchId}/simulations/run`,
    { method: 'POST', body: JSON.stringify(input) }
  );
}

export async function listSimulations(branchId: string) {
  return apiFetch<Simulation[]>(`/branches/${branchId}/simulations`);
}

export async function compareSimulations(idA: string, idB: string) {
  return apiFetch<ScenarioComparison>(
    '/simulations/compare',
    { method: 'POST', body: JSON.stringify({ simulation_a_id: idA, simulation_b_id: idB }) }
  );
}
