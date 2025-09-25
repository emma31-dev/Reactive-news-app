import { redirect } from 'next/navigation';
import { NewsFetcher } from '../components/NewsFetcher';
import { AuthGate } from '../components/AuthGate';

export default function HomePage() {
  return (
    <AuthGate>
      <div className="space-y-6">
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Live <span className="!text-blue-600 dark:!text-blue-400">Reactive</span> Network Events</h2>
          <p className="text-sm text-neutral-400">Real-time monitoring of on-chain activity</p>
        </section>
        <NewsFetcher />
      </div>
    </AuthGate>
  );
}
