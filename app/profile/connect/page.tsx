"use client";
import React from 'react';
import WalletConnectButton from '../../../components/WalletConnectButton';

export default function ProfileConnectPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-4">Connect Wallet</h1>
      <div className="bg-white/80 dark:bg-neutral-900/30 rounded-lg p-6 border border-neutral-200 dark:border-neutral-800">
        <p className="text-sm text-neutral-500 mb-4">Connect your wallet here to interact with blockchain features.</p>
        <WalletConnectButton />
      </div>
    </div>
  );
}
