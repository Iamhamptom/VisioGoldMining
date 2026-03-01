import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { SelectedFeature } from '../lib/types/layers';

interface SelectionContextValue {
  selectedFeature: SelectedFeature | null;
  setSelectedFeature: (feature: SelectedFeature | null) => void;
  clearSelection: () => void;
}

const SelectionContext = createContext<SelectionContextValue>({
  selectedFeature: null,
  setSelectedFeature: () => {},
  clearSelection: () => {},
});

interface SelectionProviderProps {
  children: ReactNode;
  onSelectionChange?: (feature: SelectedFeature | null) => void;
}

export function SelectionProvider({ children, onSelectionChange }: SelectionProviderProps) {
  const [selectedFeature, setSelectedFeatureState] = useState<SelectedFeature | null>(null);

  const setSelectedFeature = useCallback((feature: SelectedFeature | null) => {
    setSelectedFeatureState(feature);
    onSelectionChange?.(feature);
  }, [onSelectionChange]);

  const clearSelection = useCallback(() => {
    setSelectedFeatureState(null);
    onSelectionChange?.(null);
  }, [onSelectionChange]);

  return React.createElement(
    SelectionContext.Provider,
    { value: { selectedFeature, setSelectedFeature, clearSelection } },
    children
  );
}

export function useSelection() {
  return useContext(SelectionContext);
}
