"use client";

import React, { createContext, useContext, ReactNode } from 'react';
import { useHelia as useHeliaInternal } from './useHelia'; // dynamic hook

interface HeliaContextValue {
  helia: any | null;
  json: any | null;
  error: Error | null;
  initializing: boolean;
}

const HeliaContext = createContext<HeliaContextValue | undefined>(undefined);

export function HeliaProvider({ children }: { children: ReactNode }) {
  const heliaState = useHeliaInternal();

  return (
    <HeliaContext.Provider value={heliaState}>
      {children}
    </HeliaContext.Provider>
  );
}

export function useHelia() {
  const context = useContext(HeliaContext);
  if (context === undefined) {
    throw new Error('useHelia must be used within a HeliaProvider');
  }
  return context;
}
