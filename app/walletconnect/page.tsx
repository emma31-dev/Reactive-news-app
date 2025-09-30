"use client";
import React from "react";

export default function WalletConnectPage() {
  React.useEffect(() => {
    // Prevent scrolling on this page
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = original; };
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-transparent px-4 relative overflow-hidden pt-24">
      <div className="max-w-md w-full mx-auto rounded-lg shadow-lg p-8 flex flex-col items-center bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md border border-white/30 dark:border-neutral-800/40">
  <h1 className="text-2xl font-bold mb-4 text-center text-[color:var(--accent)]">Connect Your Wallet</h1>
        <p className="mb-6 text-neutral-700 dark:text-neutral-200 text-center">
          To use Reactive News, connect your wallet. We support MetaMask on both desktop and mobile devices.
        </p>
        <MetaMaskConnectOptions />
      </div>
    </div>
  );
}

function MetaMaskConnectOptions() {
  // Basic mobile detection
  const isMobile = typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const hasInjected = typeof window !== 'undefined' && !!(window as any).ethereum;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  const host = typeof window !== 'undefined' ? window.location.host : '';
  // MetaMask mobile deep link (opens MetaMask and navigates to site)
  const metaMaskDeepLink = `https://metamask.app.link/dapp/${host}`;

  const handleDesktopConnect = async () => {
    if (hasInjected) {
      try {
        await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        window.location.reload();
      } catch (e) {
        alert('Wallet connection failed.');
      }
    } else {
      window.open('https://metamask.io/download/', '_blank');
    }
  };

  if (isMobile && !hasInjected) {
    return (
      <a
        href={metaMaskDeepLink}
  className="w-full px-4 py-3 mb-2 text-center bg-[color:var(--accent)] text-white rounded hover:bg-[color:var(--accent-hover)] transition font-semibold"
        rel="noopener noreferrer"
      >
        Open in MetaMask Mobile
      </a>
    );
  }

  return (
    <button
      onClick={handleDesktopConnect}
  className="w-full px-4 py-3 mb-2 bg-[color:var(--accent)] text-white rounded hover:bg-[color:var(--accent-hover)] transition font-semibold"
    >
      {hasInjected ? 'Connect with MetaMask' : 'Install MetaMask'}
    </button>
  );
}
