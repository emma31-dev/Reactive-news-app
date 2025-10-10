"use client";

import dynamic from 'next/dynamic';
import React from 'react';
import Loader from './ui/Loader';

// Dynamically import the HeliaProvider with SSR turned off.
// This ensures that the Helia instance and its dependencies are only loaded on the client side.
const HeliaProvider = dynamic(
  () => import('./HeliaProvider').then((mod) => mod.HeliaProvider),
  {
    ssr: false,
    // Optional: a loading component while the provider is being loaded.
    loading: () => <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"><Loader /></div>,
  }
);

export function ClientOnlyHeliaProvider({ children }: { children: React.ReactNode }) {
  return <HeliaProvider>{children}</HeliaProvider>;
}
