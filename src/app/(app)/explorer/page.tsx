'use client';

import dynamic from 'next/dynamic';

const ExplorerShell = dynamic(() => import('@/components/ExplorerShell'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen w-screen bg-black">
      <div className="text-gold-400 font-display text-lg tracking-widest animate-pulse">
        Initializing Explorer...
      </div>
    </div>
  ),
});

export default function ExplorerPage() {
  return <ExplorerShell />;
}
