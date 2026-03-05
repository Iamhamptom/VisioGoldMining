import { MiningNav } from '@/components/mining/MiningNav';
import { LeadCaptureForm } from '@/components/mining/LeadCaptureForm';
import { MINING_PHASES } from '@/data/mining-offers';

export default function MiningOffersPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <MiningNav />
      <main className="mx-auto max-w-6xl space-y-6 px-6 py-10">
        <h1 className="text-3xl font-semibold">Phase 0 → Enterprise Offer Catalog</h1>
        <div className="grid gap-4">
          {MINING_PHASES.map((phase) => (
            <article key={phase.id} className="rounded-xl border border-white/10 bg-white/5 p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl font-medium">{phase.title}</h2>
                <p className="text-sm text-gold-400">{phase.priceRange}</p>
              </div>
              <p className="text-sm text-gray-400">{phase.subtitle}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-300">
                {phase.deliverables.map((item) => <li key={item}>{item}</li>)}
              </ul>
              {phase.addons && (
                <div className="mt-3">
                  <p className="text-sm font-medium">Add-ons</p>
                  <ul className="list-disc pl-5 text-sm text-gray-300">
                    {phase.addons.map((addon) => <li key={addon}>{addon}</li>)}
                  </ul>
                </div>
              )}
              {phase.performanceFee && <p className="mt-2 text-sm text-gray-300">Performance fee: {phase.performanceFee}</p>}
              {phase.recurring && <p className="mt-1 text-sm text-gray-300">Recurring: {phase.recurring}</p>}
            </article>
          ))}
        </div>
        <LeadCaptureForm sourcePage="/mining/offers" defaultInterest="offer-scope" />
      </main>
    </div>
  );
}
