import pool from '../db/pool.js';
import { getTaskTemplates } from '../templates/taskTemplates.js';
import { DOC_CHECKLISTS } from '../templates/docChecklists.js';
import { createArtifact, getDefaultContext } from './foundation.service.js';
import { PRIORS } from '../config/priors.js';
import crypto from 'crypto';

interface GeneratePlanInput {
  name: string;
  project_type: 'exploration' | 'small_mine' | 'industrial';
  target_polygon?: string;
  logistics_mode?: string;
  security_posture?: string;
  timeline_aggressiveness?: string;
  simulation_id?: string;
}

export async function generatePlan(repoId: string, branchId: string, input: GeneratePlanInput) {
  const ctx = await getDefaultContext();
  const workspaceId = ctx?.workspaceId;

  const timelineFactor = PRIORS.timeline_factor[input.timeline_aggressiveness || 'normal'] ?? 1.0;
  const templates = getTaskTemplates(input.project_type);

  // Build task groups with adjusted durations
  const taskGroups = templates.map(phase => {
    const tasks = phase.tasks.map(t => ({
      id: crypto.randomUUID(),
      name: t.name,
      department: t.department,
      duration_days: {
        min: Math.round(t.duration_days.min * timelineFactor),
        p50: Math.round(t.duration_days.p50 * timelineFactor),
        max: Math.round(t.duration_days.max * timelineFactor),
      },
      required_docs: t.required_docs,
      status: 'pending' as const,
    }));

    const totalMin = tasks.reduce((s, t) => s + t.duration_days.min, 0);
    const totalP50 = tasks.reduce((s, t) => s + t.duration_days.p50, 0);
    const totalMax = tasks.reduce((s, t) => s + t.duration_days.max, 0);

    return {
      phase: phase.phase,
      name: phase.name,
      tasks,
      total_duration_days: { min: totalMin, p50: totalP50, max: totalMax },
    };
  });

  // Build doc checklists
  const docChecklists = DOC_CHECKLISTS.map(cat => ({
    category: cat.category,
    items: cat.items.map(item => ({
      name: item.name,
      category: cat.category,
      required: item.required,
      completed: false,
    })),
  }));

  // Build risk register
  const riskRegister = buildRiskRegister(input.project_type, input.security_posture, input.logistics_mode);

  // Timeline summary
  const timelineSummary = {
    total_p50_days: taskGroups.reduce((s, g) => s + g.total_duration_days.p50, 0),
    phases: taskGroups.map(g => ({ name: g.name, p50_days: g.total_duration_days.p50 })),
  };

  // Link simulation budget if available
  let budgetSummary = undefined;
  if (input.simulation_id) {
    const { rows } = await pool.query('SELECT outputs FROM simulations WHERE id = $1', [input.simulation_id]);
    if (rows.length > 0 && rows[0].outputs) {
      const outputs = rows[0].outputs;
      budgetSummary = {
        total_p50: outputs.total_cost?.p50 ?? 0,
        department_costs: (outputs.department_costs || []).map((d: { department: string; label: string; cost: { p50: number } }) => ({
          department: d.department,
          label: d.label,
          p50: d.cost.p50,
        })),
      };
    }
  }

  const planJson = {
    project_type: input.project_type,
    target_polygon: input.target_polygon,
    task_groups: taskGroups,
    doc_checklists: docChecklists,
    risk_register: riskRegister,
    budget_summary: budgetSummary,
    timeline_summary: timelineSummary,
  };

  // Persist to database
  const { rows } = await pool.query(
    `INSERT INTO project_plans (workspace_id, repo_id, branch_id, name, plan_json, simulation_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [workspaceId, repoId, branchId, input.name || 'DRC Project Plan', JSON.stringify(planJson), input.simulation_id || null]
  );

  const plan = rows[0];

  // Create artifact
  await createArtifact(branchId, 'PLAN', plan.id, planJson);

  return {
    id: plan.id,
    name: plan.name,
    plan_json: planJson,
    created_at: plan.created_at,
  };
}

export async function listPlans(branchId: string) {
  const { rows } = await pool.query(
    'SELECT id, name, created_at FROM project_plans WHERE branch_id = $1 ORDER BY created_at DESC',
    [branchId]
  );
  return rows;
}

export async function getPlan(id: string) {
  const { rows } = await pool.query('SELECT * FROM project_plans WHERE id = $1', [id]);
  if (rows.length === 0) return null;
  return rows[0];
}

function buildRiskRegister(projectType: string, securityPosture?: string, logisticsMode?: string) {
  const risks = [
    {
      id: crypto.randomUUID(),
      category: 'Security',
      description: 'Armed group activity may disrupt field operations',
      likelihood: securityPosture === 'high' ? 'medium' as const : 'high' as const,
      impact: 'high' as const,
      mitigation: 'Engage local security provider; establish community liaison; monitor UN OCHA security updates',
    },
    {
      id: crypto.randomUUID(),
      category: 'Regulatory',
      description: 'CAMI permit processing delays beyond expected timeline',
      likelihood: 'high' as const,
      impact: 'medium' as const,
      mitigation: 'Maintain regular contact with CAMI; engage Kinshasa-based mining counsel; prepare applications well in advance',
    },
    {
      id: crypto.randomUUID(),
      category: 'Logistics',
      description: 'Road access cut during rainy season (Oct-Dec)',
      likelihood: logisticsMode === 'road' ? 'high' as const : 'medium' as const,
      impact: 'medium' as const,
      mitigation: 'Schedule critical logistics during dry season; maintain emergency supply cache at camp',
    },
    {
      id: crypto.randomUUID(),
      category: 'Community',
      description: 'Community opposition to project activities',
      likelihood: 'medium' as const,
      impact: 'high' as const,
      mitigation: 'Conduct early stakeholder engagement; negotiate cahier des charges; establish grievance mechanism',
    },
    {
      id: crypto.randomUUID(),
      category: 'Technical',
      description: 'Geological results do not support economic mineralization',
      likelihood: projectType === 'exploration' ? 'medium' as const : 'low' as const,
      impact: 'high' as const,
      mitigation: 'Stage exploration work with go/no-go decision gates; focus on highest-priority targets first',
    },
    {
      id: crypto.randomUUID(),
      category: 'Financial',
      description: 'Gold price decline impacts project economics',
      likelihood: 'medium' as const,
      impact: 'medium' as const,
      mitigation: 'Run scenario analysis at multiple gold prices; structure project for phased investment',
    },
    {
      id: crypto.randomUUID(),
      category: 'Environmental',
      description: 'EIES approval delayed or conditions imposed',
      likelihood: 'medium' as const,
      impact: 'medium' as const,
      mitigation: 'Engage reputable environmental consultant; begin EIES process early in parallel with exploration',
    },
  ];

  return risks;
}
