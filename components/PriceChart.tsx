"use client";
import React from 'react';

type Kline = [
  number, string, string, string, string, string, number, string, number, string, string, string
];

export default function PriceChart({ symbol = 'REACTUSDT', interval = '1m' }: { symbol?: string; interval?: string }) {
  const [klines, setKlines] = React.useState<Kline[]>([]);
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    let mounted = true;
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=120`;
    fetch(url)
      .then(r => r.json())
      .then((data) => {
        if (!mounted) return;
        if (Array.isArray(data)) setKlines(data as Kline[]);
      })
      .catch(() => {
        // ignore errors silently; component will be empty
      });
    return () => { mounted = false; };
  }, [symbol, interval]);

  if (!klines.length) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-neutral-500">Loading chart…</div>
    );
  }

  // Map to numeric prices
  const prices = klines.map(k => parseFloat(k[4]));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const width = 800;
  const height = 360;
  const pad = 20;

  const points = prices.map((p, i) => {
    const x = pad + (i / (prices.length - 1)) * (width - pad * 2);
    const y = pad + ((max - p) / (max - min || 1)) * (height - pad * 2);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div ref={ref} className="w-full h-full p-2">
      <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id="g1" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <polygon points={`${points} ${width - pad},${height - pad} ${pad},${height - pad}`} fill="url(#g1)" />

        {/* Line */}
        <polyline points={points} fill="none" stroke="#06b6d4" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {/* Min / Max labels */}
        <text x={width - pad} y={pad + 10} fontSize="10" textAnchor="end" fill="#94a3b8">{max.toFixed(6)}</text>
        <text x={width - pad} y={height - pad} fontSize="10" textAnchor="end" fill="#94a3b8">{min.toFixed(6)}</text>
      </svg>
    </div>
  );
}
