import { NextResponse } from 'next/server';

// Deterministic stateless generation configuration
const MAX_ITEMS = 300; // Aligns with client cap
const INTERVAL_MS = 5000; // 5s per interval per chain
const ANCHOR_EPOCH = Date.UTC(2025, 0, 1, 0, 0, 0, 0); // Fixed start point (Jan 1 2025 UTC)

// Supported chains for interoperability feature
const CHAINS = [
  'Ethereum',
  'Avalanche',
  'Base',
  'BNB Smart Chain',
  'Arbitrum'
];

// --- Mock Data Generation ---
const categories = [
  "Whale Watch",
  "Governance",
  "Security",
  "Market",
  "DeFi",
  "NFT",
  "Staking",
  "Airdrop"
];
const authors = [
  "On-Chain Monitor",
  "DAO Tracker",
  "Security Bot",
  "Market Analyst",
  "DeFi Strategist",
  "NFT Curator",
  "Staking Sentinel",
  "Airdrop Tracker"
];

const onChainEvents = {
  "Whale Watch": [
    { event: "LiquidityAdded", description: "Large liquidity provision detected" },
    { event: "TokenTransfer", description: "Massive token transfer executed" },
    { event: "LiquidityRemoved", description: "Significant liquidity withdrawal" },
    { event: "SwapExecuted", description: "High-volume token swap completed" }
  ],
  "Governance": [
    { event: "ProposalCreated", description: "New governance proposal submitted" },
    { event: "VoteCasted", description: "Governance vote recorded" },
    { event: "ProposalExecuted", description: "Proposal execution completed" },
    { event: "DelegationChanged", description: "Voting power delegation updated" }
  ],
  "Security": [
    { event: "SuspiciousActivity", description: "Anomalous transaction pattern detected" },
    { event: "ContractUpgrade", description: "Smart contract upgrade event" },
    { event: "AccessControlChange", description: "Permission modification detected" },
    { event: "EmergencyPause", description: "Emergency pause mechanism triggered" }
  ],
  "Market": [
    { event: "PriceOracleUpdate", description: "Price feed oracle updated" },
    { event: "ArbitrageOpportunity", description: "Cross-chain arbitrage detected" },
    { event: "LiquidationEvent", description: "Position liquidation executed" },
    { event: "YieldHarvested", description: "Yield farming rewards claimed" }
  ],
  "DeFi": [
    { event: "TVLShift", description: "Significant change in total value locked" },
    { event: "ProtocolUpgrade", description: "DeFi protocol governance upgrade executed" },
    { event: "LiquidityMiningStart", description: "New liquidity mining campaign launched" },
    { event: "StablecoinRebalance", description: "Stablecoin reserve rebalance detected" }
  ],
  "NFT": [
    { event: "CollectionMint", description: "High-demand NFT mint activity" },
    { event: "FloorPriceMove", description: "Notable NFT floor price movement" },
    { event: "WhaleSweep", description: "NFT collection bulk purchase by whale" },
    { event: "TraitRaritySale", description: "Rare trait NFT sale executed" }
  ],
  "Staking": [
    { event: "ValidatorJoined", description: "New validator joined staking set" },
    { event: "UnbondingStarted", description: "Large unbonding operation initiated" },
    { event: "RewardDistribution", description: "Staking rewards distributed" },
    { event: "SlashEvent", description: "Validator slashing event detected" }
  ],
  "Airdrop": [
    { event: "SnapshotTaken", description: "Airdrop snapshot block recorded" },
    { event: "ClaimWindowOpen", description: "Token claim window opened" },
    { event: "UnclaimedReminder", description: "Reminder for unclaimed airdrop tokens" },
    { event: "ClaimSurge", description: "Spike in airdrop claim transactions" }
  ]
};

function generateMockNewsItem(sequence: number, chain: string, timestamp: number) {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const author = authors[Math.floor(Math.random() * authors.length)];
  const randomValue = Math.floor(Math.random() * 10000) + 100;
  const eventData = onChainEvents[category as keyof typeof onChainEvents][Math.floor(Math.random() * onChainEvents[category as keyof typeof onChainEvents].length)];

  return {
    id: `${sequence}-${chain.replace(/\s+/g,'_')}-${timestamp}`,
    title: `${eventData.event}: ${eventData.description}`,
    content: `Reactive Network detected ${eventData.event} with value ${randomValue.toLocaleString()} REACT. Block confirmation received from validator network.`,
    author: author,
    date: new Date(timestamp).toISOString(),
    category: category,
    chain: chain,
    eventType: eventData.event,
    transactionHash: `0x${Math.random().toString(16).slice(2, 64)}`,
    fromAddress: `reactive1${Math.random().toString(16).slice(2, 38)}`,
    toAddress: `reactive1${Math.random().toString(16).slice(2, 38)}`,
    blockHeight: Math.floor(Math.random() * 1000000) + 5000000,
    gasUsed: Math.floor(Math.random() * 200000) + 21000,
    reactValue: randomValue
  };
}

/**
 * Deterministically generate the most recent set of items based on time elapsed
 * since a fixed anchor. We derive a stable interval sequence index so cold starts
 * on serverless do not break continuity.
 */
function generateDeterministicItems(): any[] {
  const now = Date.now();
  const intervalsSinceAnchor = Math.floor((now - ANCHOR_EPOCH) / INTERVAL_MS);
  const itemsPerInterval = CHAINS.length;
  const intervalsNeeded = Math.ceil(MAX_ITEMS / itemsPerInterval);
  const startInterval = Math.max(0, intervalsSinceAnchor - intervalsNeeded + 1);
  const items: any[] = [];
  for (let seq = intervalsSinceAnchor; seq >= startInterval; seq--) {
    const ts = ANCHOR_EPOCH + seq * INTERVAL_MS;
    for (const chain of CHAINS) {
      items.push(generateMockNewsItem(seq, chain, ts));
      if (items.length >= MAX_ITEMS) break;
    }
    if (items.length >= MAX_ITEMS) break;
  }
  return items;
}


/**
 * GET handler to fetch all news items.
 * Reads from the in-memory cache.
 */
export async function GET() {
  try {
    const items = generateDeterministicItems();
    // Occasional log for visibility (5% sampling in production)
    if (process.env.NODE_ENV !== 'production' || Math.random() < 0.05) {
      console.log('[news-api] deterministic generation', {
        count: items.length,
        newest: items[0]?.id,
        oldest: items[items.length - 1]?.id
      });
    }
    const res = NextResponse.json(items);
    res.headers.set('x-reactive-news-count', String(items.length));
    if (items[0]) res.headers.set('x-reactive-news-newest', items[0].id);
    if (items.length > 0) res.headers.set('x-reactive-news-oldest', items[items.length - 1].id);
    return res;
  } catch (error) {
    console.error('Error reading news data:', error);
    return new NextResponse('Internal Server Error: Could not fetch news data.', { status: 500 });
  }
}
