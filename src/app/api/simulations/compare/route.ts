import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { compareScenarios } from '@/lib/engine/compareEngine';

const compareSchema = z.object({
  scenario_a: z.object({
    id: z.string(),
    name: z.string(),
    department_costs: z.array(z.object({
      department: z.string(),
      label: z.string(),
      cost: z.object({ p50: z.number() }),
    })),
    total_cost: z.object({ p50: z.number() }),
    schedule: z.object({ p50_days: z.number() }),
    risk_impact: z.object({
      security_risk_score: z.object({ score: z.number() }),
      legal_complexity_score: z.object({ score: z.number() }),
      esg_risk_score: z.object({ score: z.number() }),
      access_risk_score: z.object({ score: z.number() }),
      data_completeness_score: z.object({ score: z.number() }),
    }),
  }),
  scenario_b: z.object({
    id: z.string(),
    name: z.string(),
    department_costs: z.array(z.object({
      department: z.string(),
      label: z.string(),
      cost: z.object({ p50: z.number() }),
    })),
    total_cost: z.object({ p50: z.number() }),
    schedule: z.object({ p50_days: z.number() }),
    risk_impact: z.object({
      security_risk_score: z.object({ score: z.number() }),
      legal_complexity_score: z.object({ score: z.number() }),
      esg_risk_score: z.object({ score: z.number() }),
      access_risk_score: z.object({ score: z.number() }),
      data_completeness_score: z.object({ score: z.number() }),
    }),
  }),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scenario_a, scenario_b } = compareSchema.parse(body);

    const result = compareScenarios(scenario_a, scenario_b);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to compare simulations' },
      { status: 500 }
    );
  }
}
