import Link from 'next/link';
import { DRC_PROJECTS } from '@/data/drc-projects';

function formatStatus(value: string) {
  return value.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">DRC Gold Projects</h2>
        <p className="mt-2 text-sm text-gray-400">
          Open any project to review its full intelligence profile, local context, and operational constraints.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {DRC_PROJECTS.map((project) => (
          <Link
            key={project.projectId}
            href={`/projects/${project.projectId}`}
            className="rounded-xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-gold-400/30 hover:bg-gold-400/5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs uppercase tracking-[0.28em] text-gold-400">{project.projectId}</div>
                <h3 className="mt-2 text-lg font-semibold text-white">{project.name}</h3>
                <p className="mt-1 text-sm text-gray-400">{project.operator}</p>
              </div>
              <div className="rounded-full border border-gold-400/20 bg-gold-400/10 px-3 py-1 text-[10px] uppercase tracking-widest text-gold-400">
                {formatStatus(project.status)}
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                <div className="text-[10px] uppercase tracking-widest text-gray-500">Province</div>
                <div className="mt-2 text-sm text-gray-200">{project.location.province}</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                <div className="text-[10px] uppercase tracking-widest text-gray-500">Belt</div>
                <div className="mt-2 text-sm text-gray-200">{project.location.belt}</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                <div className="text-[10px] uppercase tracking-widest text-gray-500">Resource</div>
                <div className="mt-2 text-sm text-gray-200">
                  {project.totalResourceMoz ? `${project.totalResourceMoz} Moz` : 'Pending'}
                </div>
              </div>
              <div className="rounded-lg border border-white/10 bg-black/20 p-3">
                <div className="text-[10px] uppercase tracking-widest text-gray-500">Grade</div>
                <div className="mt-2 text-sm text-gray-200">
                  {project.averageGrade ? `${project.averageGrade} g/t` : 'Pending'}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
