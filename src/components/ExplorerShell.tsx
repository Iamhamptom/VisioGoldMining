'use client';

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { PanelLeftClose, PanelLeftOpen, PanelRightClose, PanelRightOpen } from 'lucide-react';
import Sidebar from './Sidebar';
import ChatAgent from './ChatAgent';
import MapArea from './MapArea';
import RightPanel from './RightPanel';
import SettingsModal from './SettingsModal';
import DeepDiveModal from './deep-dive/DeepDiveModal';
import { ErrorBoundary } from './error-boundary';
import { MapProvider } from '@/hooks/useMap';
import { SelectionProvider } from '@/hooks/useFeatureSelection';
import { PursuitProvider } from '@/hooks/usePursuitContext';
import { DeepDiveProvider } from '@/hooks/useDeepDive';
import { ExploreModeProvider, useExploreMode } from '@/hooks/useExploreMode';
import type { ScreenType } from '@/lib/types/screen';
import type { SelectedFeature } from '@/lib/types/layers';

const LEFT_MIN = 240;
const LEFT_MAX = 520;
const LEFT_DEFAULT = 320;
const RIGHT_MIN = 300;
const RIGHT_MAX = 700;
const RIGHT_DEFAULT = 450;

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
  return (
    <MapProvider>
      <ExploreModeProvider>
        <DeepDiveProvider>
          <ExplorerShellInner />
        </DeepDiveProvider>
      </ExploreModeProvider>
    </MapProvider>
  );
}

function ExplorerShellInner() {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // --- Explore mode ---
  const { isExploreMode } = useExploreMode();

  // --- Resizable panel state ---
  const [leftWidth, setLeftWidth] = useState(LEFT_DEFAULT);
  const [rightWidth, setRightWidth] = useState(RIGHT_DEFAULT);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  // Save/restore panel state when entering/exiting explore mode
  const prevCollapse = useRef({ left: false, right: false });

  useEffect(() => {
    if (isExploreMode) {
      prevCollapse.current = { left: leftCollapsed, right: rightCollapsed };
      setLeftCollapsed(true);
      setRightCollapsed(true);
    } else {
      setLeftCollapsed(prevCollapse.current.left);
      setRightCollapsed(prevCollapse.current.right);
    }
  }, [isExploreMode]);

  // Drag resize handling
  const dragging = useRef<'left' | 'right' | null>(null);
  const dragStart = useRef({ x: 0, width: 0 });

  const onResizeStart = useCallback((side: 'left' | 'right', e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = side;
    dragStart.current = {
      x: e.clientX,
      width: side === 'left' ? leftWidth : rightWidth,
    };
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [leftWidth, rightWidth]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const delta = e.clientX - dragStart.current.x;
      if (dragging.current === 'left') {
        setLeftWidth(Math.max(LEFT_MIN, Math.min(LEFT_MAX, dragStart.current.width + delta)));
      } else {
        setRightWidth(Math.max(RIGHT_MIN, Math.min(RIGHT_MAX, dragStart.current.width - delta)));
      }
    };
    const onMouseUp = () => {
      if (dragging.current) {
        dragging.current = null;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const effectiveLeft = leftCollapsed ? 0 : leftWidth;
  const effectiveRight = rightCollapsed ? 0 : rightWidth;

  // Track the screen before we switch to 'feature' so we can go back
  const screenBeforeFeature = useRef<ScreenType>('home');

  const handleSelectionChange = useCallback((feature: SelectedFeature | null) => {
    if (feature) {
      setActiveScreen((prev) => {
        if (prev !== 'feature') screenBeforeFeature.current = prev;
        return 'feature';
      });
      if (rightCollapsed) setRightCollapsed(false);
    } else {
      // Go back to previous screen when selection is cleared
      setActiveScreen(screenBeforeFeature.current);
    }
  }, [rightCollapsed]);

  const handleSetActiveScreen = useCallback((screen: ScreenType) => {
    setActiveScreen(screen);
    if (screen !== 'repo') setSelectedRepo(null);
    if (screen !== 'projects' && screen !== 'project-detail') setSelectedProjectId(null);
  }, []);

  const handlePursuitStart = useCallback(() => {
    setActiveScreen('pursuit');
  }, []);

  return (
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
            {/* Sidebar — hidden in explore mode */}
            <motion.div
              animate={{ width: isExploreMode ? 0 : 80, opacity: isExploreMode ? 0 : 1 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden shrink-0"
            >
              <Sidebar
                activeScreen={activeScreen}
                setActiveScreen={handleSetActiveScreen}
                onOpenSettings={() => setIsSettingsOpen(true)}
              />
            </motion.div>

            {/* Left Panel: AI Chat Agent */}
            <div
              style={{ width: effectiveLeft, minWidth: leftCollapsed ? 0 : LEFT_MIN }}
              className="h-full border-r border-white/10 bg-bg-surface/40 backdrop-blur-2xl flex flex-col z-10 relative shadow-[4px_0_24px_rgba(0,0,0,0.5)] overflow-hidden transition-[width,min-width] duration-300"
            >
              {!leftCollapsed && (
                <ErrorBoundary fallback={
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <div className="text-gold-400 text-sm font-medium mb-2">Agent Offline</div>
                    <p className="text-xs text-gray-500">The AI chat agent encountered an error. Refresh to reconnect.</p>
                  </div>
                }>
                  <ChatAgent />
                </ErrorBoundary>
              )}
            </div>

            {/* Left Resize Handle */}
            {!leftCollapsed && (
              <div
                onMouseDown={(e) => onResizeStart('left', e)}
                className="w-1.5 h-full cursor-col-resize hover:bg-gold-400/20 active:bg-gold-400/40 transition-colors z-20 flex items-center justify-center group shrink-0"
              >
                <div className="w-0.5 h-12 bg-white/10 group-hover:bg-gold-400/60 rounded-full transition-colors" />
              </div>
            )}

            {/* Center Panel: Interactive Map */}
            <div className="flex-1 h-full relative bg-transparent min-w-[300px]">
              {/* Collapse/Expand toggle buttons — hidden in explore mode */}
              {!isExploreMode && (
                <>
                  <button
                    onClick={() => setLeftCollapsed(c => !c)}
                    className="absolute top-3 left-3 z-30 p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-gray-400 hover:text-gold-400 hover:bg-gold-400/10 transition-all shadow-lg"
                    title={leftCollapsed ? 'Show Chat Panel' : 'Hide Chat Panel'}
                  >
                    {leftCollapsed ? <PanelLeftOpen size={16} strokeWidth={1.5} /> : <PanelLeftClose size={16} strokeWidth={1.5} />}
                  </button>
                  <button
                    onClick={() => setRightCollapsed(c => !c)}
                    className="absolute top-3 right-3 z-30 p-2 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-gray-400 hover:text-gold-400 hover:bg-gold-400/10 transition-all shadow-lg"
                    title={rightCollapsed ? 'Show Details Panel' : 'Hide Details Panel'}
                  >
                    {rightCollapsed ? <PanelRightOpen size={16} strokeWidth={1.5} /> : <PanelRightClose size={16} strokeWidth={1.5} />}
                  </button>
                </>
              )}

              <ErrorBoundary fallback={
                <div className="flex flex-col items-center justify-center h-full bg-bg-dark">
                  <div className="text-gold-400 text-lg font-light mb-2">Map Unavailable</div>
                  <p className="text-xs text-gray-500 max-w-sm text-center">The interactive map encountered an error. Please refresh the page.</p>
                </div>
              }>
                <MapArea activeScreen={activeScreen} />
              </ErrorBoundary>
            </div>

            {/* Right Resize Handle */}
            {!rightCollapsed && (
              <div
                onMouseDown={(e) => onResizeStart('right', e)}
                className="w-1.5 h-full cursor-col-resize hover:bg-gold-400/20 active:bg-gold-400/40 transition-colors z-20 flex items-center justify-center group shrink-0"
              >
                <div className="w-0.5 h-12 bg-white/10 group-hover:bg-gold-400/60 rounded-full transition-colors" />
              </div>
            )}

            {/* Right Panel: Context / Details */}
            <div
              style={{ width: effectiveRight, minWidth: rightCollapsed ? 0 : RIGHT_MIN }}
              className="h-full border-l border-white/10 bg-bg-surface/40 backdrop-blur-2xl flex flex-col z-10 relative shadow-[-4px_0_24px_rgba(0,0,0,0.5)] overflow-hidden transition-[width,min-width] duration-300"
            >
              {!rightCollapsed && (
                <ErrorBoundary fallback={
                  <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                    <div className="text-gold-400 text-sm font-medium mb-2">Panel Error</div>
                    <p className="text-xs text-gray-500">This panel encountered an error. Try switching to a different view.</p>
                  </div>
                }>
                  <RightPanel
                    activeScreen={activeScreen}
                    selectedRepo={selectedRepo}
                    selectedProjectId={selectedProjectId}
                    setActiveScreen={handleSetActiveScreen}
                    setSelectedRepo={setSelectedRepo}
                    setSelectedProjectId={setSelectedProjectId}
                  />
                </ErrorBoundary>
              )}
            </div>
          </motion.div>

          <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
          <DeepDiveModal />
        </div>
      </PursuitProvider>
    </SelectionProvider>
  );
}
