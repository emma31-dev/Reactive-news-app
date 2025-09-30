"use client";
import React from "react";

export default function LogoLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-neutral-950 transition-colors">
      <svg
        width="96"
        height="96"
        viewBox="0 0 96 96"
        fill="none"
        className="animate-spin-slow"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="48"
          cy="48"
          r="40"
          stroke="url(#reactive-gradient)"
          strokeWidth="8"
          strokeDasharray="180 80"
          strokeLinecap="round"
        />
        <circle
          cx="48"
          cy="48"
          r="24"
          fill="url(#reactive-gradient)"
          opacity="0.15"
        />
        <text
          x="50%"
          y="54%"
          textAnchor="middle"
          fill="url(#reactive-gradient)"
          fontSize="1.5rem"
          fontWeight="bold"
          fontFamily="Inter, Arial, sans-serif"
          dy=".3em"
        >
          R
        </text>
        <defs>
          <linearGradient id="reactive-gradient" x1="0" y1="0" x2="96" y2="96" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3B82F6" />
            <stop offset="1" stopColor="#60A5FA" />
          </linearGradient>
        </defs>
      </svg>
      <style>{`
        .animate-spin-slow {
          animation: spin 1.6s linear infinite;
        }
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
