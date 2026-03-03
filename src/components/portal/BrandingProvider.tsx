'use client';

import React, { createContext, useContext, useMemo } from 'react';
import type { GovernmentPortal } from '@/types';

interface PortalBranding {
  portal: GovernmentPortal | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  cssVars: Record<string, string>;
}

const BrandingContext = createContext<PortalBranding>({
  portal: null,
  primaryColor: '#1E40AF',
  secondaryColor: '#F59E0B',
  accentColor: '#10B981',
  cssVars: {},
});

export function useBranding() {
  return useContext(BrandingContext);
}

export function BrandingProvider({
  portal,
  children,
}: {
  portal: GovernmentPortal;
  children: React.ReactNode;
}) {
  const branding = useMemo<PortalBranding>(() => ({
    portal,
    primaryColor: portal.primary_color || '#1E40AF',
    secondaryColor: portal.secondary_color || '#F59E0B',
    accentColor: portal.accent_color || '#10B981',
    cssVars: {
      '--portal-primary': portal.primary_color || '#1E40AF',
      '--portal-secondary': portal.secondary_color || '#F59E0B',
      '--portal-accent': portal.accent_color || '#10B981',
    },
  }), [portal]);

  return (
    <BrandingContext.Provider value={branding}>
      <div style={branding.cssVars as React.CSSProperties}>
        {children}
      </div>
    </BrandingContext.Provider>
  );
}
