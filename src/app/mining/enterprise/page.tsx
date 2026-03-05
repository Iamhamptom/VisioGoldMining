import { MiningNav } from '@/components/mining/MiningNav';
import { LeadCaptureForm } from '@/components/mining/LeadCaptureForm';

const pillars = [
  'Network readiness blueprint via LTE/5G partners',
  'Control room design, training, and governance',
  'Fleet traffic and dispatch integration governance',
  'OEM autonomy readiness and rollout program management',
];

export default function MiningEnterprisePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <MiningNav />
      <main className="mx-auto grid max-w-6xl gap-6 px-6 py-10 md:grid-cols-[2fr,1fr]">
        <section className="space-y-5">
          <h1 className="text-3xl font-semibold">Enterprise Autonomy Readiness</h1>
          <p className="text-gray-300">
            VisioGold does not build OEM autonomy systems from scratch. We provide readiness architecture, integration governance,
            and outcome-focused program execution across partner ecosystems.
          </p>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-medium">Enterprise scope</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-gray-300">
              {pillars.map((pillar) => <li key={pillar}>{pillar}</li>)}
            </ul>
            <p className="mt-4 text-sm text-gold-400">Program range: $200k - $5M+ depending on rollout depth.</p>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-lg font-medium">Delivery model</h3>
            <p className="mt-2 text-sm text-gray-300">
              Readiness and deployment are structured as phased gates with KPI accountability: safety metrics, throughput improvements,
              and reduction in unplanned downtime.
            </p>
          </div>
        </section>
        <LeadCaptureForm sourcePage="/mining/enterprise" defaultInterest="enterprise-program" />
      </main>
    </div>
  );
}
