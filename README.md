<div align="center">

# Reactive Events App

Real-time on-chain event monitoring, category filtering, price tracking, and educational hub for the Reactive Network ecosystem.

</div>

##  Core Features (Current)

- Deterministic multi-chain event feed (Ethereum, Avalanche, Base, BNB Smart Chain, Arbitrum) generated every 10s
- Aligned 10s client polling with optional pause/resume auto-refresh control + manual refresh
- Sliding window capacity: 500 most recent events (soft trim before overflow)
- Persistent cumulative total counter (never resets across sessions)
- Lightweight category filter bar (all categories always selectable)
- Per-chain global filter (selected on Profile page) + optional monitored address narrowing
- Monitored Addresses system: add wallet addresses or tx hashes, highlight or show-only
- Copy-to-clipboard icons (summary + detailed table) for tx hash / from / to / any field
- Fresh-first fetching strategy with resilient local cache fallback
- Optional optimistic cache bootstrap (`NEXT_PUBLIC_USE_OPTIMISTIC_CACHE=true`)
- Save-for-later system with local persistence & limit messaging
- New item highlighting (temporary blue pulse indicator + brief Updated pill)
- Pagination (25 events per page) with automatic bounds correction
- Simplified auth (basic local email/password mock) – email verification removed
- Educational "Learn" section and detailed About page
- Real-time style blockchain metadata: tx hash, from/to, proposal ID, etc. (synthetic)
- Glassmorphism UI + dark/light theme
- Responsive layout (mobile → desktop)
- Verification badge component stub (extensible for real chain proofs)

## 🧠 Caching & Data Strategy

The app now uses a fresh-first approach:

1. On mount, it attempts a live fetch from `/api/news`.
2. If the network request fails AND there is no current data, it falls back to `localStorage` (`newsCache`).
3. New items are merged at the top; old items are trimmed to keep a max of 500 (soft buffer keeps us typically at 495 until next batch).
4. New event IDs are tracked in a `Set` to show a temporary "new" visual marker.
5. A success state briefly flashes an "Updated" pill when new events arrive.

### Price Bar Offline Fallback
The price bar now retains and displays the last successfully fetched price if all live API calls fail. Behavior:

| Condition | Display |
|-----------|---------|
| Live fetch succeeds | Fresh price + green pulsing "Live" badge |
| All providers fail, cached price exists | Cached price + amber dot "Offline (cached)" |
| All providers fail, no cached price | N/A values + error flag |

Context adds `offline`, `forceRefresh()`, and `clearCachedPrice()` for manual control. Cached key: `reactPrice:last` in `localStorage`.

### Category Filtering (Simplified)
All categories are always available in the pill bar. The earlier per-user toggle preference system was removed to streamline UX.

### Monitored Address / Tx Hash Filtering
From the Profile page you can add addresses or transaction hashes:

- Highlighting: Matching events receive an accent border and emphasized value text.
- "Show Only Monitored" toggle: Narrows the feed strictly to matching events.
- Clipboard: Each monitored entry and each matching field in the feed has a copy icon.

### Optional Optimistic Cache
If you want to immediately show cached events while fetching fresh data, add to `.env.local`:

```
NEXT_PUBLIC_USE_OPTIMISTIC_CACHE=true
```

### Clearing the Cache (Programmatic)
`NewsContext` now exposes `clearCache()`. Example usage inside a component:

```tsx
import { useNews } from '@/components/NewsContext';

export function CacheControls() {
	const { clearCache, refreshNews, loadedFromCache } = useNews();
	return (
		<div className="flex gap-2">
			<button onClick={() => { clearCache(); refreshNews(); }} className="px-3 py-1 text-xs rounded bg-indigo-600 text-white">Force Fresh</button>
			{loadedFromCache && <span className="text-xs text-amber-500">(cache)</span>}
		</div>
	);
}
```

## 🏗 Tech Stack

- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS
- Context API for auth, news, price, saved items
- LocalStorage for lightweight persistence

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Visit: http://localhost:3000

## 🔧 Environment Variables

Create `.env.local` (see `env.example` if present):

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_USE_OPTIMISTIC_CACHE` | If `true`, show cached events instantly while fetching fresh. |

### Web3 / Reactive Network Integration

To enable on-chain features, add the following variables (addresses are examples — replace with your deployed contract address):

```
NEXT_PUBLIC_REACTIVE_NEWS_CONTRACT=0xYourDeployedContractAddressHere
NEXT_PUBLIC_REACTIVE_CHAIN_ID=5318008
NEXT_PUBLIC_REACTIVE_NETWORK_RPC=https://sepolia-rpc.reactive.network
NEXT_PUBLIC_REACTIVE_NETWORK_EXPLORER=https://sepolia-explorer.reactive.network
```

Deployment Tips:
- Make sure the contract address is NOT the zero address or the UI will show "Contract not ready".
- If you change chain ID, also update RPC + Explorer endpoints accordingly.
- After updating `.env.local`, restart `npm run dev` (Next.js only reads env vars at process start).
- In production (e.g. Vercel), set these in the project Environment Variables UI (scope: Production + Preview).

Runtime Diagnostics:
- Use the Profile page wallet panel to view `WalletDiagnostics`.
- If on the wrong network, a yellow warning will prompt you to switch.
- Contract initialization problems (missing/invalid address) are surfaced in red.
- The connect button attempts to auto-add the Reactive network if MetaMask doesn't have it.

Common Issues:
| Symptom | Likely Cause | Fix |
|---------|--------------|-----|
| "Contract not initialized" errors in console | Zero or invalid contract address | Set `NEXT_PUBLIC_REACTIVE_NEWS_CONTRACT` correctly |
| Always shows wrong network | MetaMask not on chain 5318008 | Click Switch Network button or add chain manually |
| Events not updating on-chain | Using mock backend only | Deploy / integrate real indexer + contract calls |
| `wallet_switchEthereumChain` fails with 4902 | Chain not added | The code auto-attempts add; approve MetaMask prompt |

## 📁 Key Folders

| Path | Purpose |
|------|---------|
| `app/` | Routes & layout (App Router) |
| `components/` | Reusable UI + context providers |
| `app/api/news/` | Mock news generation API (in-memory) |
| `public/` | Static assets |
| `contracts/` | Solidity contract stubs |

## 🧪 Mock Data Generation (Deterministic, Stateless)

`/api/news` now derives the feed purely from wall-clock time – no in-memory timers to break in serverless / cold start environments. Each 10‑second interval since a fixed anchor timestamp yields a deterministic set of synthetic events (one per supported chain). The server reconstructs the most recent intervals on demand and returns at most the latest 500 events (multi-chain expansion drastically increases freshness versus single-source generation).

ID Strategy:
- Each interval has an index (monotonically increasing since anchor)
- Each chain event inside that interval is composed into a unique ID (e.g. `<interval>-<chainKey>`)
- This guarantees stability (same request within the same interval returns identical IDs) and continuity (no resets after deployments).

Benefits:
- Consistent behavior across serverless cold starts (no duplication or regression)
- Easy to reason about upper bounds (500 window) and cadence (10s)
- Enables client polling alignment and pause/resume without race conditions

## 🔄 Polling & Updates (Aligned 10s Cadence)

- Server conceptually "generates" (derives) a new multi-chain batch every 10 seconds
- Client polls every 10 seconds (aligned) while auto-refresh is enabled
- Auto-refresh can be paused (stops network calls) and resumed via UI toggle
- Manual Refresh button triggers an immediate fetch regardless of auto state
- New events merged at top; oldest trimmed to maintain 500 window
- Cumulative total increments even when items fall out of the window

### Auto-Refresh Control
`NewsContext` exposes:
- `autoRefresh` (boolean)
- `pauseAutoRefresh()` / `resumeAutoRefresh()`
- `refreshNews()` (manual on-demand fetch)

UI shows a Stop / Resume button plus an Updated pill when new items arrive.

## 🧩 Extensibility Ideas

- Replace mock API with real blockchain indexer
- Add WebSocket / Server-Sent Events for push updates
- Integrate wallet auth + signatures
- Persist cache in IndexedDB with expiry TTL
- Add category count badges to filter buttons
- Subscribe to monitored addresses via websockets
- Enrich events with token metadata & decoding

## 🐛 Troubleshooting

| Issue | Resolution |
|-------|------------|
| Only Whale Watch events show | Ensure you did not enable "Show Only Monitored" with a narrow set. Otherwise wait for next 10s batch. |
| Data appears stale | Click Refresh, or call `clearCache()` then refresh. |
| Build fails with unescaped quotes | Escape `'` as `&apos;` and `"` as `&quot;` in JSX text. |

## 📜 License

MIT (add a LICENSE file if publishing)

---
Feel free to request enhancements or additional documentation sections.
