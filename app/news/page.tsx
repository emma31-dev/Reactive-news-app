"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../components/AuthContext';
import { NewsFetcher } from '../../components/NewsFetcher';
import Loader from '../../components/ui/Loader';

export default function NewsPage() {
  const { user, initializing } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If the user is logged in, redirect them away from the news page.
    if (!initializing && user) {
      router.replace('/');
    }
  }, [user, initializing, router]);

  // While checking the auth state, show a loader.
  if (initializing) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size={48} />
      </div>
    );
  }

  // If the user is logged in, they will be redirected, so we can show a loader.
  if (user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size={48} />
      </div>
    );
  }

  // If the user is not logged in, show the news page.
  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Live <span className="!text-blue-600 dark:!text-blue-400">Reactive</span> Network Events</h2>
        <p className="text-sm text-neutral-400">Real-time monitoring of on-chain activity</p>
      </section>
      <section>
        <div className="bg-white/70 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 space-y-3 backdrop-blur-md">
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wide text-neutral-600 dark:text-neutral-400">Monitored Addresses / Tx Hashes</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">Add addresses or transaction hashes to highlight or optionally show only matching events.</p>
          </div>
        </div>
      </section>
      <NewsFetcher />
    </div>
  );
}
