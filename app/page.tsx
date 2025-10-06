"use client";

import React from 'react';
import Image from 'next/image';
import ScrollSection from '../components/ScrollSection';

const sections = [
  {
    id: 'hook',
    title: 'Reactive Events',
    subtitle: 'A Human-Readable View of the Blockchain',
    text: 'Every second, thousands of transactions happen on the blockchain. We make it live, visual, and understandable, turning cryptic data into a clear, real-time feed.',
    img: '/realWorldHook.svg',
  },
  {
    id: 'problem',
    title: 'The Problem: Messy Blockchain Data',
    bullets: [
      'On-chain logs are raw, confusing, and full of hex codes.',
      "It's difficult to track what’s happening in real time.",
      'Understanding on-chain data is a major barrier for users.',
    ],
    img: '/messyBlockchainData.svg',
  },
  {
    id: 'solution',
    title: 'Our Solution: A Live Event Monitor',
    text: 'Instead of cryptic logs, we built a live stream that visualizes blockchain events like a social media feed—color-coded, animated, and instantly understandable.',
    img: '/ourSolution.svg',
  },
  {
    id: 'wow',
    title: 'Simplifying the Complexity',
    bullets: [
      'Live event stream with smooth, intuitive animations.',
      'Glow and pulse effects highlight new transactions.',
      'A real-time dashboard tracks event counts as they happen.',
    ],
    img: '/simplifingBlockchain.svg',
  },
  {
    id: 'interactivity',
    title: 'More Than a Viewer—A Powerful Tool',
    bullets: [
      'Filter events by contract type (e.g., ERC-20, NFT).',
      'Use the search bar to find specific tokens or wallets.',
      'Seamlessly switch between chains like Ethereum, Polygon, and BSC.',
    ],
    img: '/interactivity.svg',
  },
  {
    id: 'closing',
    title: 'Reactive Events',
    subtitle: 'See the Blockchain Like Never Before',
    text: 'Reactive Events transforms blockchain noise into clarity. We invite you to watch the blockchain come alive.',
    img: '/logo.svg',
  },
];

export default function HomePage() {
  return (
    <main className="space-y-16 py-12 px-6 max-w-4xl mx-auto">
      {sections.map((s, i) => (
        <ScrollSection key={s.id} className="py-12" direction={i % 2 === 0 ? 'left' : 'right'}>
          <div className={`flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}>
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

            <div className="w-64 h-64 flex-shrink-0 flex items-center justify-center">
              <Image src={s.img} alt={s.title} width={256} height={256} className={`object-contain opacity-80 ${s.id === 'closing' ? 'animate-bounce' : ''}`} />
            </div>
          </div>
        </ScrollSection>
      ))}
    </main>
  );
}
