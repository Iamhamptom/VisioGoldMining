import { apiFetch } from './client';
import type { ProjectPlan } from '../types/projectPlan';

export async function generatePlan(repoId: string, branchId: string, input: {
  name: string;
  project_type: string;
  target_polygon?: string;
  logistics_mode?: string;
  security_posture?: string;
  timeline_aggressiveness?: string;
  simulation_id?: string;
}) {
  return apiFetch<{ id: string; name: string; plan_json: ProjectPlan; created_at: string }>(
    `/repos/${repoId}/branches/${branchId}/project-plan/generate`,
    { method: 'POST', body: JSON.stringify(input) }
  );
}

export async function listPlans(branchId: string) {
  return apiFetch<{ id: string; name: string; created_at: string }[]>(
    `/branches/${branchId}/project-plan`
  );
}
