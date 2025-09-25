"use client";
import React, { ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import Loader from './ui/Loader';

export function AuthGate({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (mounted && !user) {
      router.replace('/login');
    }
  }, [user, router, mounted]);

  if (!mounted) {
    return (
      <div className="flex justify-center items-center h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors">
  <Loader size={72} themeColor="foreground" className="scale-110" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors">
  <Loader size={72} themeColor="foreground" className="scale-110" />
      </div>
    );
  }

  return <>{children}</>;
}
