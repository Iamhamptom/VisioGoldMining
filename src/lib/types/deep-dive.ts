import type { Opportunity } from './opportunities';
import type { DRCProject } from '../../data/drc-projects';

export type DeepDiveTab = 'overview' | 'scores' | 'map' | 'research' | 'documents' | 'ask-ai';

export type DeepDiveTarget =
  | { type: 'opportunity'; data: Opportunity }
  | { type: 'project'; data: DRCProject };

/** Helper to get a display name from either target type */
export function getTargetName(target: DeepDiveTarget): string {
  return target.type === 'opportunity' ? target.data.title : target.data.name;
}

/** Helper to get composite score (projects don't have one — return null) */
export function getTargetScore(target: DeepDiveTarget): number | null {
  return target.type === 'opportunity' ? target.data.composite_score : null;
}

/** Helper to get province */
export function getTargetProvince(target: DeepDiveTarget): string {
  return target.type === 'opportunity'
    ? target.data.province
    : target.data.location.province;
}

/** Helper to get status label */
export function getTargetStatus(target: DeepDiveTarget): string {
  if (target.type === 'project') {
    return target.data.status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
  return 'Opportunity';
}

/** Helper to get centroid [lng, lat] for map centering */
export function getTargetCentroid(target: DeepDiveTarget): [number, number] | null {
  if (target.type === 'opportunity') {
    return target.data.centroid;
  }
  const { lon, lat } = target.data.location;
  if (lon != null && lat != null) return [lon, lat];
  return null;
}
