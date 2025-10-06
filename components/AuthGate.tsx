"use client";
import React, { ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import Loader from './ui/Loader';

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, initializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Once initialization is complete, if there's no user, redirect to login.
    if (!initializing && !user) {
      router.replace('/login');
    }
  }, [user, router, initializing]);

  // Show a loader while checking for an active session.
  if (initializing) {
    return (
      <div className="flex justify-center items-center h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors">
        <Loader size={72} themeColor="foreground" className="scale-110" />
      </div>
    );
  }

  // If there's a user, render the protected content.
  if (user) {
    return <>{children}</>;
  }

  // Otherwise, show a loader while redirecting.
  return (
    <div className="flex justify-center items-center h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors">
        <Loader size={72} themeColor="foreground" className="scale-110" />
    </div>
  );
}
