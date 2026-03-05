import Link from 'next/link';
import { MiningNav } from '@/components/mining/MiningNav';
import { LeadCaptureForm } from '@/components/mining/LeadCaptureForm';
import { COMING_SOON_MODULES, MINING_PHASES } from '@/data/mining-offers';

export default function MiningOverviewPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <MiningNav />
      <main className="mx-auto max-w-6xl space-y-10 px-6 py-10">
        <section className="space-y-4">
          <h1 className="text-4xl font-semibold tracking-tight">Africa&apos;s Mining Intelligence & Deployment Partner</h1>
          <p className="max-w-3xl text-gray-300">
            VisioGold combines targeting intelligence, field-to-board workflows, deployment governance, and partner integrations
            to deliver faster decisions, safer operations, and higher recovery outcomes.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-gray-400">Land</p>
              <p className="mt-1 text-lg font-medium">Phase 0 Targeting Pack</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-gray-400">Expand</p>
              <p className="mt-1 text-lg font-medium">Phase 2 Drill Guidance Retainer</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm text-gray-400">Scale</p>
              <p className="mt-1 text-lg font-medium">Plant & Enterprise Programs</p>
            </div>
          </div>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Product Ladder</h2>
            <Link href="/mining/offers" className="text-sm text-gold-400 hover:underline">View detailed offers</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {MINING_PHASES.map((phase) => (
              <article key={phase.id} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-wide text-gold-400">{phase.subtitle}</p>
                <h3 className="mt-1 text-lg font-medium">{phase.title}</h3>
                <p className="mt-2 text-sm text-gray-300">Price: {phase.priceRange}</p>
                {phase.recurring && <p className="text-sm text-gray-300">Recurring: {phase.recurring}</p>}
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Coming Soon</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {COMING_SOON_MODULES.map((module) => (
              <article key={module.slug} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <h3 className="text-lg font-medium">{module.title}</h3>
                  <span className="text-xs text-gray-400">{module.quarter}</span>
                </div>
                <p className="text-sm text-gray-300">{module.description}</p>
                <Link href={`/mining/coming-soon/${module.slug}`} className="mt-3 inline-block text-sm text-gold-400 hover:underline">
                  Join early access
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-[2fr,1fr]">
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-semibold">How we win with OEM ecosystem partners</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-300">
              <li>License pass-through with 10%-25% partner margin</li>
              <li>Implementation services at 30%-60% gross margin</li>
              <li>Managed operations retainers after go-live</li>
            </ul>
          </div>
          <LeadCaptureForm sourcePage="/mining" defaultInterest="integrated-offer" />
        </section>
      </main>
    </div>
  );
}
