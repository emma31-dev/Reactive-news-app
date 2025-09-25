"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface PriceData {
  price: string;
  change24h: string;
  changePercent: string;
  symbol: string;
}

interface ReactPriceContextType {
  priceData: PriceData;
  loading: boolean;
  error: boolean;
}

const ReactPriceContext = createContext<ReactPriceContextType | undefined>(undefined);

export function ReactPriceProvider({ children }: { children: ReactNode }) {
  // Initialize with empty data - only show real data
  const [priceData, setPriceData] = useState<PriceData>({
    price: '',
    change24h: '',
    changePercent: '',
    symbol: 'REACT'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchPrice = async () => {
      try {
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
              symbol: 'REACT'
            });
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
              symbol: 'ETH'
            });
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
            symbol: 'ETH'
          });
          setLoading(false);
          setError(false);
          return;
        }

        throw new Error('All APIs failed');
        
      } catch (err) {
        console.error('Price fetch error:', err);
        // Set error state when no real data is available
        setError(true);
        setLoading(false);
        setPriceData({
          price: 'N/A',
          change24h: 'N/A',
          changePercent: 'N/A',
          symbol: 'REACT'
        });
      }
    };

    // Initial fetch
    fetchPrice();
    
    // Update price every 15 seconds for responsive updates while avoiding rate limits
    const interval = setInterval(fetchPrice, 15000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <ReactPriceContext.Provider value={{ priceData, loading, error }}>
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