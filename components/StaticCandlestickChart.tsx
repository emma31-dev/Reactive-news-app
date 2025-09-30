"use client";
import React from 'react';

// Simple SVG candlestick renderer using the static dataset already present in LightweightPriceChart
const DEFAULT_CANDLES = [
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

export default function StaticCandlestickChart({ candles = DEFAULT_CANDLES, width = 800, height = 360 }: { candles?: Array<any>; width?: number; height?: number }) {
  // Compute min/max
  const highs = candles.map(c => c.high);
  const lows = candles.map(c => c.low);
  const max = Math.max(...highs);
  const min = Math.min(...lows);
  const pad = (max - min) * 0.05;
  const top = max + pad;
  const bottom = min - pad;

  const barW = Math.max(3, Math.floor(width / candles.length) - 2);

  const toY = (v: number) => {
    const ratio = (v - bottom) / (top - bottom);
    return Math.round((1 - ratio) * (height - 20)) + 10;
  };

  return (
    <div className="w-full h-full p-2">
      <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="block w-full h-full">
        <rect x="0" y="0" width={width} height={height} fill="transparent" />
        {candles.map((c, i) => {
          const x = 4 + i * (barW + 2);
          const yHigh = toY(c.high);
          const yLow = toY(c.low);
          const yOpen = toY(c.open);
          const yClose = toY(c.close);
          const isUp = c.close >= c.open;
          const color = isUp ? '#16a34a' : '#dc2626';
          const rectY = Math.min(yOpen, yClose);
          const rectH = Math.max(1, Math.abs(yClose - yOpen));
          return (
            <g key={i}>
              {/* wick */}
              <line x1={x + barW / 2} x2={x + barW / 2} y1={yHigh} y2={yLow} stroke={color} strokeWidth={1} />
              {/* body */}
              <rect x={x} y={rectY} width={barW} height={rectH} fill={color} />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
