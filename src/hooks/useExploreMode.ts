import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface ExploreModeContextValue {
  isExploreMode: boolean;
  toggleExploreMode: () => void;
  enterExploreMode: () => void;
  exitExploreMode: () => void;
}

const ExploreModeCtx = createContext<ExploreModeContextValue>({
  isExploreMode: false,
  toggleExploreMode: () => {},
  enterExploreMode: () => {},
  exitExploreMode: () => {},
});

export function ExploreModeProvider({ children }: { children: ReactNode }) {
  const [isExploreMode, setIsExploreMode] = useState(false);

  const toggleExploreMode = useCallback(() => setIsExploreMode(prev => !prev), []);
  const enterExploreMode = useCallback(() => setIsExploreMode(true), []);
  const exitExploreMode = useCallback(() => setIsExploreMode(false), []);

  return React.createElement(
    ExploreModeCtx.Provider,
    { value: { isExploreMode, toggleExploreMode, enterExploreMode, exitExploreMode } },
    children
  );
}

export function useExploreMode() {
  return useContext(ExploreModeCtx);
}
