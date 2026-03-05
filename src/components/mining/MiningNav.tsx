'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/mining', label: 'Overview' },
  { href: '/mining/offers', label: 'Offers' },
  { href: '/mining/bundles', label: 'Bundles' },
  { href: '/mining/pricing', label: 'Pricing' },
  { href: '/mining/enterprise', label: 'Enterprise' },
  { href: '/mining/contact', label: 'Contact' },
];

export function MiningNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-white/10 bg-black/80">
      <div className="mx-auto max-w-6xl px-6 py-4">
        <div className="mb-3 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-gold-400">VisioGold Mining</Link>
          <span className="text-xs text-gray-400">DRC-first deployment intelligence</span>
        </div>
        <nav className="flex flex-wrap gap-2">
          {NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? 'border-gold-400/40 bg-gold-400/10 text-gold-400'
                    : 'border-white/10 text-gray-300 hover:border-white/20 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
