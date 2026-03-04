'use client';

import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

export interface PursuitContext {
  activeProjectId: string | null;
  activePhase: number;
  pursuitActive: boolean;
}

interface PursuitContextValue {
  pursuit: PursuitContext;
  startPursuit: (projectId: string) => void;
  setPhase: (phase: number) => void;
  endPursuit: () => void;
}

const PursuitCtx = createContext<PursuitContextValue>({
  pursuit: { activeProjectId: null, activePhase: 0, pursuitActive: false },
  startPursuit: () => {},
  setPhase: () => {},
  endPursuit: () => {},
});

export function PursuitProvider({ children, onPursuitStart }: { children: ReactNode; onPursuitStart?: (projectId: string) => void }) {
  const [pursuit, setPursuit] = useState<PursuitContext>({
    activeProjectId: null,
    activePhase: 0,
    pursuitActive: false,
  });

  const startPursuit = useCallback((projectId: string) => {
    setPursuit({ activeProjectId: projectId, activePhase: 0, pursuitActive: true });
    onPursuitStart?.(projectId);
  }, [onPursuitStart]);

  const setPhase = useCallback((phase: number) => {
    setPursuit(prev => ({ ...prev, activePhase: phase }));
  }, []);

  const endPursuit = useCallback(() => {
    setPursuit({ activeProjectId: null, activePhase: 0, pursuitActive: false });
  }, []);

  return React.createElement(
    PursuitCtx.Provider,
    { value: { pursuit, startPursuit, setPhase, endPursuit } },
    children
  );
}

export function usePursuit() {
  return useContext(PursuitCtx);
}
