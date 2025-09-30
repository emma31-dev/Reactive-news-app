"use client";
import React, { useRef, useEffect, useState } from 'react';
import { createChart, CrosshairMode, IChartApi } from 'lightweight-charts';

// Static fallback BTCUSDT candles (24 hourly candles)
const STATIC_BTCUSDT_CANDLES = [
  { time: 1695926400, open: 27000, high: 27200, low: 26900, close: 27100 },
  { time: 1695930000, open: 27100, high: 27300, low: 27050, close: 27250 },
  { time: 1695933600, open: 27250, high: 27350, low: 27180, close: 27200 },
  { time: 1695937200, open: 27200, high: 27300, low: 27100, close: 27150 },
  { time: 1695940800, open: 27150, high: 27220, low: 27080, close: 27100 },
  { time: 1695944400, open: 27100, high: 27180, low: 27000, close: 27050 },
  { time: 1695948000, open: 27050, high: 27100, low: 26950, close: 27000 },
  { time: 1695951600, open: 27000, high: 27080, low: 26900, close: 27050 },
  { time: 1695955200, open: 27050, high: 27150, low: 27000, close: 27100 },
  { time: 1695958800, open: 27100, high: 27200, low: 27050, close: 27180 },
  { time: 1695962400, open: 27180, high: 27250, low: 27100, close: 27200 },
  { time: 1695966000, open: 27200, high: 27300, low: 27150, close: 27280 },
  { time: 1695969600, open: 27280, high: 27350, low: 27200, close: 27300 },
  { time: 1695973200, open: 27300, high: 27380, low: 27250, close: 27350 },
  { time: 1695976800, open: 27350, high: 27400, low: 27300, close: 27380 },
  { time: 1695980400, open: 27380, high: 27450, low: 27320, close: 27400 },
  { time: 1695984000, open: 27400, high: 27480, low: 27350, close: 27450 },
  { time: 1695987600, open: 27450, high: 27500, low: 27400, close: 27480 },
  { time: 1695991200, open: 27480, high: 27550, low: 27420, close: 27500 },
  { time: 1695994800, open: 27500, high: 27580, low: 27450, close: 27550 },
  { time: 1695998400, open: 27550, high: 27600, low: 27500, close: 27580 },
  { time: 1696002000, open: 27580, high: 27650, low: 27520, close: 27600 },
  { time: 1696005600, open: 27600, high: 27680, low: 27550, close: 27650 },
  { time: 1696009200, open: 27650, high: 27700, low: 27600, close: 27680 },
];

type Kline = [
  number, string, string, string, string, string, number, string, number, string, string, string
];

export default function LightweightPriceChart({ symbol = 'BTCUSDT', interval = '1m' }: { symbol?: string; interval?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [source, setSource] = useState<string | null>(null);
  const [count, setCount] = useState<number | null>(null);
  const [errMsg, setErrMsg] = useState<string | null>(null);
  

  useEffect(() => {
    if (!ref.current) return;
    const chart = createChart(ref.current, {
      width: ref.current.clientWidth,
      height: ref.current.clientHeight || 300,
      layout: { background: { color: 'transparent' }, textColor: '#d1d5db' },
      rightPriceScale: { visible: true },
    });
    chart.applyOptions({ crosshair: { mode: CrosshairMode.Normal } });
    chartRef.current = chart;
    // ensure container has explicit dimensions so the chart can render
    if (ref.current) {
      ref.current.style.width = '100%';
      if (!ref.current.style.minHeight) ref.current.style.minHeight = '240px';
      // Ensure the element has an explicit height so clientHeight isn't zero
      if (!ref.current.style.height) ref.current.style.height = ref.current.clientHeight ? `${ref.current.clientHeight}px` : '240px';
    }

    // Render an initial static fallback immediately so users always see candles
    try {
      const initSeries = (chart as any).addCandlestickSeries({
        upColor: '#16a34a',
        downColor: '#dc2626',
        borderUpColor: '#16a34a',
        borderDownColor: '#dc2626',
        wickUpColor: '#16a34a',
        wickDownColor: '#dc2626',
      });
      initSeries.setData(STATIC_BTCUSDT_CANDLES as any);
      seriesRef.current = initSeries;
      try { chart.timeScale().fitContent(); } catch (e) {}
      setSource('static-init');
      setCount(STATIC_BTCUSDT_CANDLES.length);
      setLoading(false);
    } catch (e) {
      // ignore initial render errors
    }

    // small delay to allow layout to settle before running network fetches
    const startFetchTimeout = setTimeout(() => {
      fetchAndSet();
      // force a resize after layout
      try { chart.applyOptions({ width: ref.current!.clientWidth, height: ref.current!.clientHeight || 300 }); } catch (e) {}
    }, 200);

    const fetchAndSet = async () => {
      setLoading(true);
      setSource(null);
      setCount(null);
      setErrMsg(null);
      try {
        // Primary source for REACT: CoinGecko OHLC (candles)
        if (symbol.toUpperCase() === 'REACTUSDT' || symbol.toUpperCase() === 'REACT') {
          try {
            const ohlcResp = await fetch('/api/coingecko/ohlc');
            if (ohlcResp.ok) {
              const ohlc = await ohlcResp.json();
              // ohlc is an array of [timestamp, open, high, low, close]
              if (Array.isArray(ohlc) && ohlc.length) {
                const candles = ohlc.map((c: any) => ({ time: Math.floor(c[0] / 1000), open: Number(c[1]), high: Number(c[2]), low: Number(c[3]), close: Number(c[4]) }));
                // remove existing series where possible
                try { if (seriesRef.current && (chart as any).removeSeries) { (chart as any).removeSeries(seriesRef.current); seriesRef.current = null; } } catch (e) {}
                const series = (chart as any).addCandlestickSeries({
                  upColor: '#16a34a',
                  downColor: '#dc2626',
                  borderUpColor: '#16a34a',
                  borderDownColor: '#dc2626',
                  wickUpColor: '#16a34a',
                  wickDownColor: '#dc2626',
                });
                series.setData(candles as any);
                seriesRef.current = series;
                try { chart.timeScale().fitContent(); } catch (e) {}
                setSource('coingecko-ohlc');
                setCount((candles as any).length || 0);
                setLoading(false);
                return;
              }
            }
            // If OHLC endpoint returned empty or is unavailable, try synthesizing candles from market_chart prices
            try {
              const mc = await fetch('/api/coingecko/market_chart');
              if (mc.ok) {
                const j = await mc.json();
                const prices: Array<[number, number]> = j.prices || [];
                if (prices.length) {
                  // group into 1-minute buckets (timestamp ms -> seconds)
                  const buckets: Record<number, { open: number; high: number; low: number; close: number; ts: number }> = {};
                  for (const [tsMs, price] of prices) {
                    const bucketSec = Math.floor(tsMs / 60000) * 60; // seconds
                    if (!buckets[bucketSec]) {
                      buckets[bucketSec] = { open: price, high: price, low: price, close: price, ts: bucketSec };
                    } else {
                      const b = buckets[bucketSec];
                      b.high = Math.max(b.high, price);
                      b.low = Math.min(b.low, price);
                      b.close = price;
                    }
                  }
                  const candles = Object.values(buckets).sort((a, b) => a.ts - b.ts).map(b => ({ time: b.ts, open: Number(b.open), high: Number(b.high), low: Number(b.low), close: Number(b.close) }));
                  if (candles.length) {
                    try { if (seriesRef.current && (chart as any).removeSeries) { (chart as any).removeSeries(seriesRef.current); seriesRef.current = null; } } catch (e) {}
                    const series = (chart as any).addCandlestickSeries({
                      upColor: '#16a34a',
                      downColor: '#dc2626',
                      borderUpColor: '#16a34a',
                      borderDownColor: '#dc2626',
                      wickUpColor: '#16a34a',
                      wickDownColor: '#dc2626',
                    });
                    series.setData(candles as any);
                    seriesRef.current = series;
                    try { chart.timeScale().fitContent(); } catch (e) {}
                    return;
                  }
                }
              }
            } catch (err) {
              // fall through to other fallbacks
            }
          } catch (err) {
            // fall through to fallback below
          }

          // Fallback: try Binance klines for symbol if available
          try {
            const res = await fetch(`/api/binance/klines?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(interval)}&limit=200`);
            const data = await res.json();
            if (Array.isArray(data) && data.length) {
              const candlesticks = data.map((k: Kline) => ({ time: Math.floor(k[0] / 1000), open: parseFloat(k[1]), high: parseFloat(k[2]), low: parseFloat(k[3]), close: parseFloat(k[4]) }));
              try { if (seriesRef.current && (chart as any).removeSeries) { (chart as any).removeSeries(seriesRef.current); seriesRef.current = null; } } catch (e) {}
              const series = (chart as any).addCandlestickSeries({
                upColor: '#16a34a',
                downColor: '#dc2626',
                borderUpColor: '#16a34a',
                borderDownColor: '#dc2626',
                wickUpColor: '#16a34a',
                wickDownColor: '#dc2626',
              });
              series.setData(candlesticks as any);
              seriesRef.current = series;
              try { chart.timeScale().fitContent(); } catch (e) {}
              setSource('binance-klines');
              setCount((candlesticks as any).length || 0);
              setLoading(false);
              return;
            }
          } catch (err) {
            // fall through to line fallback
          }

          // Final fallback: use CoinGecko market_chart as a line series so user still sees price trend
          try {
            const cg = await fetch('/api/coingecko/market_chart');
            if (cg.ok) {
              const jd = await cg.json();
              const prices: Array<[number, number]> = jd.prices || [];
              if (prices.length) {
                const lineData = prices.map(([ts, p]) => ({ time: Math.floor(ts / 1000), value: Number(p) }));
                try { if (seriesRef.current && (chart as any).removeSeries) { (chart as any).removeSeries(seriesRef.current); seriesRef.current = null; } } catch (e) {}
                const series = (chart as any).addLineSeries({ color: '#06b6d4' });
                series.setData(lineData as any);
                seriesRef.current = series;
                try { chart.timeScale().fitContent(); } catch (e) {}
                setSource('coingecko-market_chart-line');
                setCount((lineData as any).length || 0);
                setLoading(false);
                return;
              }
            }
          } catch (err) {
            // ignore
          }
        }

        // Default: try Binance klines for other symbols
      const res = await fetch(`/api/binance/klines?symbol=${encodeURIComponent(symbol)}&interval=${encodeURIComponent(interval)}&limit=200`);
        const data = await res.json();
        if (!Array.isArray(data)) return;
        const candlesticks = data.map((k: Kline) => ({ time: Math.floor(k[0] / 1000), open: parseFloat(k[1]), high: parseFloat(k[2]), low: parseFloat(k[3]), close: parseFloat(k[4]) }));
  try { if (seriesRef.current && (chart as any).removeSeries) { (chart as any).removeSeries(seriesRef.current); seriesRef.current = null; } } catch (e) {}
  const series = (chart as any).addCandlestickSeries({
          upColor: '#16a34a',
          downColor: '#dc2626',
          borderUpColor: '#16a34a',
          borderDownColor: '#dc2626',
          wickUpColor: '#16a34a',
          wickDownColor: '#dc2626',
        });
        series.setData(candlesticks as any);
        seriesRef.current = series;
        try { chart.timeScale().fitContent(); } catch (e) {}
        setSource('binance-klines');
        setCount((candlesticks as any).length || 0);
        setLoading(false);
      } catch (e) {
        // All fetches failed: use static fallback
        try { if (seriesRef.current && (chart as any).removeSeries) { (chart as any).removeSeries(seriesRef.current); seriesRef.current = null; } } catch (e) {}
        const series = (chart as any).addCandlestickSeries({
          upColor: '#16a34a',
          downColor: '#dc2626',
          borderUpColor: '#16a34a',
          borderDownColor: '#dc2626',
          wickUpColor: '#16a34a',
          wickDownColor: '#dc2626',
        });
        series.setData(STATIC_BTCUSDT_CANDLES as any);
        seriesRef.current = series;
        try { chart.timeScale().fitContent(); } catch (e) {}
        setSource('static-fallback');
        setCount(STATIC_BTCUSDT_CANDLES.length);
        setErrMsg('All data fetches failed. Showing static fallback.');
        setLoading(false);
      }
    };

    let ro: ResizeObserver | null = null;

    fetchAndSet();

    // use ResizeObserver for responsive sizing
    try {
      ro = new ResizeObserver(() => {
        if (!ref.current || !chartRef.current) return;
        try {
          chartRef.current.applyOptions({ width: ref.current.clientWidth, height: ref.current.clientHeight || 300 });
        } catch (e) {
          // ignore
        }
      });
      ro.observe(ref.current);
    } catch (e) {
      // fallback to window resize
      const handleResize = () => {
        if (!ref.current || !chartRef.current) return;
        try { chartRef.current.applyOptions({ width: ref.current.clientWidth, height: ref.current.clientHeight || 300 }); } catch (e) { /* ignore */ }
      };
      window.addEventListener('resize', handleResize);
    }

    return () => {
      try { ro && ref.current && ro.unobserve(ref.current); } catch (e) {}
      try { chart.remove(); } catch (e) { /* ignore */ }
    };
  }, [symbol, interval]);

  return (
    <div className="w-full h-full relative">
      <div ref={ref} className="w-full h-full" />
      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs rounded px-2 py-1 z-20">
        {loading ? 'Loading...' : `${source || 'n/a'} ${count ? `• ${count}` : ''}`}
        {errMsg ? ` • err` : ''}
      </div>
      {errMsg && (
        <div className="absolute bottom-2 left-2 bg-red-600/80 text-white text-xs rounded px-2 py-1 z-20">{errMsg}</div>
      )}
    </div>
  );
}
