import type { Feature, FeatureCollection } from 'geojson';
import type { DimensionScore, Evidence } from './types/opportunities';
import * as turf from '@turf/turf';

function label(value: number): string {
  if (value >= 70) return 'High';
  if (value >= 40) return 'Medium';
  return 'Low';
}

function safeBuffer(feature: Feature, km: number) {
  try {
    return turf.buffer(feature, km, { units: 'kilometers' });
  } catch {
    return feature;
  }
}

export function scoreProspectivity(
  tenement: Feature,
  occurrences: FeatureCollection,
  geology: FeatureCollection
): DimensionScore {
  const buffered = safeBuffer(tenement, 25);
  const evidence: Evidence[] = [];
  let score = 20;

  const nearbyOcc = occurrences.features.filter((f) => {
    try { return turf.booleanIntersects(f, buffered!); } catch { return false; }
  });
  score += Math.min(nearbyOcc.length * 10, 40);
  nearbyOcc.forEach((f) => {
    evidence.push({
      layer_id: 'occurrences',
      description: `${f.properties?.commodity || 'Mineral'} occurrence within 25km`,
    });
  });

  const favorableGeology = geology.features.filter((f) => {
    const litho = String(f.properties?.lithology || '').toLowerCase();
    return (litho.includes('greenstone') || litho.includes('granite') || litho.includes('schist'))
      && (() => { try { return turf.booleanIntersects(f, buffered!); } catch { return false; } })();
  });
  score += Math.min(favorableGeology.length * 15, 30);
  if (favorableGeology.length > 0) {
    evidence.push({ layer_id: 'geology', description: `Favorable geology (${favorableGeology.length} units) nearby` });
  }

  return { value: Math.min(score, 100), label: label(Math.min(score, 100)), evidence };
}

export function scoreAccess(tenement: Feature, infrastructure: FeatureCollection): DimensionScore {
  const evidence: Evidence[] = [];
  let centroidCoords: [number, number];
  try {
    const c = turf.centroid(tenement);
    centroidCoords = c.geometry.coordinates as [number, number];
  } catch { return { value: 30, label: 'Low', evidence }; }
  let score = 30;

  infrastructure.features.forEach((f) => {
    try {
      const fCenter = turf.centroid(f);
      const to = fCenter.geometry.coordinates as [number, number];
      const dist = turf.distance(centroidCoords, to, { units: 'kilometers' });
      if (dist < 50) {
        score += 15;
        evidence.push({
          layer_id: 'infrastructure',
          description: `${f.properties?.name || f.properties?.type || 'Infrastructure'} within ${Math.round(dist)}km`,
        });
      }
    } catch { /* skip */ }
  });

  return { value: Math.min(score, 100), label: label(Math.min(score, 100)), evidence };
}

export function scoreSecurity(tenement: Feature, securityEvents: FeatureCollection): DimensionScore {
  const evidence: Evidence[] = [];
  const buffered = safeBuffer(tenement, 50);
  let score = 100;

  const nearbyEvents = securityEvents.features.filter((f) => {
    try { return turf.booleanIntersects(f, buffered!); } catch { return false; }
  });

  score -= Math.min(nearbyEvents.length * 15, 80);
  nearbyEvents.forEach((f) => {
    evidence.push({
      layer_id: 'security-events',
      description: `${String(f.properties?.event_type || 'Incident').replace(/_/g, ' ')} within 50km (${f.properties?.severity || 'unknown'} severity)`,
    });
  });

  return { value: Math.max(score, 0), label: label(Math.max(score, 0)), evidence };
}

export function scoreLegalComplexity(tenement: Feature): DimensionScore {
  const status = String(tenement.properties?.status || '').toLowerCase();
  const evidence: Evidence[] = [{
    layer_id: 'tenements',
    description: `Permit status: ${tenement.properties?.status || 'unknown'}`,
  }];

  let score = 50;
  if (status === 'granted') score = 85;
  else if (status === 'pending') score = 60;
  else if (status === 'expired') score = 30;

  return { value: score, label: label(score), evidence };
}

export function scoreDataCompleteness(
  tenement: Feature,
  occurrences: FeatureCollection,
  geology: FeatureCollection
): DimensionScore {
  const evidence: Evidence[] = [];
  let score = 0;
  const buffered = safeBuffer(tenement, 25);

  const hasOccurrences = occurrences.features.some((f) => {
    try { return turf.booleanIntersects(f, buffered!); } catch { return false; }
  });
  if (hasOccurrences) {
    score += 35;
    evidence.push({ layer_id: 'occurrences', description: 'Occurrence data available' });
  }

  const hasGeology = geology.features.some((f) => {
    try { return turf.booleanIntersects(f, buffered!); } catch { return false; }
  });
  if (hasGeology) {
    score += 35;
    evidence.push({ layer_id: 'geology', description: 'Geology data available' });
  }

  const props = tenement.properties || {};
  const completeness = ['name', 'holder', 'status', 'area_km2', 'granted_date'].filter((k) => props[k]).length;
  score += completeness * 6;

  return { value: Math.min(score, 100), label: label(Math.min(score, 100)), evidence };
}
