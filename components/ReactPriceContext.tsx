"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PriceData {
  price: string;          // current displayed price
  change24h: string;      // absolute 24h change
  changePercent: string;  // percent 24h change
  symbol: string;         // token symbol (REACT or fallback ETH)
  lastUpdated?: number;   // epoch ms when this price was fetched
  source?: string;        // which API produced it
  stale?: boolean;        // marks data as stale/offline fallback
}

interface ReactPriceContextType {
  priceData: PriceData;
  loading: boolean;
  error: boolean;
  offline: boolean;              // true if showing stale cached data due to fetch failures
  forceRefresh: () => void;      // manual trigger
  clearCachedPrice: () => void;  // remove cached price
}

const ReactPriceContext = createContext<ReactPriceContextType | undefined>(undefined);

export function ReactPriceProvider({ children }: { children: ReactNode }) {
  // Initialize with empty data - only show real data
  const [priceData, setPriceData] = useState<PriceData>(() => {
    // Attempt to restore cached last successful price (do not block, synchronous read)
    try {
      const cached = localStorage.getItem('reactPrice:last');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && typeof parsed.price === 'string') {
          return { ...parsed, stale: true } as PriceData; // mark as potentially stale until fresh fetch
        }
      }
    } catch (_) {}
    return {
      price: '',
      change24h: '',
      changePercent: '',
      symbol: 'REACT',
      stale: false
    };
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [offline, setOffline] = useState(false);
  const controllerRef = typeof window !== 'undefined' ? (window as any)._reactPriceCtrlRef || { current: null } : { current: null };

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        setOffline(false);
        // Try a simpler approach with CoinGecko first (more reliable for smaller tokens)
        
        // First try CoinGecko for REACT (Reactive Network)
        const cgResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=reactive-network&vs_currencies=usd&include_24hr_change=true');
        
        if (cgResponse.ok) {
          const cgData = await cgResponse.json();
          if (cgData['reactive-network']) {
            const price = cgData['reactive-network'].usd;
            const change24h = cgData['reactive-network'].usd_24h_change || 0;
            setPriceData({
              price: price.toFixed(4),
              change24h: (price * change24h / 100).toFixed(4),
              changePercent: change24h.toFixed(2),
              symbol: 'REACT',
              lastUpdated: Date.now(),
              source: 'coingecko',
              stale: false
            });
            // Persist last good price
            localStorage.setItem('reactPrice:last', JSON.stringify({
              price: price.toFixed(4),
              change24h: (price * change24h / 100).toFixed(4),
              changePercent: change24h.toFixed(2),
              symbol: 'REACT',
              lastUpdated: Date.now(),
              source: 'coingecko'
            }));
            setLoading(false);
            setError(false);
            return;
          }
        }

        // Try Bybit for ETH as fallback (more likely to work)
        const bybitResponse = await fetch('https://api.bybit.com/v5/market/tickers?category=spot&symbol=ETHUSDT');
        
        if (bybitResponse.ok) {
          const bybitData = await bybitResponse.json();
          if (bybitData.result && bybitData.result.list && bybitData.result.list[0]) {
            const ticker = bybitData.result.list[0];
            const price = parseFloat(ticker.lastPrice);
            const changePercent = parseFloat(ticker.price24hPcnt);
            setPriceData({
              price: price.toFixed(2),
              change24h: (price * changePercent / 100).toFixed(2),
              changePercent: changePercent.toFixed(2),
              symbol: 'ETH',
              lastUpdated: Date.now(),
              source: 'bybit',
              stale: false
            });
            localStorage.setItem('reactPrice:last', JSON.stringify({
              price: price.toFixed(2),
              change24h: (price * changePercent / 100).toFixed(2),
              changePercent: changePercent.toFixed(2),
              symbol: 'ETH',
              lastUpdated: Date.now(),
              source: 'bybit'
            }));
            setLoading(false);
            setError(false);
            return;
          }
        }

        // Final fallback to Binance ETH
        const binanceResponse = await fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=ETHUSDT');
        
        if (binanceResponse.ok) {
          const data = await binanceResponse.json();
          const price = parseFloat(data.lastPrice);
          setPriceData({
            price: price.toFixed(2),
            change24h: parseFloat(data.priceChange).toFixed(2),
            changePercent: parseFloat(data.priceChangePercent).toFixed(2),
            symbol: 'ETH',
            lastUpdated: Date.now(),
            source: 'binance',
            stale: false
          });
          localStorage.setItem('reactPrice:last', JSON.stringify({
            price: price.toFixed(2),
            change24h: parseFloat(data.priceChange).toFixed(2),
            changePercent: parseFloat(data.priceChangePercent).toFixed(2),
            symbol: 'ETH',
            lastUpdated: Date.now(),
            source: 'binance'
          }));
          setLoading(false);
          setError(false);
          return;
        }

        throw new Error('All APIs failed');
        
      } catch (err) {
        console.error('Price fetch error:', err);
        setError(true);
        setLoading(false);
        // If we have a previously cached price (already loaded in state), mark offline/stale but DO NOT overwrite with N/A
        setOffline(true);
        setPriceData(prev => {
          if (!prev.price || prev.price === 'N/A') {
            // As a last resort keep N/A structure
            return {
              price: 'N/A',
              change24h: 'N/A',
              changePercent: 'N/A',
              symbol: 'REACT',
              stale: true
            };
          }
          return { ...prev, stale: true };
        });
      }
    };

    // Initial fetch
    fetchPrice();
    
    // Update price every 15 seconds for responsive updates while avoiding rate limits
    const interval = setInterval(fetchPrice, 15000);
    
    return () => clearInterval(interval);
  }, []);

  const forceRefresh = () => {
    setLoading(true);
    setError(false);
    setOffline(false);
    // Force immediate refetch by re-running effect logic manually
    (async () => {
      try {
        // Reuse logic by calling fetch sequence inline (duplicate minimal version)
        const resp = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=reactive-network&vs_currencies=usd&include_24hr_change=true');
        if (resp.ok) {
          const cgData = await resp.json();
          if (cgData['reactive-network']) {
            const price = cgData['reactive-network'].usd;
            const change24h = cgData['reactive-network'].usd_24h_change || 0;
            setPriceData({
              price: price.toFixed(4),
              change24h: (price * change24h / 100).toFixed(4),
              changePercent: change24h.toFixed(2),
              symbol: 'REACT',
              lastUpdated: Date.now(),
              source: 'coingecko',
              stale: false
            });
            localStorage.setItem('reactPrice:last', JSON.stringify({
              price: price.toFixed(4),
              change24h: (price * change24h / 100).toFixed(4),
              changePercent: change24h.toFixed(2),
              symbol: 'REACT',
              lastUpdated: Date.now(),
              source: 'coingecko'
            }));
            setLoading(false);
            return;
          }
        }
      } catch (e) {
        console.warn('Manual refresh failed:', e);
      }
      setLoading(false);
    })();
  };

  const clearCachedPrice = () => {
    try { localStorage.removeItem('reactPrice:last'); } catch(_) {}
  };

  return (
    <ReactPriceContext.Provider value={{ priceData, loading, error, offline, forceRefresh, clearCachedPrice }}>
      {children}
    </ReactPriceContext.Provider>
  );
}

export function useReactPrice() {
  const context = useContext(ReactPriceContext);
  if (context === undefined) {
    throw new Error('useReactPrice must be used within a ReactPriceProvider');
  }
  return context;
}