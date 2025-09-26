"use client";
import React from 'react';

export default function AboutPage() {
  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">About <span className="!text-blue-600 dark:!text-blue-400">Reactive</span> Network Monitor</h1>
      <p className="mb-4">
        Welcome to the <span className="!text-blue-600 dark:!text-blue-400">Reactive</span> Network Monitor - a cutting-edge on-chain event monitoring platform built specifically for the <span className="!text-blue-600 dark:!text-blue-400">Reactive</span> Network ecosystem. Our application provides real-time insights into blockchain activities, helping developers, validators, and users stay informed about critical on-chain events as they happen.
      </p>
      
      <h2 className="text-2xl font-semibold mb-3">What is the <span className="!text-blue-600 dark:!text-blue-400">Reactive</span> Network?</h2>
      <p className="mb-4">
        The <span className="!text-blue-600 dark:!text-blue-400">Reactive</span> Network is an innovative blockchain platform that enables <span className="!text-blue-600 dark:!text-blue-400">reactive</span> smart contracts and cross-chain interoperability. It allows smart contracts to automatically respond to events across multiple blockchain networks, creating a more connected and responsive decentralized ecosystem.
      </p>

      <h2 className="text-2xl font-semibold mb-3">Key Features</h2>
      <ul className="list-disc list-inside mb-4 space-y-2">
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

      <h2 className="text-2xl font-semibold mb-3">Event Categories</h2>
      <ul className="list-disc list-inside mb-4 space-y-2">
        <li><strong>Whale Watch:</strong> Large token transfers, liquidity events, and high-value transactions</li>
        <li><strong>Governance:</strong> Proposal creation, voting events, and protocol governance activities</li>
        <li><strong>Security:</strong> Smart contract upgrades, security incidents, and access control changes</li>
        <li><strong>Market:</strong> Price oracle updates, arbitrage opportunities, and macro trading signals</li>
        <li><strong>DeFi:</strong> Protocol upgrades, TVL shifts, liquidity mining, and yield events</li>
        <li><strong>NFT:</strong> Collection mints, floor price movements, rarity sales, and whale sweeps</li>
        <li><strong>Staking:</strong> Validator activity, reward distributions, unbonding, and slashing alerts</li>
        <li><strong>Airdrop:</strong> Snapshot notices, claim window openings, surges, and unclaimed reminders</li>
      </ul>

      <h2 className="text-2xl font-semibold mb-3">Advanced Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-neutral-900/20 rounded-lg p-4 border border-neutral-800">
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">📊 Live Price Ticker</h3>
          <p className="text-sm text-neutral-300">Real-time REACT token price tracking with multi-exchange API integration. Fixed bottom positioning with persistent state across all pages.</p>
        </div>
        <div className="bg-neutral-900/20 rounded-lg p-4 border border-neutral-800">
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">🎓 Educational Content</h3>
          <p className="text-sm text-neutral-300">Comprehensive Learn page explaining Reactive Network architecture, token utility, and technical concepts with interactive design.</p>
        </div>
        <div className="bg-neutral-900/20 rounded-lg p-4 border border-neutral-800">
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">✨ Glassmorphism UI</h3>
          <p className="text-sm text-neutral-300">Modern glass-like design with backdrop blur effects, translucent backgrounds, and floating gradient elements for premium aesthetics.</p>
        </div>
        <div className="bg-neutral-900/20 rounded-lg p-4 border border-neutral-800">
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">💾 Save & Organize</h3>
          <p className="text-sm text-neutral-300">Bookmark interesting events with our save-for-later system. Access your saved content anytime from your profile page.</p>
        </div>
        <div className="bg-neutral-900/20 rounded-lg p-4 border border-neutral-800">
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">⭐ Community Reviews</h3>
          <p className="text-sm text-neutral-300">Rate your experience and read reviews from other users. Help improve the platform with your feedback.</p>
        </div>
        <div className="bg-neutral-900/20 rounded-lg p-4 border border-neutral-800">
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">👁️ Monitored Addresses</h3>
          <p className="text-sm text-neutral-300">Add wallet addresses or transaction hashes, highlight matching events, or toggle a &quot;show only monitored&quot; mode for focused analysis.</p>
        </div>
        <div className="bg-neutral-900/20 rounded-lg p-4 border border-neutral-800">
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">⚡ Live Updates</h3>
          <p className="text-sm text-neutral-300">Deterministic stateless multi-chain batches every 10s with aligned 10s client polling, 500-event sliding window, and pause/resume control.</p>
        </div>
        <div className="bg-neutral-900/20 rounded-lg p-4 border border-neutral-800">
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">🌐 Multi-API Integration</h3>
          <p className="text-sm text-neutral-300">Robust API integration with fallback systems connecting to Bybit, Binance, and CoinGecko for reliable price data.</p>
        </div>
        <div className="bg-neutral-900/20 rounded-lg p-4 border border-neutral-800">
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">🎨 Context Management</h3>
          <p className="text-sm text-neutral-300">Advanced React Context implementation for persistent state management across page navigation without reloading.</p>
        </div>
        <div className="bg-neutral-900/20 rounded-lg p-4 border border-neutral-800">
          <h3 className="text-lg font-semibold text-indigo-400 mb-2">🧠 Fresh-First Caching</h3>
          <p className="text-sm text-neutral-300">Live fetch preferred; cache used only when offline. Optional optimistic mode via <code>NEXT_PUBLIC_USE_OPTIMISTIC_CACHE</code>.</p>
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-3">Technology Stack</h2>
      <ul className="list-disc list-inside mb-4 space-y-2">
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

      <div className="my-8 border-t border-neutral-200 dark:border-neutral-800" />

      <h2 className="text-2xl font-semibold mb-3">Why Monitor On-Chain Events?</h2>
      <p className="mb-4">
  In the fast-paced world of blockchain technology, staying informed about on-chain activities is crucial for making informed decisions. Whether you&apos;re a DeFi trader looking for arbitrage opportunities, a validator monitoring network health, or a developer building reactive applications, real-time event monitoring gives you the edge you need.
      </p>

      <h2 className="text-2xl font-semibold mb-3">Built for Hackathon Excellence</h2>
      <p className="mb-4">
        This application was developed as part of a hackathon focused on the <span className="!text-blue-600 dark:!text-blue-400">Reactive</span> Network ecosystem. It demonstrates the power of <span className="!text-blue-600 dark:!text-blue-400">reactive</span> programming and real-time blockchain monitoring, showcasing how developers can build sophisticated dApps that respond to on-chain events instantly.
      </p>
      
      <p className="mb-4">
        The platform combines cutting-edge features including real-time cryptocurrency price tracking, educational content delivery, and modern glassmorphism design principles. It showcases advanced React patterns with Context API for state persistence, multi-API integration with robust fallback systems, and premium UI/UX design that rivals production trading platforms.
      </p>
      
      <p className="mb-4">
        Key innovations include a persistent price ticker that maintains state across page navigation, comprehensive educational content about <span className="!text-blue-600 dark:!text-blue-400">Reactive</span> Network architecture, and a sophisticated glassmorphism design system that creates depth and visual hierarchy while maintaining accessibility and performance.
      </p>

      <div className="my-8 border-t border-neutral-200 dark:border-neutral-800" />

      <h2 className="text-3xl font-semibold mb-3">About the Developer</h2>
      <p className="mb-4">
        Emmanuel Fidelis Essien is a Frontend developer with a passion for building dynamic web and mobile applications on the web3 ecosystem.
      </p>
      <p className="mb-4">
        With my little experience in React, Nextjs and tailwind, I enjoy bringing ideas to life through code. This project was an opportunity to build an application that breaches my two key interests, crypto trading and web development.
      </p>
      <p className="space-x-2 text-sm">
        <span>Connect with me:</span>
        <a href="https://wa.me/2349125913571" target="_blank" rel="noopener noreferrer" className="text-green-600 dark:text-green-400 hover:underline">WhatsApp</a>
        <span className="text-neutral-400">|</span>
        <a href="https://github.com/emma31-dev" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">GitHub</a>
        <span className="text-neutral-400">|</span>
        <a href="https://twitter.com/emmafidel31" target="_blank" rel="noopener noreferrer" className="text-sky-600 dark:text-sky-400 hover:underline">Twitter</a>
        <span className="text-neutral-400">|</span>
        <a href="https://portfolio-73mw.vercel.app" target="_blank" rel="noopener noreferrer" className="text-pink-600 dark:text-pink-400 hover:underline">Portfolio</a>
      </p>
    </div>
  );
}
