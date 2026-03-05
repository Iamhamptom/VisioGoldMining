import { MiningNav } from '@/components/mining/MiningNav';
import { LeadCaptureForm } from '@/components/mining/LeadCaptureForm';
import { RESELLER_MODEL, REVENUE_SCENARIOS, SUBSCRIPTION_PLANS } from '@/data/mining-offers';

export default function MiningPricingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <MiningNav />
      <main className="mx-auto max-w-6xl space-y-8 px-6 py-10">
        <h1 className="text-3xl font-semibold">Pricing + Recurring Revenue Model</h1>

        <section className="grid gap-4 md:grid-cols-3">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <article key={plan.name} className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h2 className="text-xl font-medium">{plan.name}</h2>
              <p className="text-sm text-gray-400">{plan.audience}</p>
              <p className="mt-3 text-lg text-gold-400">{plan.monthly} / month</p>
              <p className="text-sm text-gray-300">Setup: {plan.setupFee}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-gray-300">
                {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
            </article>
          ))}
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-lg font-medium">Reseller Margin</h3>
            <p className="mt-2 text-sm text-gray-300">{RESELLER_MODEL.licenseMargin}</p>
          </article>
          <article className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-lg font-medium">Implementation Margin</h3>
            <p className="mt-2 text-sm text-gray-300">{RESELLER_MODEL.implementationMargin}</p>
          </article>
          <article className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h3 className="text-lg font-medium">Managed Ops Margin</h3>
            <p className="mt-2 text-sm text-gray-300">{RESELLER_MODEL.managedOps}</p>
          </article>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Revenue Scenarios</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {REVENUE_SCENARIOS.map((scenario) => (
              <article key={scenario.title} className="rounded-xl border border-white/10 bg-white/5 p-5">
                <h3 className="text-lg font-medium">{scenario.title}</h3>
                <p className="mt-1 text-sm text-gold-400">{scenario.annualRange}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-gray-300">
                  {scenario.assumptions.map((assumption) => <li key={assumption}>{assumption}</li>)}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="max-w-md">
          <LeadCaptureForm sourcePage="/mining/pricing" defaultInterest="pricing-sheet" ctaLabel="Request one-page price sheet" />
        </section>
      </main>
    </div>
  );
}
