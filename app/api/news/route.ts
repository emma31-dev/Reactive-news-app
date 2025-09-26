import { NextResponse } from 'next/server';

// In-memory cache (per lambda instance). We generate items lazily per request based on elapsed time.
let newsCache: any[] = [];
let lastGenerationTime: number = Date.now();

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

function generateMockNewsItem(chain?: string) {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const author = authors[Math.floor(Math.random() * authors.length)];
  const randomValue = Math.floor(Math.random() * 10000) + 100;
  const eventData = onChainEvents[category as keyof typeof onChainEvents][Math.floor(Math.random() * onChainEvents[category as keyof typeof onChainEvents].length)];

  return {
    id: generateNewsId(),
    title: `${eventData.event}: ${eventData.description}`,
    content: `Reactive Network detected ${eventData.event} with value ${randomValue.toLocaleString()} REACT. Block confirmation received from validator network.`,
    author: author,
    date: new Date().toISOString(),
    category: category,
    chain: chain || 'Reactive',
    eventType: eventData.event,
    transactionHash: `0x${Math.random().toString(16).slice(2, 64)}`,
    fromAddress: `reactive1${Math.random().toString(16).slice(2, 38)}`,
    toAddress: `reactive1${Math.random().toString(16).slice(2, 38)}`,
    blockHeight: Math.floor(Math.random() * 1000000) + 5000000,
    gasUsed: Math.floor(Math.random() * 200000) + 21000,
    reactValue: randomValue
  };
}

// --- Live Monitor Simulation ---
// We keep an incrementing counter; in serverless cold starts this will reset, so we also embed a timestamp
let newsIdCounter = 1;

// Function to generate 4-digit zero-padded ID
function generateNewsId(): string {
  // Include milliseconds to greatly reduce collision chance after cold start
  const base = newsIdCounter.toString().padStart(4, '0');
  const id = `${Date.now()}-${base}`;
  newsIdCounter++;
  return id;
}

// Seed initial cache with a few items (one per chain) only once per instance
if (newsCache.length === 0) {
  CHAINS.forEach(chain => {
    newsCache.unshift(generateMockNewsItem(chain));
  });
}

/**
 * Lazily generate new items based on elapsed time since last request.
 * For every 5s interval elapsed, generate one item PER CHAIN to reflect interoperability.
 */
function generateElapsedItems() {
  const now = Date.now();
  const elapsedMs = now - lastGenerationTime;
  const INTERVAL = 5000; // 5 seconds
  if (elapsedMs < INTERVAL) return; // less than one interval
  const intervals = Math.floor(elapsedMs / INTERVAL);
  for (let i = 0; i < intervals; i++) {
    for (const chain of CHAINS) {
      newsCache.unshift(generateMockNewsItem(chain));
    }
  }
  // Trim to 300 (keep newest)
  if (newsCache.length > 300) {
    newsCache = newsCache.slice(0, 300);
  }
  lastGenerationTime = now;
}


/**
 * GET handler to fetch all news items.
 * Reads from the in-memory cache.
 */
export async function GET() {
  try {
    // Generate any elapsed items (serverless-friendly)
    generateElapsedItems();
    // Return the data from the in-memory cache
    return NextResponse.json(newsCache);
  } catch (error) {
    console.error('Error reading news data:', error);
    return new NextResponse('Internal Server Error: Could not fetch news data.', { status: 500 });
  }
}
