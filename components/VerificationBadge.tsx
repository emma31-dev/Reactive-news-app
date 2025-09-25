"use client";
import React, { useState, useEffect } from 'react';
import { useWeb3 } from './Web3Context';

interface VerificationBadgeProps {
  newsId?: string;
  title: string;
  content: string;
  category: string;
}

export function VerificationBadge({ newsId, title, content, category }: VerificationBadgeProps) {
  const { connected, getNewsVerification, submitNews, voteOnNews, account } = useWeb3();
  const [isVerified, setIsVerified] = useState(false);
  const [onChainId, setOnChainId] = useState<string | null>(newsId || null);
  const [submitting, setSubmitting] = useState(false);
  const [voting, setVoting] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'unverified' | 'pending' | 'verified' | 'rejected'>('unverified');

  useEffect(() => {
    if (onChainId && connected) {
      checkVerification();
    }
  }, [onChainId, connected]);

  const checkVerification = async () => {
    if (!onChainId) return;
    
    try {
      const verified = await getNewsVerification(onChainId);
      setIsVerified(verified);
      setVerificationStatus(verified ? 'verified' : 'pending');
    } catch (error) {
      console.error('Error checking verification:', error);
    }
  };

  const handleSubmitToBlockchain = async () => {
    if (!connected || submitting) return;
    
    setSubmitting(true);
    try {
      const result = await submitNews(title, content, category);
      if (result) {
        // If we got a newsId, use it (result is already a string)
        if (result && result.trim()) {
          setOnChainId(result);
          setVerificationStatus('pending');
        }
      }
    } catch (error) {
      console.error('Error submitting to blockchain:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVote = async (upvote: boolean) => {
    if (!connected || !onChainId || voting) return;
    
    setVoting(true);
    try {
      await voteOnNews(onChainId, upvote);
      // Refresh verification status
      setTimeout(checkVerification, 2000);
    } catch (error) {
      console.error('Error voting:', error);
    } finally {
      setVoting(false);
    }
  };

  if (!connected) {
    return (
      <div className="flex items-center space-x-2 text-xs text-gray-500">
        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        <span>Connect wallet for verification</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      {/* Verification Status Badge */}
      <div className="flex items-center space-x-2">
        {verificationStatus === 'verified' && (
          <div className="flex items-center space-x-1 text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium">✅ Verified on Reactive Network</span>
          </div>
        )}
        
        {verificationStatus === 'pending' && (
          <div className="flex items-center space-x-1 text-yellow-600">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium">⏳ Pending Verification</span>
          </div>
        )}
        
        {verificationStatus === 'unverified' && !onChainId && (
          <div className="flex items-center space-x-1 text-gray-600">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-xs font-medium">Not on blockchain</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        {!onChainId && (
          <button
            onClick={handleSubmitToBlockchain}
            disabled={submitting}
            className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? '⏳ Submitting...' : '📝 Submit to Blockchain'}
          </button>
        )}
        
        {onChainId && verificationStatus === 'pending' && (
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleVote(true)}
              disabled={voting}
              className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 transition-colors"
            >
              👍 Verify
            </button>
            <button
              onClick={() => handleVote(false)}
              disabled={voting}
              className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              👎 Reject
            </button>
          </div>
        )}
        
        {onChainId && (
          <a
            href={`https://sepolia-explorer.reactive.network/tx/${onChainId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-500 hover:text-blue-700 underline"
          >
            🔗 View on Reactive Explorer
          </a>
        )}
      </div>
    </div>
  );
}

export function Web3ConnectButton() {
  const { connected, connecting, connect, disconnect, account, chainId, switchToReactiveNetwork } = useWeb3();
  const [switching, setSwitching] = useState(false);

  const handleConnect = async () => {
    try {
      console.log('🔗 Attempting wallet connection...');
      
      if (!window.ethereum) {
        alert('MetaMask not detected! Please install MetaMask to continue.');
        return;
      }
      
      console.log('✅ MetaMask detected, calling connect function...');
      await connect();
      console.log('🎉 Wallet connected successfully!');
    } catch (error) {
      console.error('❌ Connection failed:', error);
      
      // Show user-friendly error messages
      if (error instanceof Error) {
        if (error.message.includes('User rejected')) {
          alert('Connection cancelled. Please accept the MetaMask connection request to continue.');
        } else if (error.message.includes('MetaMask not installed')) {
          alert('MetaMask not installed! Please install MetaMask browser extension.');
        } else {
          alert(`Connection failed: ${error.message}`);
        }
      } else {
        alert('Connection failed. Please try again.');
      }
    }
  };

  const handleSwitchNetwork = async () => {
    setSwitching(true);
    try {
      await switchToReactiveNetwork();
    } catch (error) {
      console.error('Network switch failed:', error);
    } finally {
      setSwitching(false);
    }
  };

  if (!connected) {
    return (
      <div className="space-y-2">
        <button
          onClick={handleConnect}
          disabled={connecting}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
        >
          {connecting ? '🔄 Connecting...' : '🔗 Connect Wallet'}
        </button>
        
        {/* Show MetaMask detection status */}
        {typeof window !== 'undefined' && (
          <div className="text-xs text-neutral-500">
            {window.ethereum ? (
              <span className="text-green-600">✅ MetaMask detected</span>
            ) : (
              <span className="text-red-500">❌ MetaMask not found - <a href="https://metamask.io" target="_blank" rel="noopener noreferrer" className="underline">Install MetaMask</a></span>
            )}
          </div>
        )}
      </div>
    );
  }

  const isOnReactiveNetwork = chainId === 5318008;

  return (
    <div className="flex items-center space-x-3">
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${isOnReactiveNetwork ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`}></div>
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
          {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connected'}
        </span>
      </div>
      
      {!isOnReactiveNetwork && (
        <button
          onClick={handleSwitchNetwork}
          disabled={switching}
          className="px-3 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 transition-colors"
        >
          {switching ? '🔄 Switching...' : '🔗 Switch to Reactive Network'}
        </button>
      )}
      
      <button
        onClick={disconnect}
        className="px-3 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
      >
        🚪 Disconnect
      </button>
    </div>
  );
}