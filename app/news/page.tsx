import { redirect } from 'next/navigation';

import { NewsFetcher } from '../../components/NewsFetcher';
import { AuthGate } from '../../components/AuthGate';
import ClientOnlyAdvancedMonitor from '../../components/ClientOnlyAdvancedMonitor';

export default function NewsPage() {
  return (
    <AuthGate>
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
            <ClientOnlyAdvancedMonitor hideHeader />
          </div>
        </section>
        <NewsFetcher />
      </div>
    </AuthGate>
  );
}
