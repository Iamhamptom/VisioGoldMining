import type { Geometry } from 'geojson';

export interface Artifact {
  id: string;
  type: 'document' | 'dataset' | 'sample' | 'incident';
  name: string;
  location: [number, number];
  date: string;
  description: string;
}

export interface Branch {
  id: string;
  name: string;
  artifacts: Artifact[];
}

export interface Repo {
  id: string;
  name: string;
  description: string;
  polygon: Geometry;
  centroid: [number, number];
  status: 'active' | 'archived';
  created_at: string;
  branches: Branch[];
}
