import Link from 'next/link';
import { notFound } from 'next/navigation';
import ProjectIntelligenceHub from '@/components/screens/ProjectIntelligenceHub';
import { getDRCProjectById } from '@/data/drc-projects';
import { PursuitProvider } from '@/hooks/usePursuitContext';

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = getDRCProjectById(params.id);

  if (!project) {
    notFound();
  }

  return (
    <PursuitProvider>
      <div className="space-y-4">
        <Link
          href="/projects"
          className="inline-flex items-center rounded-lg border border-white/10 px-3 py-2 text-xs text-gray-300 transition-colors hover:border-white/20 hover:text-white"
        >
          Back To Projects
        </Link>
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
          <ProjectIntelligenceHub projectId={project.projectId} />
        </div>
      </div>
    </PursuitProvider>
  );
}
