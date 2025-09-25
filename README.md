<div align="center">

# Reactive News App

Real-time on-chain event monitoring, category filtering, price tracking, and educational hub for the Reactive Network ecosystem.

</div>

## ✨ Core Features

- Live event feed (simulated backend) updating every 15s with 30s polling on the client
- Smart category filtering: Whale Watch, Governance, Security, Market
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

## 🧠 Caching & Data Strategy

The app now uses a fresh-first approach:

1. On mount, it attempts a live fetch from `/api/news`.
2. If the network request fails AND there is no current data, it falls back to `localStorage` (`newsCache`).
3. New items are merged at the top; old items are trimmed to keep a max of ~90.
4. New event IDs are tracked in a `Set` to show a temporary "new" visual marker.
5. A success state briefly flashes an "Updated" pill when new events arrive.

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
