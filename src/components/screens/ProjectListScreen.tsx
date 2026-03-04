'use client';

import { MapPinned, Mountain, Pickaxe } from 'lucide-react';
import { DRC_PROJECTS } from '@/data/drc-projects';
import { useMapContext } from '@/hooks/useMap';

interface ProjectListScreenProps {
  onSelectProject: (projectId: string) => void;
}

function formatStatus(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function ProjectListScreen({ onSelectProject }: ProjectListScreenProps) {
  const { map } = useMapContext();

  return (
    <div className="h-full overflow-y-auto p-5">
      <div className="mb-4">
        <div className="text-[10px] uppercase tracking-[0.3em] text-gold-400">Projects</div>
        <h2 className="mt-2 text-xl font-semibold text-white">DRC Gold Opportunity Grid</h2>
        <p className="mt-1 text-sm text-gray-400">
          Select any mapped project to fly the globe and open the full intelligence dossier.
        </p>
      </div>

      <div className="grid gap-3">
        {DRC_PROJECTS.map((project) => (
          <button
            key={project.projectId}
            onClick={() => {
              if (map && project.location.lat !== null && project.location.lon !== null) {
                map.flyTo({
                  center: [project.location.lon, project.location.lat],
                  zoom: 8.5,
                  pitch: 45,
                  speed: 0.8,
                  essential: true,
                });
              }
              onSelectProject(project.projectId);
            }}
            className="rounded-xl border border-white/10 bg-white/5 p-4 text-left transition-colors hover:border-gold-400/30 hover:bg-gold-400/5"
          >
            <div className="flex items-start gap-3">
              <div className="mt-1 flex h-10 w-10 items-center justify-center rounded-lg border border-gold-400/20 bg-gold-400/10 text-gold-400">
                <Pickaxe size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm font-medium text-white">{project.name}</div>
                  <div className="text-[10px] uppercase tracking-widest text-gold-400">{formatStatus(project.status)}</div>
                </div>
                <div className="mt-1 text-xs text-gray-400">{project.operator}</div>
                <div className="mt-3 grid gap-2 md:grid-cols-3">
                  <div className="rounded-lg border border-white/10 bg-black/20 p-2">
                    <div className="text-[10px] uppercase tracking-widest text-gray-500">Province</div>
                    <div className="mt-1 text-xs text-gray-200">{project.location.province}</div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-black/20 p-2">
                    <div className="text-[10px] uppercase tracking-widest text-gray-500">Resource</div>
                    <div className="mt-1 text-xs text-gray-200">
                      {project.totalResourceMoz ? `${project.totalResourceMoz} Moz` : 'N/A'}
                    </div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-black/20 p-2">
                    <div className="text-[10px] uppercase tracking-widest text-gray-500">Grade</div>
                    <div className="mt-1 text-xs text-gray-200">
                      {project.averageGrade ? `${project.averageGrade} g/t` : 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-gray-400">
                  <span className="inline-flex items-center gap-1">
                    <MapPinned size={12} />
                    {project.accessInfo.nearestCity}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Mountain size={12} />
                    {project.location.belt}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
