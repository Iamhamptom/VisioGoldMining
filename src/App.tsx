import React, { useState, useMemo, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Sidebar from './components/Sidebar';
import ChatAgent from './components/ChatAgent';
import MapArea from './components/MapArea';
import RightPanel from './components/RightPanel';
import LandingPage from './components/LandingPage';
import SettingsModal from './components/SettingsModal';
import { MapProvider } from './hooks/useMap';
import { SelectionProvider } from './hooks/useFeatureSelection';
import type { SelectedFeature } from './lib/types/layers';

import type { ScreenType } from './lib/types/screen';
export type { ScreenType };

const BackgroundEffects = () => {
  const particles = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: `${15 + Math.random() * 25}s`,
    animationDelay: `-${Math.random() * 25}s`, // Negative delay so they are already on screen
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
              animationDelay: p.animationDelay 
            }} 
          />
        ))}
      </div>
    </>
  );
};

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
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
        <div className="bg-black text-text-main overflow-hidden font-sans w-screen h-screen relative">
          <BackgroundEffects />
          <AnimatePresence mode="wait">
            {!hasEntered ? (
              <motion.div key="landing" className="relative z-10 w-full h-full" exit={{ opacity: 0, scale: 1.05 }} transition={{ duration: 0.8, ease: "easeInOut" }}>
                <LandingPage onEnter={() => setHasEntered(true)} />
              </motion.div>
            ) : (
              <motion.div
                key="main"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
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
                  <RightPanel activeScreen={activeScreen} selectedRepo={selectedRepo} setActiveScreen={setActiveScreen} setSelectedRepo={setSelectedRepo} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
      </SelectionProvider>
    </MapProvider>
  );
}
