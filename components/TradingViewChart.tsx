"use client";
import React, { useEffect, useRef } from 'react';

/**
 * Lightweight TradingView widget embed as a client component.
 * Uses the official TradingView Lightweight Charts script via their user widget embed approach.
 * Defaults to BTCUSDT on BINANCE which is reliably available.
 */
export default function TradingViewChart({ symbol = 'BINANCE:BTCUSDT', interval = '60' }: { symbol?: string; interval?: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous widget if any
    containerRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = 'https://s3.tradingview.com/tv.js';
    script.onload = () => {
      try {
        // @ts-ignore global TradingView
        if ((window as any).TradingView) {
          // eslint-disable-next-line no-new
          new (window as any).TradingView.widget({
            autosize: true,
            symbol: symbol,
            interval: interval,
            timezone: 'Etc/UTC',
            theme: document.documentElement.classList.contains('dark') ? 'Dark' : 'Light',
            style: '1',
            locale: 'en',
            toolbar_bg: '#f1f3f6',
            enable_publishing: false,
            allow_symbol_change: true,
            container_id: containerRef.current!.id,
            studies: [],
          });
        }
      } catch (e) {
        // ignore widget errors
      }
    };

    // Ensure the div has an id for the widget
    if (!containerRef.current.id) containerRef.current.id = `tvchart-${Math.random().toString(36).slice(2, 9)}`;
    document.head.appendChild(script);

    return () => {
      // cleanup script and widget DOM
      try {
        document.head.removeChild(script);
      } catch (e) {}
      if (containerRef.current) containerRef.current.innerHTML = '';
    };
  }, [symbol, interval]);

  return (
    <div className="w-full h-full bg-transparent">
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
}
