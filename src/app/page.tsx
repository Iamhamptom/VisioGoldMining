'use client';

import dynamic from 'next/dynamic';
import { useAuth } from '@/context/auth-provider';

const LandingPage = dynamic(() => import('@/components/LandingPage'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen w-screen bg-black">
      <div className="text-gold font-display text-lg tracking-widest animate-pulse">
        Loading...
      </div>
    </div>
  ),
});

export default function Home() {
  const { token } = useAuth();

  const handleEnter = () => {
    if (token) {
      window.location.href = '/explorer';
    } else {
      window.location.href = '/login';
    }
  };

  return (
    <div className="bg-black w-screen h-screen overflow-hidden relative">
      <div className="ambient-energy" />
      <LandingPage onEnter={handleEnter} />
    </div>
  );
}
