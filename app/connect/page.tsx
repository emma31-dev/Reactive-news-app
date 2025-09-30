"use client";
import React from 'react';
import WalletConnectButton from '../../components/WalletConnectButton';

export default function ConnectPage() {
  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-2xl font-bold mb-6">Connect Your Wallet</h1>
      <div className="bg-white dark:bg-neutral-900 rounded-lg shadow p-8 flex flex-col items-center">
        <WalletConnectButton />
      </div>
    </div>
  );
}
