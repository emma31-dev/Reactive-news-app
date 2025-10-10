"use client";

import dynamic from 'next/dynamic';
import React from 'react';
import Loader from './ui/Loader';

// Dynamically import the AuthProvider with SSR turned off.
// This ensures that the entire AuthContext, including the useHelia hook, is only loaded on the client side.
const AuthProvider = dynamic(
  () => import('./AuthContext').then((mod) => mod.AuthProvider),
  {
    ssr: false,
    loading: () => <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"><Loader /></div>,
  }
);

export function ClientOnlyAuthProvider({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
