import { NextResponse } from 'next/server';

// In-memory "database"
let newsCache: any[] = [];

// --- Mock Data Generation ---
const categories = ["Whale Watch", "Governance", "Security", "Market"];
const authors = ["On-Chain Monitor", "DAO Tracker", "Security Bot", "Market Analyst"];

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
  ]
};

function generateMockNewsItem() {
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
let isMonitorRunning = false;
let newsIdCounter = 1; // Start from 1 for 0001, 0002, etc.

// Function to generate 4-digit zero-padded ID
function generateNewsId(): string {
  const id = newsIdCounter.toString().padStart(4, '0');
  newsIdCounter++;
  return id;
}

function startLiveMonitor() {
  if (isMonitorRunning) return;
  isMonitorRunning = true;
  


  // Pre-fill with a few items
  if (newsCache.length === 0) {
    for (let i = 0; i < 5; i++) {
      newsCache.unshift(generateMockNewsItem());
    }
  }

  setInterval(() => {
    const newItem = generateMockNewsItem();
    newsCache.unshift(newItem);

    // Keep the cache size at 90
    if (newsCache.length > 90) {
      const removed = newsCache.pop();
    }
  }, 15000); // Generate a new event every 15 seconds
}

// Start the monitor when the server starts
startLiveMonitor();


/**
 * GET handler to fetch all news items.
 * Reads from the in-memory cache.
 */
export async function GET() {
  try {
    // Return the data from the in-memory cache
    return NextResponse.json(newsCache);
  } catch (error) {
    console.error('Error reading news data:', error);
    return new NextResponse('Internal Server Error: Could not fetch news data.', { status: 500 });
  }
}
