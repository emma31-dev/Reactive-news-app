<div align="center">

# Reactive News App

Real-time on-chain event monitoring, category filtering, price tracking, and educational hub for the Reactive Network ecosystem.

</div>

##  Core Features

- Live event feed (simulated backend) updating every 15s with 30s polling on the client
- Smart category filtering: Whale Watch, Governance, Security, Market, DeFi, NFT, Staking, Airdrop
- Fresh-first fetching strategy with resilient local cache fallback
- Optional optimistic cache bootstrap (`NEXT_PUBLIC_USE_OPTIMISTIC_CACHE=true`)
- Save-for-later system with local persistence
- New item highlighting (temporary blue pulse indicator)
- Pagination (15 events per page) with automatic bounds correction
- Profile preferences & authentication mock (email/password)
- Educational "Learn" section and detailed About page
- Real-time (mock) blockchain event attributes: tx hash, from/to, proposal ID, etc.
- Glassmorphism UI + dark/light theme
- Responsive layout (mobile → desktop)
- Verification badge component stub (extensible for real chain proofs)

## 🧠 Caching & Data Strategy & Preferences

The app now uses a fresh-first approach:

1. On mount, it attempts a live fetch from `/api/news`.
2. If the network request fails AND there is no current data, it falls back to `localStorage` (`newsCache`).
3. New items are merged at the top; old items are trimmed to keep a max of ~90.
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

### Preference-Based Filtering
Users can toggle which event categories they want to see from the Profile page. Disabled categories are hidden from the feed and their filter pills are disabled. If all categories are disabled, a guidance message appears on the home feed.

Default preferences for new accounts:

| Category | Default | Rationale |
|----------|---------|-----------|
| Whale Watch | ✅ | High-signal large movements |
| Governance | ✅ | Protocol direction & actions |
| Security | ❌ | Opt-in (alerts can be noisy) |
| Market | ❌ | Optional macro signals |
| DeFi | ✅ | Core ecosystem activity |
| NFT | ❌ | Optional vertical |
| Staking | ❌ | Operational / validator specific |
| Airdrop | ✅ | High user interest |

Preferences are stored under `authUser` in `localStorage` and automatically migrated when new categories are introduced.

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

## 🧪 Mock Data Generation

`/api/news` produces randomized events with categories and metadata. IDs are sequential (zero-padded) and kept in-memory only for the lifetime of the server process.

## 🔄 Polling & Updates

- Server generates a new event every 15 seconds.
- Client polls every 30 seconds.
- New events merged at top, old trimmed.

## 🧩 Extensibility Ideas

- Replace mock API with real blockchain indexer
- Add WebSocket / Server-Sent Events for push updates
- Integrate wallet auth + signatures
- Persist cache in IndexedDB with expiry TTL
- Add category count badges to filter buttons

## 🐛 Troubleshooting

| Issue | Resolution |
|-------|------------|
| Only Whale Watch events show | Wait for generator to produce other categories; they are random. |
| Data appears stale | Click Refresh, or call `clearCache()` then refresh. |
| Build fails with unescaped quotes | Escape `'` as `&apos;` and `"` as `&quot;` in JSX text. |

## 📜 License

MIT (add a LICENSE file if publishing)

---
Feel free to request enhancements or additional documentation sections.
