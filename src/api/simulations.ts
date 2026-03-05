import { apiFetch } from './client';
import type { SimulationInput, Simulation, ScenarioComparison } from '../types/simulation';
import type { DefaultContext } from '../types/foundation';

function getFallbackContext(): DefaultContext {
  let workspaceId = '00000000-0000-4000-8000-000000000001';

  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('vg_current_workspace');
      if (raw) {
        const parsed = JSON.parse(raw) as { id?: string } | null;
        if (parsed?.id) workspaceId = parsed.id;
      }
    } catch {
      // ignore malformed local storage and keep default workspace id
    }
  }

  return {
    workspaceId,
    repoId: 'mock-repo',
    branchId: 'mock-branch',
  };
}

export async function getDefaultContext(): Promise<DefaultContext> {
  const fallback = getFallbackContext();
  const useContextEndpoint = process.env.NEXT_PUBLIC_USE_CONTEXT_ENDPOINT === 'true';
  if (!useContextEndpoint) return fallback;

  try {
    return await apiFetch<DefaultContext>('/context/default');
  } catch {
    return fallback;
  }
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
