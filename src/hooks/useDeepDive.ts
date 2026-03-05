import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { DeepDiveTarget, DeepDiveTab } from '@/lib/types/deep-dive';

interface DeepDiveContextValue {
  target: DeepDiveTarget | null;
  activeTab: DeepDiveTab;
  isOpen: boolean;
  openDeepDive: (target: DeepDiveTarget, tab?: DeepDiveTab) => void;
  closeDeepDive: () => void;
  setActiveTab: (tab: DeepDiveTab) => void;
}

const DeepDiveCtx = createContext<DeepDiveContextValue>({
  target: null,
  activeTab: 'overview',
  isOpen: false,
  openDeepDive: () => {},
  closeDeepDive: () => {},
  setActiveTab: () => {},
});

export function DeepDiveProvider({ children }: { children: ReactNode }) {
  const [target, setTarget] = useState<DeepDiveTarget | null>(null);
  const [activeTab, setActiveTab] = useState<DeepDiveTab>('overview');

  const isOpen = target !== null;

  const openDeepDive = useCallback((t: DeepDiveTarget, tab: DeepDiveTab = 'overview') => {
    setTarget(t);
    setActiveTab(tab);
  }, []);

  const closeDeepDive = useCallback(() => {
    setTarget(null);
    setActiveTab('overview');
  }, []);

  return React.createElement(
    DeepDiveCtx.Provider,
    { value: { target, activeTab, isOpen, openDeepDive, closeDeepDive, setActiveTab } },
    children
  );
}

export function useDeepDive() {
  return useContext(DeepDiveCtx);
}
