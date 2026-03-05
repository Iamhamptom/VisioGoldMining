export interface TargetInput {
  id?: string;
  name: string;
  latitude?: number;
  longitude?: number;
  geochem_anomaly: number;
  structure_score: number;
  alteration_score: number;
  occurrence_proximity_score: number;
  access_score: number;
  security_score: number;
  data_completeness: number;
  planned_meters?: number;
  estimated_cost?: number;
  metadata?: Record<string, unknown>;
}

export interface RankedTarget {
  external_target_id?: string;
  name: string;
  rank: number;
  confidence_score: number;
  data_completeness: number;
  latitude?: number;
  longitude?: number;
  reason_codes: string[];
  risk_flags: string[];
  recommended_phase: number;
  metadata: Record<string, unknown>;
}

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

function calculateConfidence(target: TargetInput): number {
  const score =
    target.geochem_anomaly * 0.24 +
    target.structure_score * 0.20 +
    target.alteration_score * 0.16 +
    target.occurrence_proximity_score * 0.16 +
    target.access_score * 0.10 +
    target.security_score * 0.08 +
    target.data_completeness * 0.06;

  return Number(clamp(score).toFixed(2));
}

function buildReasonCodes(target: TargetInput, confidence: number): string[] {
  const reasons: string[] = [];

  if (target.geochem_anomaly >= 70) reasons.push('GEOCH_HIGH_ANOMALY');
  if (target.structure_score >= 65) reasons.push('STRUCTURE_FAVORABLE');
  if (target.alteration_score >= 65) reasons.push('ALTERATION_SUPPORTIVE');
  if (target.occurrence_proximity_score >= 70) reasons.push('NEAR_KNOWN_MINERALIZATION');
  if (target.access_score >= 60) reasons.push('ACCESSIBLE_LOGISTICS');
  if (target.security_score >= 60) reasons.push('MANAGEABLE_SECURITY');
  if (target.data_completeness >= 70) reasons.push('DATA_RICH_TARGET');

  if (confidence >= 80) reasons.push('HIGH_CONFIDENCE_TARGET');
  else if (confidence >= 60) reasons.push('MEDIUM_CONFIDENCE_TARGET');
  else reasons.push('EARLY_STAGE_TARGET');

  return reasons;
}

function buildRiskFlags(target: TargetInput): string[] {
  const flags: string[] = [];
  if (target.security_score < 45) flags.push('SECURITY_RISK_ELEVATED');
  if (target.access_score < 40) flags.push('ACCESS_CONSTRAINT');
  if (target.data_completeness < 45) flags.push('DATA_GAP');
  if (target.structure_score < 35 && target.geochem_anomaly < 35) flags.push('GEOLOGICAL_SIGNAL_WEAK');
  return flags;
}

function phaseRecommendation(confidence: number, dataCompleteness: number, riskFlags: string[]): number {
  if (confidence >= 82 && dataCompleteness >= 70 && riskFlags.length <= 1) return 5;
  if (confidence >= 72 && dataCompleteness >= 60) return 4;
  if (confidence >= 62) return 3;
  if (confidence >= 50) return 2;
  return 1;
}

export function rankTargets(targets: TargetInput[]): RankedTarget[] {
  const scored = targets.map((target) => {
    const confidence = calculateConfidence(target);
    const reasonCodes = buildReasonCodes(target, confidence);
    const riskFlags = buildRiskFlags(target);

    return {
      external_target_id: target.id,
      name: target.name,
      confidence_score: confidence,
      data_completeness: Number(target.data_completeness.toFixed(2)),
      latitude: target.latitude,
      longitude: target.longitude,
      reason_codes: reasonCodes,
      risk_flags: riskFlags,
      recommended_phase: phaseRecommendation(confidence, target.data_completeness, riskFlags),
      metadata: {
        ...(target.metadata || {}),
        planned_meters: target.planned_meters ?? null,
        estimated_cost: target.estimated_cost ?? null,
      },
    };
  });

  scored.sort((a, b) => b.confidence_score - a.confidence_score);

  return scored.map((target, index) => ({
    ...target,
    rank: index + 1,
  }));
}

export function buildPhasePlan(rankedTargets: RankedTarget[]) {
  const phases = Array.from({ length: 10 }, (_, i) => ({
    phase: i + 1,
    targets: rankedTargets.filter((t) => t.recommended_phase === i + 1).map((t) => t.name),
  }));

  const phaseSummary = phases.map((phase) => ({
    ...phase,
    target_count: phase.targets.length,
  }));

  return {
    phases: phaseSummary,
    primary_focus_phase: rankedTargets[0]?.recommended_phase ?? 1,
    total_targets: rankedTargets.length,
  };
}
