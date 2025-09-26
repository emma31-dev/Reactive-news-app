import React from 'react';

const tiers = [
  {
    name: 'Basic Monitor',
    price: 'Free',
    features: [
      'Real-time on-chain event monitoring',
      'All event categories (Whale Watch, Governance, Security, Market, DeFi, NFT, Staking, Airdrop)',
      'Save up to 100 articles for later',
      'Filtering and pagination (25 items/page)',
      'Global chain selector (profile)',
      'Monitored addresses / tx hashes + highlight',
      'User reviews and ratings',
      'Up to 500 cached events (sliding window)',
      'Standard email support',
      'Dark/Light theme support',
    ],
    current: true,
  },
  {
    name: 'Pro Monitor',
    price: '50 REACT/mo',
    features: [
      'All Basic Monitor features',
      'Save unlimited articles',
      'Advanced search & custom filters',
      'Export saved articles to CSV/JSON',
      'Priority customer support',
      'Historical data access (30 days)',
      'Smart contract interaction tracking',
      'Webhook notifications for monitored addresses',
      'Category usage analytics',
      'Custom event decoding overlays',
    ],
    current: false,
    comingSoon: true,
  },
  {
    name: 'Enterprise',
    price: '200 REACT/mo',
    features: [
      'All Pro Monitor features',
      'Unlimited saved articles with team sharing',
      'White-label dashboard customization',
      'Advanced API access & webhooks',
      'Multi-chain monitoring support',
      'Custom event detection algorithms',
      'Advanced analytics & reporting dashboard',
      'Dedicated validator / indexer node access',
      'Team collaboration features',
      '24/7 priority support with SLA',
    ],
    current: false,
    comingSoon: true,
  },
];

export default function PricingPage() {
  return (
    <div className="space-y-8">
      <section className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight"><span className="!text-blue-600 dark:!text-blue-400">Reactive</span> Network Monitoring Plans</h1>
        <p className="text-neutral-400">Choose the monitoring level that fits your on-chain needs.</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-center max-w-6xl mx-auto">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`rounded-lg p-6 border max-w-sm mx-auto w-full ${
              tier.current
                ? 'border-indigo-500 bg-indigo-900/10'
                : 'border-neutral-800 bg-neutral-900/20'
            }`}
          >
            <h2 className="text-xl font-semibold text-indigo-400">{tier.name}</h2>
            <p className="text-4xl font-bold my-4">{tier.price}</p>
            <ul className="space-y-2 text-sm text-neutral-300 text-left">
              {tier.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">✓</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button
              disabled={tier.current || tier.comingSoon}
              className="mt-6 w-full py-2 rounded-md font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              {tier.current ? 'Current Plan' : tier.comingSoon ? 'Coming Soon' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}