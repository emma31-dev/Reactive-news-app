import { redirect } from 'next/navigation';
import { NewsFetcher } from '../components/NewsFetcher';
import { AuthGate } from '../components/AuthGate';
import { AdvancedMonitor } from '../components/AdvancedMonitor';

export default function HomePage() {
  return (
    <AuthGate>
      <div className="space-y-6">
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Live <span className="!text-blue-600 dark:!text-blue-400">Reactive</span> Network Events</h2>
          <p className="text-sm text-neutral-400">Real-time monitoring of on-chain activity</p>
        </section>
  <section className="bg-white/70 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 backdrop-blur-md">
          <AdvancedMonitor />
        </section>
        <NewsFetcher />
      </div>
    </AuthGate>
  );
}
