"use client";
import React from 'react';

export default function AboutPage() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">About <span className="!text-blue-600 dark:!text-blue-400">Reactive</span> Network Monitor</h1>
      <p className="mb-6">
        Welcome to the <span className="!text-blue-600 dark:!text-blue-400">Reactive</span> Network Monitor - a cutting-edge on-chain event monitoring platform built specifically for the <span className="!text-blue-600 dark:!text-blue-400">Reactive</span> Network ecosystem. Our application provides real-time insights into blockchain activities, helping developers, validators, and users stay informed about critical on-chain events as they happen.
      </p>
      <div className="my-10 border-t border-neutral-200 dark:border-neutral-800" />

      <h2 className="text-2xl font-semibold mb-4">What is the <span className="!text-blue-600 dark:!text-blue-400">Reactive</span> Network?</h2>
      <p className="mb-6">
        The <span className="!text-blue-600 dark:!text-blue-400">Reactive</span> Network is an innovative blockchain platform that enables <span className="!text-blue-600 dark:!text-blue-400">reactive</span> smart contracts and cross-chain interoperability. It allows smart contracts to automatically respond to events across multiple blockchain networks, creating a more connected and responsive decentralized ecosystem.
      </p>
      <div className="my-10 border-t border-neutral-200 dark:border-neutral-800" />

      <h2 className="text-2xl font-semibold mb-4">Key Features</h2>
      <ul className="list-disc list-inside mb-6 space-y-2">
  <li><strong>Live Event Monitoring:</strong> Deterministic multi-chain (Ethereum, Avalanche, Base, BNB Smart Chain, Arbitrum) synthetic events every 10 seconds</li>
        <li><strong>REACT Price Ticker:</strong> Live cryptocurrency price tracking with real-time updates from Bybit, Binance, and CoinGecko APIs</li>
  <li><strong>Educational Hub:</strong> Comprehensive &quot;Learn&quot; page with detailed <span className="!text-blue-600 dark:!text-blue-400">Reactive</span> Network documentation and glassmorphism design</li>
  <li><strong>Smart Filtering:</strong> Advanced category filtering (Whale Watch, Governance, Security, Market, DeFi, NFT, Staking, Airdrop)</li>
        <li><strong>Save for Later:</strong> Bookmark important events for easy access in your profile</li>
  <li><strong>User Authentication:</strong> Lightweight local mock (email verification removed for simplicity)</li>
        <li><strong>Review System:</strong> Rate and review the platform, view community feedback</li>
  <li><strong>Personalized Dashboard:</strong> Global chain filter + monitored address / tx hash controls</li>
        <li><strong>Modern UI Design:</strong> Premium glassmorphism effects with backdrop blur and translucent elements</li>
        <li><strong>Responsive Design:</strong> Seamless experience across desktop, tablet, and mobile devices</li>
        <li><strong>Intelligent Caching:</strong> Lightning-fast load times with smart local storage</li>
        <li><strong>Fresh-First Data Fetch:</strong> Always attempts live data first, falling back to cache only on network failure</li>
        <li><strong>Optional Optimistic Cache:</strong> Environment flag to instantly display cached events while refreshing</li>
  <li><strong>Pagination System:</strong> Organized viewing with 25 items per page (sliding 500 event window)</li>
  <li><strong>Auto-Refresh Control:</strong> Pause/resume 10s polling + manual refresh for bandwidth or focused reading</li>
        <li><strong>Dark/Light Theme:</strong> Beautiful interface with automatic theme switching</li>
        <li><strong>Data Strategy:</strong> Fresh-first fetching with selective cache fallback and new-item indicators</li>
      </ul>

  <div className="my-10 border-t border-neutral-200 dark:border-neutral-800" />

  <h2 className="text-2xl font-semibold mb-4">Event Categories</h2>
  <ul className="list-disc list-inside mb-6 space-y-2">
        <li><strong>Whale Watch:</strong> Large token transfers, liquidity events, and high-value transactions</li>
        <li><strong>Governance:</strong> Proposal creation, voting events, and protocol governance activities</li>
        <li><strong>Security:</strong> Smart contract upgrades, security incidents, and access control changes</li>
        <li><strong>Market:</strong> Price oracle updates, arbitrage opportunities, and macro trading signals</li>
        <li><strong>DeFi:</strong> Protocol upgrades, TVL shifts, liquidity mining, and yield events</li>
        <li><strong>NFT:</strong> Collection mints, floor price movements, rarity sales, and whale sweeps</li>
        <li><strong>Staking:</strong> Validator activity, reward distributions, unbonding, and slashing alerts</li>
        <li><strong>Airdrop:</strong> Snapshot notices, claim window openings, surges, and unclaimed reminders</li>
      </ul>

  <div className="my-10 border-t border-neutral-200 dark:border-neutral-800" />

  <h2 className="text-2xl font-semibold mb-4">Advanced Features</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-neutral-900/20 rounded-lg p-4 border border-neutral-800">
          <h3 className="text-xl font-semibold text-indigo-400 mb-2">📊 Live Price Ticker</h3>
          <p className="text-sm text-neutral-300">Real-time REACT token price tracking with multi-exchange API integration. Fixed bottom positioning with persistent state across all pages.</p>
        </div>
        <div className="bg-neutral-900/20 rounded-lg p-4 border border-neutral-800">
          <h3 className="text-xl font-semibold text-indigo-400 mb-2">🎓 Educational Content</h3>
          <p className="text-sm text-neutral-300">Comprehensive Learn page explaining Reactive Network architecture, token utility, and technical concepts with interactive design.</p>
        </div>
        <div className="bg-neutral-900/20 rounded-lg p-4 border border-neutral-800">
          <h3 className="text-xl font-semibold text-indigo-400 mb-2">✨ Glassmorphism UI</h3>
          <p className="text-sm text-neutral-300">Modern glass-like design with backdrop blur effects, translucent backgrounds, and floating gradient elements for premium aesthetics.</p>
        </div>
        <div className="bg-neutral-900/20 rounded-lg p-4 border border-neutral-800">
          <h3 className="text-xl font-semibold text-indigo-400 mb-2">💾 Save & Organize</h3>
          <p className="text-sm text-neutral-300">Bookmark interesting events with our save-for-later system. Access your saved content anytime from your profile page.</p>
        </div>
        <div className="bg-neutral-900/20 rounded-lg p-4 border border-neutral-800">
          <h3 className="text-xl font-semibold text-indigo-400 mb-2">⭐ Community Reviews</h3>
          <p className="text-sm text-neutral-300">Rate your experience and read reviews from other users. Help improve the platform with your feedback.</p>
        </div>
        <div className="bg-neutral-900/20 rounded-lg p-4 border border-neutral-800">
          <h3 className="text-xl font-semibold text-indigo-400 mb-2">👁️ Monitored Addresses</h3>
          <p className="text-sm text-neutral-300">Add wallet addresses or transaction hashes, highlight matching events, or toggle a &quot;show only monitored&quot; mode for focused analysis.</p>
        </div>
        <div className="bg-neutral-900/20 rounded-lg p-4 border border-neutral-800">
          <h3 className="text-xl font-semibold text-indigo-400 mb-2">⚡ Live Updates</h3>
          <p className="text-sm text-neutral-300">Deterministic stateless multi-chain batches every 10s with aligned 10s client polling, 500-event sliding window, and pause/resume control.</p>
        </div>
        <div className="bg-neutral-900/20 rounded-lg p-4 border border-neutral-800">
          <h3 className="text-xl font-semibold text-indigo-400 mb-2">🌐 Multi-API Integration</h3>
          <p className="text-sm text-neutral-300">Robust API integration with fallback systems connecting to Bybit, Binance, and CoinGecko for reliable price data.</p>
        </div>
        <div className="bg-neutral-900/20 rounded-lg p-4 border border-neutral-800">
          <h3 className="text-xl font-semibold text-indigo-400 mb-2">🎨 Context Management</h3>
          <p className="text-sm text-neutral-300">Advanced React Context implementation for persistent state management across page navigation without reloading.</p>
        </div>
        <div className="bg-neutral-900/20 rounded-lg p-4 border border-neutral-800">
          <h3 className="text-xl font-semibold text-indigo-400 mb-2">🧠 Fresh-First Caching</h3>
          <p className="text-sm text-neutral-300">Live fetch preferred; cache used only when offline. Optional optimistic mode via <code>NEXT_PUBLIC_USE_OPTIMISTIC_CACHE</code>.</p>
        </div>
      </div>

  <div className="my-10 border-t border-neutral-200 dark:border-neutral-800" />

  <h2 className="text-2xl font-semibold mb-4">Technology Stack</h2>
  <ul className="list-disc list-inside mb-6 space-y-2">
        <li><strong>Frontend:</strong> Next.js 14, React 18, TypeScript with modern App Router</li>
        <li><strong>Styling:</strong> Tailwind CSS with Google Fonts (Outfit & Inter) and advanced glassmorphism effects</li>
        <li><strong>State Management:</strong> React Context API for authentication, saved news, and persistent price data</li>
        <li><strong>API Integration:</strong> Multi-exchange cryptocurrency APIs (Bybit, Binance, CoinGecko) with fallback systems</li>
        <li><strong>Backend:</strong> Next.js API routes with intelligent in-memory caching</li>
        <li><strong>Real-time:</strong> Automated event generation with polling-based synchronization and live price updates</li>
        <li><strong>Storage:</strong> localStorage for preferences, caching, and saved content</li>
        <li><strong>UI/UX:</strong> Responsive design with glassmorphism, smooth animations, and premium visual effects</li>
        <li><strong>Performance:</strong> Optimized context providers preventing unnecessary re-renders and API calls</li>
      </ul>

  <div className="my-10 border-t border-neutral-200 dark:border-neutral-800" />

  <h2 className="text-2xl font-semibold mb-4">Why Monitor On-Chain Events?</h2>
  <p className="mb-6">
  In the fast-paced world of blockchain technology, staying informed about on-chain activities is crucial for making informed decisions. Whether you&apos;re a DeFi trader looking for arbitrage opportunities, a validator monitoring network health, or a developer building reactive applications, real-time event monitoring gives you the edge you need.
      </p>

  <div className="my-10 border-t border-neutral-200 dark:border-neutral-800" />

  <h2 className="text-2xl font-semibold mb-4">Built for Hackathon Excellence</h2>
  <p className="mb-6">
        This application was developed as part of a hackathon focused on the <span className="!text-blue-600 dark:!text-blue-400">Reactive</span> Network ecosystem. It demonstrates the power of <span className="!text-blue-600 dark:!text-blue-400">reactive</span> programming and real-time blockchain monitoring, showcasing how developers can build sophisticated dApps that respond to on-chain events instantly.
      </p>
      
  <p className="mb-6">
        The platform combines cutting-edge features including real-time cryptocurrency price tracking, educational content delivery, and modern glassmorphism design principles. It showcases advanced React patterns with Context API for state persistence, multi-API integration with robust fallback systems, and premium UI/UX design that rivals production trading platforms.
      </p>
      
  <p className="mb-6">
        Key innovations include a persistent price ticker that maintains state across page navigation, comprehensive educational content about <span className="!text-blue-600 dark:!text-blue-400">Reactive</span> Network architecture, and a sophisticated glassmorphism design system that creates depth and visual hierarchy while maintaining accessibility and performance.
      </p>

  <div className="my-10 border-t border-neutral-200 dark:border-neutral-800" />

  <h2 className="text-3xl font-semibold mb-4">About the Developer</h2>
  <p className="mb-6 text-neutral-700 dark:text-neutral-300">
        Emmanuel Fidelis Essien is a frontend engineer focused on building performant, accessible user interfaces for web3 and data-intensive applications. He enjoys translating complex real‑time concepts into intuitive product experiences using React, Next.js, and modern design systems.
      </p>
      <p className="mb-6 text-neutral-700 dark:text-neutral-300">
        This project combines two long‑standing interests—on‑chain analytics and interface engineering—while demonstrating structured state management, deterministic data feeds, and a progressive UI foundation that can evolve into a production monitoring suite.
      </p>
      <div className="flex flex-wrap items-center gap-4">
        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">Connect</span>
        <div className="flex items-center gap-3">
          <a href="https://wa.me/2349125913571" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="group p-2 rounded-lg border border-neutral-300/60 dark:border-neutral-700 hover:border-green-500/70 hover:bg-green-500/10 transition">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2c-5.52 0-10 4.46-10 9.97 0 1.76.46 3.48 1.35 4.99L2 22l5.2-1.35a10.07 10.07 0 0 0 4.83 1.23h.01c5.52 0 10-4.46 10-9.97 0-2.67-1.06-5.18-2.98-7.07A10.14 10.14 0 0 0 12.04 2Zm0 1.8c2.17 0 4.22.84 5.76 2.36a8.16 8.16 0 0 1 2.4 5.8c0 4.54-3.72 8.22-8.29 8.22-1.45 0-2.88-.38-4.14-1.11l-.3-.17-3.08.8.82-3-.18-.3A8.13 8.13 0 0 1 3.8 13.9c0-4.54 3.72-8.21 8.24-8.21Zm4.72 11.78c-.26-.13-1.53-.75-1.77-.84-.24-.09-.41-.13-.58.13-.17.26-.67.84-.82 1.02-.15.17-.3.2-.56.07-.26-.13-1.1-.4-2.1-1.27-.78-.68-1.31-1.52-1.46-1.78-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.07-.13-.58-1.39-.8-1.9-.21-.5-.42-.43-.58-.44-.15-.01-.32-.01-.49-.01-.17 0-.45.06-.68.32-.24.26-.9.88-.9 2.14 0 1.26.93 2.48 1.06 2.65.13.17 1.83 2.92 4.53 4 2.71 1.07 2.71.71 3.2.67.49-.04 1.6-.64 1.83-1.26.23-.62.23-1.15.16-1.26-.07-.11-.24-.17-.5-.3Z" />
            </svg>
          </a>
          <a href="https://github.com/emma31-dev" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="group p-2 rounded-lg border border-neutral-300/60 dark:border-neutral-700 hover:border-neutral-500 hover:bg-neutral-500/10 transition">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-neutral-800 dark:text-neutral-200 group-hover:scale-110 transition-transform" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.48 2 2 6.58 2 12.14c0 4.47 2.87 8.26 6.84 9.61.5.1.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.52 1.06 1.52 1.06.9 1.56 2.36 1.11 2.94.85.09-.67.35-1.11.63-1.37-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.32.1-2.75 0 0 .84-.27 2.75 1.05a9.3 9.3 0 0 1 2.5-.34c.85 0 1.7.11 2.5.34 1.9-1.32 2.74-1.05 2.74-1.05.55 1.43.2 2.49.1 2.75.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.95.68 1.92 0 1.38-.01 2.49-.01 2.83 0 .26.18.59.69.48A10.16 10.16 0 0 0 22 12.14C22 6.58 17.52 2 12 2Z" clipRule="evenodd" />
            </svg>
          </a>
          <a href="https://twitter.com/emmafidel31" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X" className="group p-2 rounded-lg border border-neutral-300/60 dark:border-neutral-700 hover:border-sky-500/70 hover:bg-sky-500/10 transition">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-sky-600 dark:text-sky-400 group-hover:scale-110 transition-transform" fill="currentColor" aria-hidden="true">
              <path d="M17.53 3h2.9l-6.35 7.27L22 21h-6.4l-4.54-5.95L5.6 21H2.68l6.8-7.8L2 3h6.5l4.1 5.47L17.53 3Zm-1.12 15.68h1.61L7.65 4.22H5.9l10.51 14.46Z" />
            </svg>
          </a>
          <a href="https://portfolio-73mw.vercel.app" target="_blank" rel="noopener noreferrer" aria-label="Portfolio website" className="group p-2 rounded-lg border border-neutral-300/60 dark:border-neutral-700 hover:border-indigo-500/70 hover:bg-indigo-500/10 transition">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform" fill="currentColor" aria-hidden="true">
              <path d="M12 2.25c-5.38 0-9.75 4.37-9.75 9.75s4.37 9.75 9.75 9.75 9.75-4.37 9.75-9.75S17.38 2.25 12 2.25Zm0 1.5c1.3 0 2.52.3 3.6.84-.45.62-.84 1.38-1.14 2.25H9.54c-.3-.87-.69-1.63-1.14-2.25A8.2 8.2 0 0 1 12 3.75Zm-3.3 10.5c-.18-.75-.3-1.57-.33-2.4h6.26c-.03.83-.15 1.65-.33 2.4H8.7Zm.6 1.5h5.4c-.42 1.38-1.05 2.46-1.8 3.12-.3.27-.6.48-.9.6-.3-.12-.6-.33-.9-.6-.75-.66-1.38-1.74-1.8-3.12Zm-2.04-6c.03-.83.15-1.65.33-2.4h6.6c.18.75.3 1.57.33 2.4H7.26Zm8.4 0c-.03-.9-.15-1.77-.36-2.58.36-.96.87-1.74 1.47-2.28A8.27 8.27 0 0 1 20.25 12c0 2.25-.9 4.29-2.37 5.77-.6-.54-1.11-1.32-1.47-2.28.21-.81.33-1.68.36-2.58Zm-9.33-4.86c.6.54 1.11 1.32 1.47 2.28-.21.81-.33 1.68-.36 2.58.03.9.15 1.77.36 2.58-.36.96-.87 1.74-1.47 2.28A8.27 8.27 0 0 1 3.75 12c0-2.25.9-4.29 2.37-5.77Z" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
