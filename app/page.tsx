"use client";

import React from 'react';
import Image from 'next/image';
import ScrollSection from '../components/ScrollSection';

const sections = [
  {
    id: 'hook',
    title: 'Reactive Events',
    subtitle: 'Twitter for Blockchain Events',
    text: 'Every second, thousands of transactions happen on the blockchain… but to most people, it looks like gibberish. We built a way to make it live, visual, and human-readable.',
    img: '/logo.svg',
  },
  {
    id: 'problem',
    title: 'Blockchain is powerful… but unreadable',
    bullets: [
      'On-chain logs = raw data, confusing, full of hex codes.',
      "Hard to know what’s happening in real time.",
      'Only devs can dig into it (Etherscan, RPC logs).',
    ],
    img: '/login.svg',
  },
  {
    id: 'solution',
    title: 'Reactive Events: Live On-Chain Event Monitor',
    text: 'Instead of cryptic logs, we built a live stream that shows blockchain events like a social feed — color-coded, animated, and instantly understandable.',
    // Curated illustrative image hosted on Unsplash to explain the product (live data/dashboard feel)
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  },
  {
    id: 'wow',
    title: 'Data that feels alive',
    bullets: [
      'Live event stream with smooth animations.',
      'Glow/pulse effects on new transactions.',
      'Mini dashboard tracking event counts in real time.',
    ],
    img: '/float2.svg',
  },
  {
    id: 'interactivity',
    title: 'Not just a viewer, but a tool',
    bullets: [
      'Filter by contract (ERC-20 / NFT).',
      'Search bar for tokens or wallets.',
      'Chain switcher (Ethereum, Polygon, BSC).',
    ],
    img: '/float3.svg',
  },
  {
    id: 'closing',
    title: 'Reactive Events',
    subtitle: 'See the blockchain like never before.',
    text: 'Reactive Events turns blockchain noise into clarity. Judges, we invite you to watch the blockchain come alive with us.',
    img: '/logo-new-temp.svg',
  },
];

export default function HomePage() {
  return (
    <main className="space-y-16 py-12 px-6 max-w-4xl mx-auto">
      {sections.map((s, i) => (
        <ScrollSection key={s.id} className="py-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-blue-700 dark:text-blue-400">{s.title}</h2>
              {s.subtitle && <p className="text-lg font-semibold text-neutral-600 dark:text-neutral-300">{s.subtitle}</p>}
              {s.text && <p className="mt-4 text-neutral-700 dark:text-neutral-200">{s.text}</p>}
              {s.bullets && (
                <ul className="mt-4 list-disc pl-6 space-y-2 text-neutral-700 dark:text-neutral-300">
                  {s.bullets.map((b: string) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Only show an animated project logo for the first (hook) section; otherwise hide illustrations */}
            {i === 0 && (
              <div className="w-48 h-48 flex-shrink-0 flex items-center justify-center">
                {/* Thunderbolt SVG (from public/logo.svg) with subtle pulse animation */}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Reactive Thunderbolt Logo" className="w-36 h-36 pulse">
                  <defs>
                    <linearGradient id="boltFill" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1"/>
                      <stop offset="45%" stopColor="#8b5cf6"/>
                      <stop offset="100%" stopColor="#ec4899"/>
                    </linearGradient>
                    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#818cf8" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.4" />
                    </linearGradient>
                    <filter id="softGlow" x="-40%" y="-40%" width="180%" height="180%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                      <feColorMatrix in="blur" type="matrix" values="0 0 0 0 0.6  0 0 0 0 0.58  0 0 0 0 0.95  0 0 0 0.6 0" result="tint" />
                      <feMerge>
                        <feMergeNode in="tint" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <circle cx="32" cy="32" r="29" fill="none" stroke="url(#ringGrad)" strokeWidth="2.5" strokeDasharray="6 10" strokeLinecap="round" opacity="0.55" />
                  <circle cx="32" cy="32" r="20" fill="url(#ringGrad)" opacity="0.08" />
                  <g filter="url(#softGlow)">
                    <path d="M35.6 6.5 18.9 34.7c-.45.76.34 1.65 1.16 1.34l9.62-3.55c.63-.23 1.26.34 1.11.99l-3.95 16.9c-.23.96 1 .1 1.43-.48l17.92-24.5c.5-.69-.22-1.62-1.03-1.38l-9.48 2.82c-.64.19-1.21-.45-.97-1.07L37 7.02c.31-.82-.78-1.45-1.4-.52z" fill="url(#boltFill)" stroke="#ffffff" strokeWidth="1.1" strokeLinejoin="round" />
                  </g>
                  <circle cx="15" cy="26" r="2" fill="#6366f1" opacity="0.55" />
                  <circle cx="50" cy="20" r="1.6" fill="#ec4899" opacity="0.65" />
                  <circle cx="46" cy="48" r="1.9" fill="#8b5cf6" opacity="0.5" />
                </svg>
                <style>{`.pulse { animation: pulse 2.2s ease-in-out infinite; } @keyframes pulse { 0% { transform: scale(0.98); opacity: 0.95 } 50% { transform: scale(1.03); opacity: 1 } 100% { transform: scale(0.98); opacity: 0.95 } }`}</style>
              </div>
            )}
          </div>
        </ScrollSection>
      ))}
    </main>
  );
}
