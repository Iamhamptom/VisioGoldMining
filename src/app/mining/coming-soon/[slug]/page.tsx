import { notFound } from 'next/navigation';
import { MiningNav } from '@/components/mining/MiningNav';
import { LeadCaptureForm } from '@/components/mining/LeadCaptureForm';
import { COMING_SOON_MODULES } from '@/data/mining-offers';

export default function ComingSoonModulePage({ params }: { params: { slug: string } }) {
  const module = COMING_SOON_MODULES.find((item) => item.slug === params.slug);
  if (!module) return notFound();

  return (
    <div className="min-h-screen bg-black text-white">
      <MiningNav />
      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-10 md:grid-cols-[2fr,1fr]">
        <section className="rounded-xl border border-white/10 bg-white/5 p-6">
          <p className="text-xs uppercase tracking-wider text-gold-400">Coming soon {module.quarter}</p>
          <h1 className="mt-1 text-3xl font-semibold">{module.title}</h1>
          <p className="mt-3 text-gray-300">{module.description}</p>

          <h2 className="mt-6 text-lg font-medium">Dependencies before launch</h2>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-gray-300">
            {module.dependencies.map((dependency) => <li key={dependency}>{dependency}</li>)}
          </ul>
        </section>

        <LeadCaptureForm
          sourcePage={`/mining/coming-soon/${module.slug}`}
          defaultInterest={module.slug}
          ctaLabel="Join early access"
        />
      </main>
    </div>
  );
}
