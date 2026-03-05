import { MiningNav } from '@/components/mining/MiningNav';
import { LeadCaptureForm } from '@/components/mining/LeadCaptureForm';

export default function MiningContactPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <MiningNav />
      <main className="mx-auto max-w-6xl px-6 py-10">
        <h1 className="mb-4 text-3xl font-semibold">Book a VisioGold Scoping Call</h1>
        <p className="mb-6 max-w-3xl text-gray-300">
          Final pricing is range-based until we complete a 30-60 minute scoping session covering site constraints,
          remoteness, data availability, and partner integration dependencies.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <LeadCaptureForm sourcePage="/mining/contact" defaultInterest="scoping-call" ctaLabel="Book scoping call" />
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-lg font-medium">What we ask on the call</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-300">
              <li>Country, site type, and current project stage</li>
              <li>Target outcomes (targeting, drilling, safety, fleet, recovery)</li>
              <li>Current data landscape and system integrations</li>
              <li>Decision cadence and reporting stakeholders</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
