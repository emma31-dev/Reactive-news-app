"use client";
import React, { useEffect, useState } from 'react';

export function WalletDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<{
    hasWindow: boolean;
    hasEthereum: boolean;
    isMetaMask: boolean;
    ethereumVersion: string | null;
    accounts: string[];
    chainId: string | null;
    error: string | null;
  }>({
    hasWindow: false,
    hasEthereum: false,
    isMetaMask: false,
    ethereumVersion: null,
    accounts: [],
    chainId: null,
    error: null
  });

  useEffect(() => {
    const runDiagnostics = async () => {
      try {
        const hasWindow = typeof window !== 'undefined';
        const hasEthereum = hasWindow && !!(window as any).ethereum;
        const ethereum = hasWindow ? (window as any).ethereum : null;
        
        let isMetaMask = false;
        let ethereumVersion = null;
        let accounts: string[] = [];
        let chainId = null;
        
        if (ethereum) {
          isMetaMask = !!ethereum.isMetaMask;
          ethereumVersion = ethereum.version || 'unknown';
          chainId = ethereum.chainId || null;
          
          try {
            accounts = await ethereum.request({ method: 'eth_accounts' });
          } catch (err) {
            console.log('Could not get accounts:', err);
          }
        }
        
        setDiagnostics({
          hasWindow,
          hasEthereum,
          isMetaMask,
          ethereumVersion,
          accounts,
          chainId,
          error: null
        });
      } catch (error) {
        setDiagnostics(prev => ({
          ...prev,
          error: error instanceof Error ? error.message : 'Unknown error'
        }));
      }
    };

    runDiagnostics();
  }, []);

  return (
    <div className="bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 text-xs font-mono space-y-2">
      <h4 className="font-semibold text-neutral-800 dark:text-white mb-3">🔍 Wallet Diagnostics</h4>
      
      <div className="space-y-1">
        <div className={`${diagnostics.hasWindow ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          Window: {diagnostics.hasWindow ? '✅ Available' : '❌ Not Available'}
        </div>
        
        <div className={`${diagnostics.hasEthereum ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          window.ethereum: {diagnostics.hasEthereum ? '✅ Found' : '❌ Not Found'}
        </div>
        
        {diagnostics.hasEthereum && (
          <>
            <div className={`${diagnostics.isMetaMask ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
              MetaMask: {diagnostics.isMetaMask ? '✅ Detected' : '⚠️ Not MetaMask'}
            </div>
            
            {diagnostics.ethereumVersion && (
              <div className="text-blue-600 dark:text-blue-400">
                Version: {diagnostics.ethereumVersion}
              </div>
            )}
            
            <div className="text-neutral-600 dark:text-neutral-300">
              Accounts: {diagnostics.accounts.length} connected
            </div>
            
            {diagnostics.chainId && (
              <div className="text-purple-600 dark:text-purple-400">
                Chain ID: {diagnostics.chainId}
              </div>
            )}
          </>
        )}
        
        {diagnostics.error && (
          <div className="text-red-600 dark:text-red-400">
            Error: {diagnostics.error}
          </div>
        )}
      </div>
      
      {!diagnostics.hasEthereum && (
        <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded text-red-700 dark:text-red-300">
          <p className="mb-1">🚨 MetaMask Required</p>
          <p className="text-xs">
            Install MetaMask browser extension to use wallet features:
          </p>
          <a 
            href="https://metamask.io/download/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 underline"
          >
            Download MetaMask →
          </a>
        </div>
      )}
    </div>
  );
}