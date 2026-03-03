'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import Sidebar from './Sidebar';
import ChatAgent from './ChatAgent';
import MapArea from './MapArea';
import RightPanel from './RightPanel';
import SettingsModal from './SettingsModal';
import { ErrorBoundary } from './error-boundary';
import { MapProvider } from '@/hooks/useMap';
import { SelectionProvider } from '@/hooks/useFeatureSelection';
import { PursuitProvider } from '@/hooks/usePursuitContext';
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

  const handlePursuitStart = useCallback(() => {
    setActiveScreen('pursuit');
  }, []);

  return (
    <MapProvider>
      <SelectionProvider onSelectionChange={handleSelectionChange}>
        <PursuitProvider onPursuitStart={handlePursuitStart}>
          <div className="bg-bg-dark text-white overflow-hidden font-sans w-screen h-screen relative">
            <BackgroundEffects />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="flex h-screen w-screen relative z-10"
            >
              <Sidebar
                activeScreen={activeScreen}
                setActiveScreen={handleSetActiveScreen}
                onOpenSettings={() => setIsSettingsOpen(true)}
              />

              {/* Left Panel: AI Chat Agent */}
              <div className="w-80 h-full border-r border-white/10 bg-bg-surface/40 backdrop-blur-2xl flex flex-col z-10 relative shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
                <ErrorBoundary fallback={
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <div className="text-gold-400 text-sm font-medium mb-2">Agent Offline</div>
                    <p className="text-xs text-gray-500">The AI chat agent encountered an error. Refresh to reconnect.</p>
                  </div>
                }>
                  <ChatAgent />
                </ErrorBoundary>
              </div>

              {/* Center Panel: Interactive Map */}
              <div className="flex-1 h-full relative bg-transparent">
                <ErrorBoundary fallback={
                  <div className="flex flex-col items-center justify-center h-full bg-bg-dark">
                    <div className="text-gold-400 text-lg font-light mb-2">Map Unavailable</div>
                    <p className="text-xs text-gray-500 max-w-sm text-center">The interactive map encountered an error. Please refresh the page.</p>
                  </div>
                }>
                  <MapArea activeScreen={activeScreen} />
                </ErrorBoundary>
              </div>

              {/* Right Panel: Context / Details */}
              <div className="w-[450px] h-full border-l border-white/10 bg-bg-surface/40 backdrop-blur-2xl flex flex-col z-10 relative shadow-[-4px_0_24px_rgba(0,0,0,0.5)]">
                <ErrorBoundary fallback={
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <div className="text-gold-400 text-sm font-medium mb-2">Panel Error</div>
                    <p className="text-xs text-gray-500">This panel encountered an error. Try switching to a different view.</p>
                  </div>
                }>
                  <RightPanel
                    activeScreen={activeScreen}
                    selectedRepo={selectedRepo}
                    setActiveScreen={setActiveScreen}
                    setSelectedRepo={setSelectedRepo}
                  />
                </ErrorBoundary>
              </div>
            </motion.div>

            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
          </div>
        </PursuitProvider>
      </SelectionProvider>
    </MapProvider>
  );
}
