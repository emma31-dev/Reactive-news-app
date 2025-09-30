"use client";
import React from 'react';

type Point = { t: number; v: number }; // timestamp (ms) and value 0-100

type Props = { points: Point[] };

function scaleTimePoints(points: Point[], width: number, height: number, padding = 12) {
  if (!points || points.length === 0) return [] as { x: number; y: number; t: number }[];
  const times = points.map(p => p.t);
  const values = points.map(p => p.v);
  const tMin = Math.min(...times);
  const tMax = Math.max(...times);
  const vMin = Math.min(...values, 0);
  const vMax = Math.max(...values, 1);

  const x = (t: number) => {
    if (tMax === tMin) return padding;
    return padding + ((t - tMin) / (tMax - tMin)) * (width - padding * 2);
  };
  const y = (v: number) => padding + (height - padding * 2) * (1 - (v - vMin) / (vMax - vMin || 1));

  return points.map(p => ({ x: x(p.t), y: y(p.v), t: p.t }));
}

function formatHour(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function SentimentLine24({ points }: Props) {
  const width = 640;
  const height = 160;
  const pts = scaleTimePoints(points, width, height, 14);
  if (pts.length === 0) return <div className="text-sm text-neutral-500">No data</div>;

  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  // Generate 4 time ticks evenly spaced
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(f => {
    const t = points[0].t + f * (points[points.length - 1].t - points[0].t);
    return t;
  });

  return (
    <div className="w-full overflow-x-auto">
      <svg width="100%" height="auto" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          <linearGradient id="grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Axes */}
        <line x1={14} y1={height - 14} x2={width - 14} y2={height - 14} stroke="#e5e7eb" strokeWidth={1} />
        <line x1={14} y1={14} x2={14} y2={height - 14} stroke="#e5e7eb" strokeWidth={1} />

        {/* Time ticks */}
        {ticks.map((t, i) => {
          const x = scaleTimePoints([{ t, v: points[0].v }], width, height, 14)[0].x;
          return (
            <g key={i} transform={`translate(${x}, ${height - 10})`}>
              <line x1={0} y1={-6} x2={0} y2={0} stroke="#cbd5e1" strokeWidth={1} />
              <text x={0} y={12} fontSize={10} fill="#6b7280" textAnchor="middle">{formatHour(t)}</text>
            </g>
          );
        })}

        {/* Filled area */}
        <path d={`${d} L ${width - 14} ${height - 14} L 14 ${height - 14} Z`} fill="url(#grad)" stroke="none" />

        {/* Line */}
        <path d={d} fill="none" stroke="#6366f1" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />

        {/* Points */}
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={2.6} fill="#1f2937" />
        ))}
      </svg>
    </div>
  );
}
