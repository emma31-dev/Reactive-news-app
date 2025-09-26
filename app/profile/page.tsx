"use client";
import React from 'react';
import { AuthGate } from '../../components/AuthGate';
import { useAuth } from '../../components/AuthContext';
import { useSavedNews } from '../../components/SavedNewsContext';
import { useWeb3 } from '../../components/Web3Context';
import { Web3ConnectButton } from '../../components/VerificationBadge';
import { ChainSelector } from '../../components/ChainSelector';
import { AdvancedMonitor } from '../../components/AdvancedMonitor';
import { WalletDiagnostics } from '../../components/WalletDiagnostics';

export default function ProfilePage() {
  return (
    <AuthGate>
      <ProfileContent />
    </AuthGate>
  );
}

// Wallet section component
function WalletSection() {
  const { 
    connected, 
    account, 
    chainId, 
    connect,
    switchToReactiveNetwork
  } = useWeb3();
  
  const [balance, setBalance] = React.useState<string>('0.0000');
  const isCorrectNetwork = chainId === 5318008; // Reactive Network Testnet
  
  const fetchBalance = React.useCallback(async () => {
    try {
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const { ethers } = await import('ethers');
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const balance = await provider.getBalance(account!);
        setBalance(ethers.formatEther(balance));
      }
    } catch (error) {
      console.error('Failed to fetch balance:', error);
    }
  }, [account]);

  // Fetch balance when connected
  React.useEffect(() => {
    if (connected && account) {
      fetchBalance();
    }
  }, [connected, account, chainId, fetchBalance]);

  return (
    <section className="space-y-4">
      <div>
        <h3 className="text-sm font-medium uppercase tracking-wide text-neutral-600 dark:text-neutral-500">Wallet & Blockchain</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Connect your wallet to interact with blockchain features and earn REACT tokens
        </p>
      </div>

      <div className="bg-white/80 dark:bg-neutral-900/30 rounded-lg p-6 border border-neutral-200 dark:border-neutral-800 backdrop-blur-sm shadow-sm">
        {!connected ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto mb-4 text-neutral-400 dark:text-neutral-500">
              <svg className="w-full h-full stroke-current" fill="none" viewBox="0 0 48 48">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} 
                      d="M8 12h32M8 18h32M8 24h32M8 30h32M8 36h32M8 42h32" />
              </svg>
            </div>
            <h4 className="text-lg font-medium text-indigo-600 dark:text-indigo-300">Connect Your Wallet</h4>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Connect to participate in news verification, earn rewards, and access blockchain features
            </p>
            <Web3ConnectButton />
            
            {/* Diagnostics Panel (for debugging) */}
            <WalletDiagnostics />
            
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800 text-left">
              <h5 className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-1">🚿 Free Testnet Tokens</h5>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-2">
                Need REACT tokens for testing? Get free testnet tokens from the faucet:
              </p>
              <a
                href="https://kopli-faucet.reactive.network"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 underline"
              >
                Get Testnet REACT →
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Connection Status */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-600 dark:text-green-400">Wallet Connected</span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
                  {account?.slice(0, 6)}...{account?.slice(-4)}
                </p>
              </div>
              {!isCorrectNetwork && (
                <button
                  onClick={switchToReactiveNetwork}
                  className="px-3 py-1 text-xs bg-yellow-600 text-yellow-100 rounded hover:bg-yellow-500 transition"
                >
                  Switch to Reactive
                </button>
              )}
            </div>

            {/* Balance */}
            <div className="bg-neutral-100 dark:bg-neutral-800/50 rounded-lg p-4 border border-neutral-200 dark:border-transparent">
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Balance</h5>
                <span className="text-xs text-neutral-500 dark:text-neutral-500">Reactive Network</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-semibold text-indigo-600 dark:text-indigo-300">
                  {balance ? `${parseFloat(balance).toFixed(4)}` : '0.0000'}
                </span>
                <span className="text-sm text-neutral-500 dark:text-neutral-400">REACT</span>
              </div>
              {parseFloat(balance || '0') < 0.001 && (
                <div className="mt-2 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-700">
                  <p className="text-xs text-yellow-700 dark:text-yellow-300">
                    💡 Low balance detected. Get free testnet tokens from the{' '}
                    <a
                      href="https://kopli-faucet.reactive.network"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-600 dark:text-yellow-200 hover:text-yellow-500 dark:hover:text-yellow-100 underline"
                    >
                      faucet
                    </a>
                  </p>
                </div>
              )}
            </div>

            {/* Blockchain Activity */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-neutral-100 dark:bg-neutral-800/50 rounded-lg p-4 text-center border border-neutral-200 dark:border-transparent">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                  {isCorrectNetwork ? '✓' : '○'}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">Network Status</div>
              </div>
              <div className="bg-neutral-100 dark:bg-neutral-800/50 rounded-lg p-4 text-center border border-neutral-200 dark:border-transparent">
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                  {chainId || 'N/A'}
                </div>
                <div className="text-xs text-neutral-500 dark:text-neutral-400">Chain ID</div>
              </div>
            </div>

            {/* Network Status */}
            <div className="bg-neutral-100 dark:bg-neutral-800/50 rounded-lg p-4 border border-neutral-200 dark:border-transparent">
              <h5 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Network Status</h5>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">Current Network:</span>
                  <span className={`font-mono ${isCorrectNetwork ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                    {isCorrectNetwork ? 'Reactive Network' : `Chain ${chainId}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">Account:</span>
                  <span className="font-mono text-neutral-600 dark:text-neutral-300">
                    {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500 dark:text-neutral-400">Contract Ready:</span>
                  <span className={`${isCorrectNetwork ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {isCorrectNetwork ? '✓ Ready' : '✗ Switch Network'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
              <div className="flex gap-3 text-xs">
                <a
                  href={`https://kopli.reactscan.net/address/${account}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 text-center bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 rounded transition"
                >
                  View on Explorer
                </a>
                <a
                  href="https://kopli-faucet.reactive.network"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 text-center bg-indigo-600 hover:bg-indigo-500 text-white rounded transition"
                >
                  Get Testnet Tokens
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function ProfileContent() {
  const { user } = useAuth();
  const { savedNews, unsaveNews, getSavedNewsCount } = useSavedNews();
  const mockName = user?.email?.split('@')[0] || 'User';
  const [avatar, setAvatar] = React.useState<string | null>(null);
  const [showAllSaved, setShowAllSaved] = React.useState(false);

  const onAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setAvatar(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center gap-4">
        <div className="relative w-20 h-20 rounded-full ring-2 ring-indigo-500 bg-neutral-200 dark:bg-neutral-800 overflow-hidden flex items-center justify-center text-xl font-semibold text-neutral-600 dark:text-neutral-300">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="Avatar" className="object-cover w-full h-full" />
          ) : (
            mockName.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold tracking-tight">{mockName}</h2>
            <span className="inline-block px-2 py-1 text-[10px] font-semibold !text-white bg-indigo-600 rounded-full">Basic Plan</span>
          </div>
          <p className="text-xs text-neutral-500">{user?.email}</p>
          <label className="mt-2 inline-block text-xs cursor-pointer text-indigo-500 hover:underline">
            Change picture
            <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
          </label>
        </div>
      </header>

      {/* Event preferences removed; chain filter now primary personalization tool */}
      <section className="space-y-2">
        <h3 className="text-sm font-medium uppercase tracking-wide text-neutral-500">Chain Filter</h3>
        <p className="text-xs text-neutral-400 mb-2">Select a blockchain to filter your feed across the app.</p>
        <div className="bg-white/70 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
          <ChainSelector showTitle={false} />
        </div>
      </section>

      {/* Advanced address / tx monitoring */}
      <section className="space-y-2">
        <div className="bg-white/70 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4">
          <AdvancedMonitor />
        </div>
      </section>

      {/* Wallet Section */}
      <WalletSection />

      {/* Saved News Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wide text-neutral-500">Saved News</h3>
            <p className="text-xs text-neutral-400 mt-1">
              {getSavedNewsCount() > 0 
                ? `${getSavedNewsCount()} saved article${getSavedNewsCount() !== 1 ? 's' : ''}`
                : 'No saved articles yet. Save interesting news from the home feed!'
              }
            </p>
          </div>
          {getSavedNewsCount() > 3 && (
            <button
              onClick={() => setShowAllSaved(!showAllSaved)}
              className="text-xs text-indigo-500 hover:text-indigo-400 font-medium"
            >
              {showAllSaved ? 'Show less' : 'Show all'}
            </button>
          )}
        </div>

        {getSavedNewsCount() === 0 ? (
          <div className="bg-neutral-900/20 rounded-lg p-6 text-center border border-dashed border-neutral-700">
            <div className="w-12 h-12 mx-auto mb-3 text-neutral-500">
              <svg className="w-full h-full stroke-current" fill="none" viewBox="0 0 48 48">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 8a2 2 0 012-2h28a2 2 0 012 2v32a2 2 0 01-3.2 1.6L24 32l-12.8 9.6A2 2 0 018 40V8z"/>
              </svg>
            </div>
            <p className="text-sm text-neutral-400">Start saving news articles for easy access later</p>
            <p className="text-xs text-neutral-500 mt-1">Click the bookmark icon on any news item</p>
          </div>
        ) : (
          <div className="space-y-3">
            {(showAllSaved ? savedNews : savedNews.slice(0, 3)).map((item) => (
              <div
                key={item.id}
                className="border border-neutral-800 rounded-md p-4 bg-neutral-900/20 backdrop-blur-xl hover:bg-neutral-800/30 transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-indigo-300 leading-snug mb-2">{item.title}</h4>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          item.category === 'Whale Watch' ? 'bg-blue-900 text-blue-200' :
                          item.category === 'Governance' ? 'bg-purple-900 text-purple-200' :
                          item.category === 'Security' ? 'bg-red-900 text-red-200' :
                          'bg-emerald-900 text-emerald-200'
                        }`}
                      >
                        {item.category}
                      </span>
                      <span className="text-xs text-neutral-500">by {item.author}</span>
                    </div>

                    <p className="text-sm text-neutral-400 mb-2 line-clamp-2">{item.content}</p>
                    
                    <div className="text-[10px] text-neutral-500">
                      Saved on {new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => unsaveNews(item.id)}
                    className="p-1.5 rounded-full text-yellow-400 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                    title="Remove from saved"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v14a1 1 0 01-1.6.8L10 14.4l-5.4 3.4A1 1 0 013 17V3z"/>
                    </svg>
                  </button>
                </div>

                {/* Additional details for specific categories */}
                {item.category === 'Whale Watch' && item.transactionHash && (
                  <div className="mt-3 pt-3 border-t border-neutral-800 text-xs text-neutral-500 space-y-1 font-mono">
                    <p><strong>Tx Hash:</strong> {item.transactionHash}</p>
                    {item.fromAddress && <p><strong>From:</strong> {item.fromAddress}</p>}
                    {item.toAddress && <p><strong>To:</strong> {item.toAddress}</p>}
                  </div>
                )}

                {item.category === 'Governance' && item.proposalId && (
                  <div className="mt-3 pt-3 border-t border-neutral-800 text-xs text-neutral-500 space-y-1 font-mono">
                    <p><strong>Proposal ID:</strong> {item.proposalId}</p>
                  </div>
                )}
              </div>
            ))}
            
            {!showAllSaved && getSavedNewsCount() > 3 && (
              <div className="text-center pt-2">
                <p className="text-xs text-neutral-500">
                  {getSavedNewsCount() - 3} more saved article{getSavedNewsCount() - 3 !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
