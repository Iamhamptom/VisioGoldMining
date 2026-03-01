import type { FeatureCollection } from 'geojson';
import type { Opportunity, OpportunityScore } from './types/opportunities';
import {
  scoreProspectivity,
  scoreAccess,
  scoreSecurity,
  scoreLegalComplexity,
  scoreDataCompleteness,
} from './scoring-rules';
import * as turf from '@turf/turf';
import { v4 as uuid } from 'uuid';

import tenementsData from '../data/tenements.geojson';
import geologyData from '../data/geology.geojson';
import occurrencesData from '../data/occurrences.geojson';
import securityData from '../data/security-events.geojson';
import infrastructureData from '../data/infrastructure.geojson';

const PROVINCE_MAP: Record<string, string> = {
  'PR-8832': 'Ituri',
  'PE-4102': 'South Kivu',
  'PR-9921': 'Haut-Uele',
  'PE-5510': 'South Kivu',
  'PR-10492': 'Ituri',
  'PE-6230': 'Haut-Katanga',
  'PR-7744': 'Haut-Katanga',
  'PE-8855': 'Tanganyika',
  'PR-3321': 'North Kivu',
  'PE-4921': 'Ituri',
  'PR-1188': 'Haut-Katanga',
  'PE-2299': 'Maniema',
  'PR-6677': 'Kasai',
  'PE-9100': 'Haut-Katanga',
  'PR-5555': 'North Kivu',
};

export function computeOpportunities(): Opportunity[] {
  const tenements = tenementsData as FeatureCollection;
  const geology = geologyData as FeatureCollection;
  const occurrences = occurrencesData as FeatureCollection;
  const security = securityData as FeatureCollection;
  const infrastructure = infrastructureData as FeatureCollection;

  const opportunities: Opportunity[] = tenements.features.map((tenement) => {
    let centroid: [number, number] = [0, 0];
    let area = 0;
    try {
      const c = turf.centroid(tenement);
      centroid = c.geometry.coordinates as [number, number];
      area = tenement.geometry.type === 'Polygon' ? turf.area(tenement) / 1_000_000 : 0;
    } catch { /* skip */ }

    const scores: OpportunityScore = {
      prospectivity: scoreProspectivity(tenement, occurrences, geology),
      access: scoreAccess(tenement, infrastructure),
      security: scoreSecurity(tenement, security),
      legal_complexity: scoreLegalComplexity(tenement),
      data_completeness: scoreDataCompleteness(tenement, occurrences, geology),
    };

    const composite = Math.round(
      scores.prospectivity.value * 0.30 +
      scores.access.value * 0.20 +
      scores.security.value * 0.20 +
      scores.legal_complexity.value * 0.15 +
      scores.data_completeness.value * 0.15
    );

    const permitId = String(tenement.properties?.permit_number || tenement.properties?.id || 'unknown');
    const name = String(tenement.properties?.name || 'Unknown Zone');

    return {
      id: uuid(),
      title: name,
      permit_id: permitId,
      province: PROVINCE_MAP[permitId] || 'Unknown',
      geom: tenement.geometry,
      centroid,
      area_km2: Math.round(area * 100) / 100,
      commodity: String(tenement.properties?.commodity || 'Gold'),
      scores,
      composite_score: composite,
      why_explained: generateExplanation(scores),
      recommended_next_actions: generateActions(scores),
    };
  });

  return opportunities.sort((a, b) => b.composite_score - a.composite_score);
}

function generateExplanation(scores: OpportunityScore): string {
  const parts: string[] = [];
  if (scores.prospectivity.value >= 70) parts.push('High mineral prospectivity based on nearby occurrences and favorable geology');
  else if (scores.prospectivity.value >= 40) parts.push('Moderate prospectivity with some nearby occurrences');
  if (scores.access.value >= 70) parts.push('Good infrastructure access');
  else if (scores.access.value < 40) parts.push('Remote location with limited infrastructure');
  if (scores.security.value >= 70) parts.push('Low security risk');
  if (scores.security.value < 40) parts.push('Elevated security risk from recent incidents nearby');
  if (scores.legal_complexity.value >= 70) parts.push('Clear legal status with active permit');
  if (scores.data_completeness.value < 40) parts.push('Limited available data — further survey recommended');
  return parts.join('. ') + '.';
}

function generateActions(scores: OpportunityScore): string[] {
  const actions: string[] = [];
  if (scores.data_completeness.value < 60) actions.push('Commission geophysical survey');
  if (scores.prospectivity.value >= 60) actions.push('Request soil sampling program');
  if (scores.legal_complexity.value < 60) actions.push('Verify permit status with CAMI');
  if (scores.security.value < 50) actions.push('Engage local security assessment');
  actions.push('Generate detailed prospect report');
  return actions;
}
