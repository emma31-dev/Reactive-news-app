"use client";
import React from 'react';

type Props = { value: number };

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = (angleDeg - 90) * (Math.PI / 180.0);
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  // Compute start and end points from given angles (degrees)
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);

  // Normalize delta into [0,360)
  const delta = ((endAngle - startAngle) % 360 + 360) % 360;
  const largeArcFlag = delta > 180 ? '1' : '0';
  const sweepFlag = delta > 0 ? '1' : '0';

  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${end.x} ${end.y}`;
}

export default function SentimentGauge({ value }: Props) {
  const target = Math.max(0, Math.min(100, Math.round(value)));
  const [displayed, setDisplayed] = React.useState<number>(target);
  const width = 220;
  const height = 120;
  const cx = width / 2;
  const cy = height;
  const r = 90;

  // Gauge goes from left-top (270deg) to right-top (90deg)
  // We map 0 => left (270) and 100 => right (90)
  const start = 270;
  const end = 90;

  // Map value 0..100 to angle where 50 => 0 (up), 0 => -90 (left), 100 => +90 (right)
  const angleForValue = (v: number) => (v - 50) * 1.8;
  // Needle uses the displayed value (updates on an interval)
  const needleAngle = angleForValue(displayed);
  // We'll render a vertical needle pointing up and rotate it around (cx,cy)
  const needleLength = r - 14;
  const needleX1 = cx;
  const needleY1 = cy;
  const needleX2 = cx;
  const needleY2 = cy - needleLength;

  // Rotation should match the SVG polar angle directly so the vertical needle
  // (which initially points up at angle 0) rotates to the desired polar angle.
  const rotationDeg = needleAngle;

  // Sync displayed immediately to target on prop changes so the needle animates
  // smoothly using CSS transitions. This avoids stepping delays and ensures the
  // gauge reacts as soon as new data arrives.
  React.useEffect(() => {
    setDisplayed(target);
  }, [target]);

  return (
    <div className="w-full max-w-xs mx-auto">
  <svg width="100%" height="auto" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="sentimentGrad" x1={cx - r} y1={cy} x2={cx + r} y2={cy} gradientUnits="userSpaceOnUse">
            {/* Left red span */}
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="45%" stopColor="#ef4444" />
            {/* Center neutral band (narrow) */}
            <stop offset="48%" stopColor="#ffffff" />
            <stop offset="52%" stopColor="#ffffff" />
            {/* Right green span mirrors the red */}
            <stop offset="55%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>

        {/* Background arc (subtle) */}
        <path d={describeArc(cx, cy, r, start, end)} fill="none" stroke="#e6e9ee" strokeWidth={18} strokeLinecap="round" />

        {/* Gradient arc from red (left) -> white (center) -> green (right) */}
        <path
          d={describeArc(cx, cy, r, start, end)}
          fill="none"
          stroke="url(#sentimentGrad)"
          strokeWidth={18}
          strokeLinecap="butt"
        />

        {/* Needle - drawn as a vertical line rotated around center */}
        {/* Use SVG transform rotate(cx,cy) so rotation pivot is exact and stable */}
        <g transform={`rotate(${rotationDeg} ${cx} ${cy})`} style={{ transition: 'transform 0.9s ease' }}>
          <line x1={needleX1} y1={needleY1} x2={needleX2} y2={needleY2} stroke="#0f172a" strokeWidth={3} strokeLinecap="round" />
        </g>
        {/* Center hub */}
        <circle cx={cx} cy={cy} r={6} fill="#0f172a" />
      </svg>

      <div className="mt-2 text-center">
        <div className="text-2xl font-semibold">{displayed}</div>
        <div className="text-xs text-neutral-500">Fear — Neutral — Greed</div>
      </div>
    </div>
  );
}
