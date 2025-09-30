This folder contains simple Next.js API routes used as momentary proxies for coin data during the hackathon.

Endpoints:
- /api/coingecko/ohlc -> proxies CoinGecko OHLC for `reactive-network`
- /api/coingecko/market_chart -> proxies CoinGecko market_chart prices
- /api/binance/klines -> proxies Binance klines (accepts ?symbol= &interval= &limit=)

These are intentionally lightweight and unsophisticated. For production use you should add:
- Caching (in-memory or Redis)
- Rate-limit handling and backoff
- Error logging and alerts
- Authentication if you expose sensitive keys
