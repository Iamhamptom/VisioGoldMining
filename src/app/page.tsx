'use client';

import dynamic from 'next/dynamic';
import { useAuth } from '@/context/auth-provider';
import { useRouter } from 'next/navigation';

const LandingPage = dynamic(() => import('@/components/LandingPage'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen w-screen bg-black">
      <div className="text-gold-400 font-display text-lg tracking-widest animate-pulse gold-text-glow">
        Initializing VisioGold...
      </div>
    </div>
  ),
});

export default function Home() {
  const { token } = useAuth();
  const router = useRouter();

  const handleEnter = () => {
    if (token) {
      router.push('/explorer');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="bg-black w-screen h-screen overflow-hidden relative">
      <div className="ambient-energy" />
      <LandingPage onEnter={handleEnter} />
    </div>
  );
}
