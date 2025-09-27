"use client";
import React from 'react';

interface LoaderProps {
  size?: number;
  color?: string;
  speed?: number;
  stroke?: number;
  themeColor?: 'auto' | 'foreground' | 'accent';
  className?: string;
  label?: string; // Visually shown label
  ariaLabel?: string; // For screen readers only
  variant?: 'spinner'; // simplified — legacy values ignored
}

export const Loader: React.FC<LoaderProps> = ({
  size = 40,
  stroke = 3,
  color,
  speed = 1,
  themeColor = 'auto',
  className = '',
  label,
  ariaLabel = 'Loading',
  variant = 'spinner'
}) => {
  // Determine effective color: explicit color prop > themed variable
  let effectiveColor: string;
  if (color) {
    effectiveColor = color;
  } else if (themeColor === 'accent') {
    effectiveColor = 'var(--accent)';
  } else if (themeColor === 'foreground' || themeColor === 'auto') {
    effectiveColor = 'var(--foreground)';
  } else {
    effectiveColor = 'currentColor';
  }

  const duration = `${Math.max(0.35, 1 / speed)}s`;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`.trim()} role="status" aria-live="polite" aria-busy="true" aria-label={!label ? ariaLabel : undefined}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 50 50"
        role="img"
        aria-hidden={!!label}
        className="animate-[spin_0.9s_linear_infinite]"
        style={{ color: effectiveColor }}
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray="90 150"
          strokeDashoffset="0"
        >
          <animate attributeName="stroke-dasharray" values="15 150;90 150;15 150" dur={duration} repeatCount="indefinite" />
          <animate attributeName="stroke-dashoffset" values="0;-40;-120" dur={duration} repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.6;1" dur={duration} repeatCount="indefinite" />
        </circle>
      </svg>
      {label && <span className="mt-2 text-xs text-neutral-400">{label}</span>}
    </div>
  );
};

export default Loader;
