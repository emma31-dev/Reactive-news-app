"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useWeb3 } from './Web3Context';
import { useWeb3Modal } from './Web3ModalProvider';

export function WalletConnectButton() {
  const { connected, account, connect, disconnect, connecting } = useWeb3();
  const { available: modalAvailable, open: openWeb3Modal } = useWeb3Modal();
  const router = useRouter();

  const shortAddr = account ? `${account.slice(0,6)}...${account.slice(-4)}` : null;

  // Basic mobile detection
  const isMobile = typeof navigator !== 'undefined' && /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  const hasInjected = typeof window !== 'undefined' && !!(window as any).ethereum;

  if (connected) {
    return (
      <button
        onClick={() => disconnect()}
        className="px-3 py-1 text-sm bg-green-600 text-white rounded border border-green-700 hover:bg-green-700 transition"
        title={account || 'Connected'}
      >
        <span className="inline-flex items-center gap-2">
          <span className="w-2 h-2 bg-green-300 rounded-full inline-block" />
          Connected
          <span className="font-mono text-xs bg-green-800/30 px-2 py-0.5 rounded ml-2">{shortAddr}</span>
        </span>
      </button>
    );
  }
  // If on mobile and no injected provider, offer deep-links to mobile wallets
  if (isMobile && !hasInjected) {
    const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
    const host = typeof window !== 'undefined' ? window.location.host : '';
    // MetaMask mobile deep link (opens MetaMask and navigates to site)
    const metaMaskDeepLink = `https://metamask.app.link/dapp/${host}`;
    // Trust Wallet deep link
    const trustDeepLink = `https://link.trustwallet.com/open_url?url=${encodeURIComponent(currentUrl)}`;

    return (
      <div className="flex items-center gap-2">
        <a
          href={metaMaskDeepLink}
      className="px-3 py-1 text-sm bg-[color:var(--accent)] text-white rounded hover:bg-[color:var(--accent-hover)] transition"
          rel="noopener noreferrer"
        >
          Open in MetaMask
        </a>
        <a
          href={trustDeepLink}
          className="px-3 py-1 text-sm bg-neutral-100 dark:bg-neutral-800 rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
          rel="noopener noreferrer"
        >
          Open in Trust Wallet
        </a>
      </div>
    );
  }

  const handleClick = async () => {
    if (!connected) {
      router.push('/walletconnect');
      return;
    }
    // fallback: if already connected, do nothing or open modal if needed
    if (modalAvailable) {
      try {
        openWeb3Modal();
        return;
      } catch (e) {
        // Always link to /walletconnect if modal fails
        router.push('/walletconnect');
        return;
      }
    }
    try {
      await connect();
    } catch (e) {
      // fallback to /walletconnect if connect fails
      router.push('/walletconnect');
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={connecting}
  className="px-3 py-1 text-sm bg-[color:var(--accent)] text-white rounded hover:bg-[color:var(--accent-hover)] transition disabled:opacity-60"
    >
      {connecting ? 'Connecting…' : 'Connect Wallet'}
    </button>
  );
}

export default WalletConnectButton;
