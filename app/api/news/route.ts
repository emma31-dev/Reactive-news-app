import { NextResponse } from 'next/server';

// Deterministic stateless generation configuration
const MAX_ITEMS = 500; // Hard cap now 500 (client also caps)
const SOFT_BUFFER = 5; // Maintain a small buffer (495 + fresh batch)
const INTERVAL_MS = 10000; // 10s per interval per chain
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

// Verbose description templates per category
const VERBOSE_TEMPLATES: Record<string, string[]> = {
  'Whale Watch': [
    'Large holder executed a {action} of approximately {usdValue} in {symbol} on {chain}. Movement traced from {fromShort} to {toShort}.',
    'Significant on-chain movement: {symbol} value {usdValue} shifted via single transaction on {chain}.'
  ],
    'Governance': [
    'Proposal {proposalId} entered status "{phase}" with current support at {supportPct}%, quorum target {quorumPct}%.',
    'Governance update: proposal {proposalId} tracking {supportPct}% support; {timeRemaining} remaining.'
  ],
  'Security': [
    'Security monitor flagged interaction cluster near {contractShort}. Severity index {severity}/10. No confirmed exploit yet.',
    'Potential anomaly on {chain}: irregular call pattern; risk index {severity}/10 pending correlation.'
  ],
  'Market': [
    'Market shift: {symbol} 24h est. volume {volumeUsd}, price swing {swingPct}%. Liquidity depth stable across top pools.',
    'Volatility pulse: {symbol} moved {swingPct}% with tightening spreads and balanced order flow.'
  ],
  'DeFi': [
    'Protocol liquidity {netFlow}: net change {flowUsd}. Utilization now {utilizationPct}%.',
    'Yield recalculation: strategy APY now {apyPct}%. Collateral buffer {bufferPct}%.'
  ],
  'NFT': [
    'Collection activity: floor {floorEth} ETH, 24h sales {salesCount}. Recent tx {txShort}.',
    'NFT momentum: median sale {medianEth} ETH; rarity spread widening.'
  ],
  'Staking': [
    'Delegation event: stake {stakeAmount} ({usdValue}) – validator performance {validatorPerf}%.',
    'Restake action: effective APY {apyPct}%. Unbonding queue length {queueLen}.'
  ],
  'Airdrop': [
    'Airdrop snapshot {snapshotTime}; est. claim ratio {claimRatio}.',
    'Distribution phase "{phase}" in preparation; contract gas simulation stable.'
  ]
};

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random()*arr.length)]; }

function buildVerbose(category: string, base: { chain: string; fromAddress: string; toAddress: string; transactionHash: string; }) {
  const templates = VERBOSE_TEMPLATES[category];
  if (!templates) return '';
  const tmpl = pick(templates);
  const rand = (min:number,max:number,dec=0)=> (min + Math.random()*(max-min)).toFixed(dec);
  const replacements: Record<string,string> = {
    action: Math.random()>0.5? 'transfer' : 'accumulation',
    usdValue: `$${(Math.random()* (3_000_000-120_000)+120_000).toFixed(0)}`,
    symbol: pick(['ETH','AVAX','ARB','BNB','USDC','USDT','DAI']),
    chain: base.chain,
    fromShort: base.fromAddress.slice(0,6)+'...'+base.fromAddress.slice(-4),
    toShort: base.toAddress.slice(0,6)+'...'+base.toAddress.slice(-4),
    proposalId: '#'+rand(10,250),
    phase: pick(['Active','Pending','Succeeded','Queued']),
    supportPct: rand(10,95),
    quorumPct: rand(40,60),
    timeRemaining: rand(2,48)+'h',
    severity: rand(2,9),
    contractShort: '0x'+Math.random().toString(16).slice(2,6)+'...'+Math.random().toString(16).slice(2,6),
    volumeUsd: `$${(Math.random()* (9_000_000-400_000)+400_000).toFixed(0)}`,
    swingPct: rand(-12,12),
    netFlow: Math.random()>0.5? 'inflow':'outflow',
    flowUsd: `$${(Math.random()* (850_000-75_000)+75_000).toFixed(0)}`,
    utilizationPct: rand(20,95),
    apyPct: rand(2,34),
    bufferPct: rand(8,27),
    floorEth: rand(0.3,18,2),
    salesCount: rand(10,320),
    txShort: base.transactionHash.slice(0,10)+'...',
    medianEth: rand(0.4,9,2),
    stakeAmount: rand(100,5000),
    validatorPerf: rand(92,99,2),
    queueLen: rand(0,120),
    snapshotTime: rand(2,72)+'h ago',
    claimRatio: rand(10,420)
  };
  return tmpl.replace(/\{(\w+)\}/g, (_,k)=> replacements[k] ?? '');
}

function generateMockNewsItem(sequence: number, chain: string, timestamp: number) {
  const category = categories[Math.floor(Math.random() * categories.length)];
  const author = authors[Math.floor(Math.random() * authors.length)];
  const randomValue = Math.floor(Math.random() * 10000) + 100;
  const eventData = onChainEvents[category as keyof typeof onChainEvents][Math.floor(Math.random() * onChainEvents[category as keyof typeof onChainEvents].length)];
  const transactionHash = `0x${Math.random().toString(16).slice(2, 64)}`;
  const fromAddress = `reactive1${Math.random().toString(16).slice(2, 38)}`;
  const toAddress = `reactive1${Math.random().toString(16).slice(2, 38)}`;

  return {
    id: `${sequence}-${chain.replace(/\s+/g,'_')}-${timestamp}`,
    title: `${eventData.event}: ${eventData.description}`,
    content: `Reactive Network detected ${eventData.event} with value ${randomValue.toLocaleString()} REACT. Block confirmation received from validator network.`,
    author: author,
    date: new Date(timestamp).toISOString(),
    category: category,
    chain: chain,
    eventType: eventData.event,
    transactionHash,
    fromAddress,
    toAddress,
    blockHeight: Math.floor(Math.random() * 1000000) + 5000000,
    gasUsed: Math.floor(Math.random() * 200000) + 21000,
    reactValue: randomValue,
    verbose: buildVerbose(category, { chain, fromAddress, toAddress, transactionHash })
  };
}

/**
 * Deterministically generate the most recent set of items based on time elapsed
 * since a fixed anchor. We derive a stable interval sequence index so cold starts
 * on serverless do not break continuity.
 */
function generateDeterministicItems(): any[] {
  const now = Date.now();
  let intervalsSinceAnchor = Math.floor((now - ANCHOR_EPOCH) / INTERVAL_MS);
  if (intervalsSinceAnchor < 0) intervalsSinceAnchor = 0; // Always at least one interval
  const itemsPerInterval = CHAINS.length;
  const targetCapacity = MAX_ITEMS - SOFT_BUFFER; // 495
  const intervalsNeeded = Math.ceil(targetCapacity / itemsPerInterval);
  const startInterval = Math.max(0, intervalsSinceAnchor - intervalsNeeded + 1);
  const items: any[] = [];
  for (let seq = intervalsSinceAnchor; seq >= startInterval; seq--) {
    const ts = ANCHOR_EPOCH + seq * INTERVAL_MS;
    for (const chain of CHAINS) {
      items.push(generateMockNewsItem(seq, chain, ts));
      if (items.length >= targetCapacity) break;
    }
    if (items.length >= targetCapacity) break;
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
