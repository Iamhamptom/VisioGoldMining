import React, { useState, useEffect } from 'react';
import { GitBranch, FileText, Database, TestTube, AlertTriangle, ArrowLeft, MapPin } from 'lucide-react';
import { getRepoById } from '../../data/repos-mock';
import { useMapContext } from '../../hooks/useMap';
import type { Repo, Branch, Artifact } from '../../lib/types/repos';

const ARTIFACT_ICONS: Record<string, React.ReactNode> = {
  document: <FileText size={14} strokeWidth={1.5} className="text-blue-400" />,
  dataset: <Database size={14} strokeWidth={1.5} className="text-green-400" />,
  sample: <TestTube size={14} strokeWidth={1.5} className="text-purple-400" />,
  incident: <AlertTriangle size={14} strokeWidth={1.5} className="text-red-400" />,
};

const ARTIFACT_COLORS: Record<string, string> = {
  document: '#60A5FA',
  dataset: '#4ADE80',
  sample: '#A78BFA',
  incident: '#F87171',
};

interface Props {
  repoId: string;
}

export default function RepoMapPanel({ repoId }: Props) {
  const { map } = useMapContext();
  const [repo, setRepo] = useState<Repo | null>(null);
  const [activeBranch, setActiveBranch] = useState<string>('main');

  useEffect(() => {
    const r = getRepoById(repoId);
    if (r) {
      setRepo(r);
      setActiveBranch(r.branches[0]?.id || 'main');

      // Fly to repo polygon
      if (map && r.centroid) {
        map.flyTo({ center: r.centroid, zoom: 9, speed: 1.2, essential: true });

        // Add repo boundary if not exists
        const sourceId = `repo-${r.id}`;
        if (!map.getSource(sourceId)) {
          map.addSource(sourceId, { type: 'geojson', data: { type: 'Feature', properties: {}, geometry: r.polygon } });
          map.addLayer({
            id: `${sourceId}-outline`,
            source: sourceId,
            type: 'line',
            paint: { 'line-color': '#D4AF37', 'line-width': 3, 'line-dasharray': [4, 2] },
          });
          map.addLayer({
            id: `${sourceId}-fill`,
            source: sourceId,
            type: 'fill',
            paint: { 'fill-color': '#D4AF37', 'fill-opacity': 0.1 },
          });
        }

        // Add artifact pins
        addArtifactPins(r, activeBranch);
      }
    }

    return () => {
      // Clean up repo layers on unmount
      if (map && repo) {
        const sourceId = `repo-${repo.id}`;
        try {
          if (map.getLayer(`${sourceId}-outline`)) map.removeLayer(`${sourceId}-outline`);
          if (map.getLayer(`${sourceId}-fill`)) map.removeLayer(`${sourceId}-fill`);
          if (map.getSource(sourceId)) map.removeSource(sourceId);
          if (map.getLayer('artifact-pins')) map.removeLayer('artifact-pins');
          if (map.getSource('artifact-pins')) map.removeSource('artifact-pins');
        } catch { /* ignore */ }
      }
    };
  }, [repoId]);

  const addArtifactPins = (r: Repo, branchId: string) => {
    if (!map) return;
    const branch = r.branches.find((b) => b.id === branchId);
    if (!branch) return;

    // Remove existing pins
    try {
      if (map.getLayer('artifact-pins')) map.removeLayer('artifact-pins');
      if (map.getSource('artifact-pins')) map.removeSource('artifact-pins');
    } catch { /* ignore */ }

    const features = branch.artifacts.map((a) => ({
      type: 'Feature' as const,
      properties: { id: a.id, type: a.type, name: a.name },
      geometry: { type: 'Point' as const, coordinates: a.location },
    }));

    map.addSource('artifact-pins', {
      type: 'geojson',
      data: { type: 'FeatureCollection', features },
    });

    map.addLayer({
      id: 'artifact-pins',
      source: 'artifact-pins',
      type: 'circle',
      paint: {
        'circle-radius': 8,
        'circle-color': [
          'match', ['get', 'type'],
          'document', '#60A5FA',
          'dataset', '#4ADE80',
          'sample', '#A78BFA',
          'incident', '#F87171',
          '#D4AF37',
        ],
        'circle-stroke-color': '#FFFFFF',
        'circle-stroke-width': 2,
      },
    });
  };

  const handleBranchChange = (branchId: string) => {
    setActiveBranch(branchId);
    if (repo) addArtifactPins(repo, branchId);
  };

  if (!repo) {
    return <div className="p-6 text-text-muted text-sm">Repo not found</div>;
  }

  const currentBranch = repo.branches.find((b) => b.id === activeBranch);

  return (
    <div className="p-6 flex flex-col gap-5">
      {/* Header */}
      <header>
        <div className="text-xs text-gold-400 font-mono mb-1">{repo.id}</div>
        <h1 className="text-xl font-light tracking-tight text-white mb-1">{repo.name}</h1>
        <p className="text-xs text-text-muted">{repo.description}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border text-green-400 border-green-400/30 bg-green-400/10 font-semibold">
            {repo.status}
          </span>
          <span className="text-[10px] text-text-muted">Created {new Date(repo.created_at).toLocaleDateString()}</span>
        </div>
      </header>

      {/* Branch Selector */}
      <div className="glass-panel rounded-xl p-3">
        <div className="flex items-center gap-2 mb-2">
          <GitBranch size={14} strokeWidth={1.5} className="text-gold-400" />
          <span className="text-xs text-text-muted uppercase tracking-wider">Branch</span>
        </div>
        <div className="flex gap-2">
          {repo.branches.map((branch) => (
            <button
              key={branch.id}
              onClick={() => handleBranchChange(branch.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
                activeBranch === branch.id
                  ? 'bg-gold-400/20 text-gold-400 border border-gold-400/30'
                  : 'bg-white/5 text-gray-400 hover:text-white border border-transparent'
              }`}
            >
              {branch.name}
            </button>
          ))}
        </div>
      </div>

      {/* Artifact List */}
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wider text-white border-b border-white/10 pb-2 mb-3">
          Artifacts ({currentBranch?.artifacts.length || 0})
        </h3>
        <div className="flex flex-col gap-2">
          {currentBranch?.artifacts.map((artifact) => (
            <div
              key={artifact.id}
              className="glass-panel rounded-xl p-3 hover:bg-white/5 transition-colors cursor-pointer flex items-start gap-3"
              onClick={() => {
                map?.flyTo({ center: artifact.location, zoom: 11, speed: 1.2 });
              }}
            >
              <div className="mt-0.5">{ARTIFACT_ICONS[artifact.type]}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white font-medium truncate">{artifact.name}</div>
                <div className="text-xs text-text-muted mt-0.5">{artifact.description}</div>
                <div className="text-[10px] text-text-muted mt-1 flex items-center gap-1">
                  <MapPin size={10} strokeWidth={1} />
                  {artifact.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="glass-panel rounded-xl p-3">
        <h4 className="text-[10px] uppercase tracking-widest text-text-muted mb-2">Pin Legend</h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(ARTIFACT_COLORS).map(([type, color]) => (
            <div key={type} className="flex items-center gap-2 text-xs text-gray-300">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              <span className="capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
