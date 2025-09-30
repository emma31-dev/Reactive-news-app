"use client";
import React, { ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import Loader from './ui/Loader';

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, initializing } = useAuth();
  const disableLogin = process.env.NEXT_PUBLIC_DISABLE_LOGIN === 'true';
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    // If login is disabled (testing mode), do not redirect — allow free access
    if (disableLogin) return;
    // Only redirect to login once initial auth loading finished and there's no user
    if (mounted && !initializing && !user) {
      router.replace('/login');
    }
  }, [user, router, mounted, initializing, disableLogin]);

  if (!mounted || initializing) {
    return (
      <div className="flex justify-center items-center h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors">
  <Loader size={72} themeColor="foreground" className="scale-110" />
      </div>
    );
  }

  // If login is disabled, allow rendering children even when there's no user
  if (disableLogin) return <>{children}</>;

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors">
  <Loader size={72} themeColor="foreground" className="scale-110" />
      </div>
    );
  }

  return <>{children}</>;
}
