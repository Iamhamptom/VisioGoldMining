import { MiningNav } from '@/components/mining/MiningNav';
import { LeadCaptureForm } from '@/components/mining/LeadCaptureForm';
import { MINING_BUNDLES } from '@/data/mining-offers';

export default function MiningBundlesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <MiningNav />
      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-10 md:grid-cols-[2fr,1fr]">
        <section className="space-y-4">
          <h1 className="text-3xl font-semibold">VisioGold Bundles</h1>
          {MINING_BUNDLES.map((bundle) => (
            <article key={bundle.id} className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-xl font-medium">Bundle {bundle.id}: {bundle.name}</h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-300">
                {bundle.includes.map((item) => <li key={item}>{item}</li>)}
              </ul>
              <p className="mt-3 text-sm text-gold-400">Setup: {bundle.setupPrice}</p>
              {bundle.recurringPrice && <p className="text-sm text-gray-300">Managed: {bundle.recurringPrice}</p>}
              {bundle.performanceFee && <p className="text-sm text-gray-300">Performance: {bundle.performanceFee}</p>}
            </article>
          ))}
        </section>
        <LeadCaptureForm sourcePage="/mining/bundles" defaultInterest="bundle-pricing" />
      </main>
    </div>
  );
}
