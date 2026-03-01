import { PRIORS } from '../config/priors.js';

interface RiskInput {
  project_type: 'exploration' | 'small_mine' | 'industrial';
  logistics_mode: string;
  security_posture: string;
  compliance_rigor: string;
  drilling_meters: number;
  samples_count: number;
}

export interface RiskScore {
  name: string;
  score: number;
  evidence: string;
  mitigations: string[];
}

export interface RiskImpactOutput {
  security_risk_score: RiskScore;
  legal_complexity_score: RiskScore;
  esg_risk_score: RiskScore;
  access_risk_score: RiskScore;
  data_completeness_score: RiskScore;
}

function clamp(value: number, min: number = 0, max: number = 100): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function computeRiskImpact(input: RiskInput): RiskImpactOutput {
  const baselines = PRIORS.risk_baselines;

  // Security Risk
  let securityScore = baselines.security;
  const securityEvidence: string[] = [];
  const securityMitigations: string[] = [];

  if (input.security_posture === 'low') {
    securityScore += 20;
    securityEvidence.push('Low security posture in DRC increases exposure');
    securityMitigations.push('Hire local security firm with provincial relationships');
  } else if (input.security_posture === 'high') {
    securityScore -= 15;
    securityEvidence.push('High security posture with armed escorts and camp hardening');
    securityMitigations.push('Maintain community liaison to prevent local friction');
  } else {
    securityEvidence.push('Moderate security posture — standard for DRC exploration');
    securityMitigations.push('Maintain regular security assessment updates');
  }
  if (input.logistics_mode === 'heli') {
    securityScore -= 5;
    securityEvidence.push('Helicopter access reduces ground transit exposure');
  }

  // Legal Complexity
  let legalScore = baselines.legal_complexity;
  const legalEvidence: string[] = [];
  const legalMitigations: string[] = [];

  if (input.project_type === 'industrial') {
    legalScore += 15;
    legalEvidence.push('Industrial projects require CAMI exploitation permit — lengthy process');
    legalMitigations.push('Engage Kinshasa-based mining counsel early');
  } else if (input.project_type === 'exploration') {
    legalScore -= 10;
    legalEvidence.push('Exploration permits (PR) are relatively straightforward');
  }
  if (input.compliance_rigor === 'investor_grade') {
    legalScore -= 5;
    legalEvidence.push('Investor-grade compliance reduces legal risk through due diligence');
    legalMitigations.push('Conduct title verification and boundary survey');
  }
  legalEvidence.push('DRC Mining Code 2018 applies — annual surface rights fees required');
  legalMitigations.push('Budget for annual permit renewals and maintain CAMI relationships');

  // ESG Risk
  let esgScore = baselines.esg;
  const esgEvidence: string[] = [];
  const esgMitigations: string[] = [];

  if (input.compliance_rigor === 'minimum') {
    esgScore += 20;
    esgEvidence.push('Minimum compliance may not meet international ESG standards');
    esgMitigations.push('Engage ESG consultant for gap analysis');
  } else if (input.compliance_rigor === 'investor_grade') {
    esgScore -= 15;
    esgEvidence.push('Investor-grade compliance aligns with IFC Performance Standards');
  } else {
    esgEvidence.push('Standard compliance — meets DRC Mining Code requirements');
  }
  if (input.project_type === 'industrial') {
    esgScore += 10;
    esgEvidence.push('Industrial operations have higher environmental footprint');
    esgMitigations.push('Commission Environmental and Social Impact Assessment (ESIA) early');
  }
  esgEvidence.push('DRC projects require environmental compliance per Mining Code 2018');
  esgMitigations.push('Implement community development agreements per DRC Mining Code Art. 285');

  // Access Risk
  let accessScore = baselines.access;
  const accessEvidence: string[] = [];
  const accessMitigations: string[] = [];

  if (input.logistics_mode === 'heli') {
    accessScore += 15;
    accessEvidence.push('Helicopter-only access is weather-dependent and expensive');
    accessMitigations.push('Establish fuel cache and backup landing zone');
  } else if (input.logistics_mode === 'road') {
    accessScore -= 15;
    accessEvidence.push('Road access provides reliable year-round logistics');
  } else {
    accessEvidence.push('Mixed logistics mode — seasonal road access with heli backup');
    accessMitigations.push('Plan field work during dry season (June-September)');
  }
  if (input.drilling_meters > 10000) {
    accessScore += 5;
    accessEvidence.push('Large drilling program requires sustained access and resupply');
  }

  // Data Completeness
  let dataScore = baselines.data_completeness;
  const dataEvidence: string[] = ['Using calibrated priors — no site-specific data yet'];
  const dataMitigations: string[] = [];

  if (input.samples_count > 500) {
    dataScore -= 10;
    dataEvidence.push(`Planned ${input.samples_count} samples will improve geological confidence`);
  }
  if (input.drilling_meters > 5000) {
    dataScore -= 10;
    dataEvidence.push(`Planned ${input.drilling_meters}m drilling will significantly reduce uncertainty`);
  }
  dataMitigations.push('Collect vendor quotes to replace prior-based estimates');
  dataMitigations.push('Integrate historical geological data when available');

  return {
    security_risk_score: {
      name: 'Security Risk',
      score: clamp(securityScore),
      evidence: securityEvidence.join('. '),
      mitigations: securityMitigations,
    },
    legal_complexity_score: {
      name: 'Legal Complexity',
      score: clamp(legalScore),
      evidence: legalEvidence.join('. '),
      mitigations: legalMitigations,
    },
    esg_risk_score: {
      name: 'ESG Risk',
      score: clamp(esgScore),
      evidence: esgEvidence.join('. '),
      mitigations: esgMitigations,
    },
    access_risk_score: {
      name: 'Access Risk',
      score: clamp(accessScore),
      evidence: accessEvidence.join('. '),
      mitigations: accessMitigations,
    },
    data_completeness_score: {
      name: 'Data Completeness',
      score: clamp(dataScore),
      evidence: dataEvidence.join('. '),
      mitigations: dataMitigations,
    },
  };
}
