'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import Sidebar from './Sidebar';
import ChatAgent from './ChatAgent';
import MapArea from './MapArea';
import RightPanel from './RightPanel';
import SettingsModal from './SettingsModal';
import { MapProvider } from '@/hooks/useMap';
import { SelectionProvider } from '@/hooks/useFeatureSelection';
import type { ScreenType } from '@/lib/types/screen';
import type { SelectedFeature } from '@/lib/types/layers';

const BackgroundEffects = () => {
  const particles = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${15 + Math.random() * 25}s`,
    animationDelay: `-${Math.random() * 25}s`,
    width: `${1 + Math.random() * 3}px`,
    height: `${1 + Math.random() * 3}px`,
  })), []);

  return (
    <>
      <div className="ambient-energy" />
      <div className="sonic-waves-container">
        <div className="sonic-wave"></div>
        <div className="sonic-wave"></div>
        <div className="sonic-wave"></div>
        <div className="sonic-wave"></div>
      </div>
      <div className="particles-container">
        {particles.map(p => (
          <div
            key={p.id}
            className="particle"
            style={{
              left: p.left,
              width: p.width,
              height: p.height,
              animationDuration: p.animationDuration,
              animationDelay: p.animationDelay,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default function ExplorerShell() {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);

  const handleSelectionChange = useCallback((feature: SelectedFeature | null) => {
    if (feature) {
      setActiveScreen('feature');
    }
  }, []);

  const handleSetActiveScreen = useCallback((screen: ScreenType) => {
    setActiveScreen(screen);
    if (screen !== 'repo') setSelectedRepo(null);
  }, []);

  return (
    <MapProvider>
      <SelectionProvider onSelectionChange={handleSelectionChange}>
        <div className="bg-black text-white overflow-hidden font-sans w-screen h-screen relative">
          <BackgroundEffects />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="flex h-screen w-screen relative z-10"
          >
            <Sidebar
              activeScreen={activeScreen}
              setActiveScreen={handleSetActiveScreen}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />

            {/* Left Panel: AI Chat Agent */}
            <div className="w-80 h-full border-r border-white/10 bg-black/40 backdrop-blur-2xl flex flex-col z-10 relative shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
              <ChatAgent />
            </div>

            {/* Center Panel: Interactive Map */}
            <div className="flex-1 h-full relative bg-transparent">
              <MapArea activeScreen={activeScreen} />
            </div>

            {/* Right Panel: Context / Details */}
            <div className="w-[450px] h-full border-l border-white/10 bg-black/40 backdrop-blur-2xl flex flex-col z-10 relative shadow-[-4px_0_24px_rgba(0,0,0,0.5)]">
              <RightPanel
                activeScreen={activeScreen}
                selectedRepo={selectedRepo}
                setActiveScreen={setActiveScreen}
                setSelectedRepo={setSelectedRepo}
              />
            </div>
          </motion.div>

          <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
      </SelectionProvider>
    </MapProvider>
  );
}
