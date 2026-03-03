import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { computeCosts } from '@/lib/engine/costEngine';
import { computeSchedule } from '@/lib/engine/scheduleEngine';
import { computeRiskImpact } from '@/lib/engine/riskEngine';

const simulationInputSchema = z.object({
  name: z.string().min(1).max(200).default('Untitled Scenario'),
  project_type: z.enum(['exploration', 'small_mine', 'industrial']),
  logistics_mode: z.enum(['road', 'mixed', 'heli']),
  security_posture: z.enum(['low', 'med', 'high']),
  sampling_density_m: z.number().min(0).max(10000).optional().default(0),
  samples_count: z.number().int().min(0).max(50000),
  drilling_meters: z.number().min(0).max(100000),
  drilling_type: z.enum(['RC', 'diamond', 'mixed']),
  assay_package: z.enum(['screening', 'standard', 'full_qaqc']),
  labs: z.enum(['local', 'regional', 'international']),
  timeline_aggressiveness: z.enum(['fast', 'normal', 'conservative']),
  camp_standard: z.enum(['basic', 'standard', 'premium']),
  compliance_rigor: z.enum(['minimum', 'standard', 'investor_grade']),
  currency: z.string().default('USD'),
  gold_price_assumption: z.number().min(500).max(10000).default(2000),
  seed: z.number().int().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const input = simulationInputSchema.parse(body);
    const seed = input.seed ?? Math.floor(Math.random() * 1_000_000);

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

    const scheduleResult = computeSchedule({
      project_type: input.project_type,
      timeline_aggressiveness: input.timeline_aggressiveness,
      drilling_meters: input.drilling_meters,
      seed,
    });

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

    return NextResponse.json({
      id: crypto.randomUUID(),
      name: input.name,
      seed,
      inputs: input,
      outputs,
      created_at: new Date().toISOString(),
    }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to run simulation' },
      { status: 500 }
    );
  }
}
