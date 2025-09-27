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
function WalletSection({ hideHeader = false }: { hideHeader?: boolean }) {
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
      {!hideHeader && (
        <div>
          <h3 className="text-sm font-medium uppercase tracking-wide text-neutral-600 dark:text-neutral-500">Wallet & Blockchain</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Connect your wallet to interact with blockchain features and earn REACT tokens
          </p>
        </div>
      )}

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
  const { user, updateUsername } = useAuth();
  const { savedNews, unsaveNews, getSavedNewsCount } = useSavedNews();
  const derivedName = user?.username || user?.email?.split('@')[0] || 'User';
  const [avatar, setAvatar] = React.useState<string | null>(null);
  const [showAllSaved, setShowAllSaved] = React.useState(false);
  const [editingUsername, setEditingUsername] = React.useState(false);
  const [usernameInput, setUsernameInput] = React.useState(derivedName);
  const [usernameStatus, setUsernameStatus] = React.useState<'idle' | 'saved'>('idle');

  // Sync input if user changes (e.g., after login/logout)
  React.useEffect(() => {
    setUsernameInput(derivedName);
  }, [derivedName]);

  const handleSaveUsername = () => {
    const trimmed = usernameInput.trim();
    if (!trimmed || trimmed === derivedName) {
      setEditingUsername(false);
      return;
    }
    updateUsername(trimmed);
    setEditingUsername(false);
    setUsernameStatus('saved');
    setTimeout(() => setUsernameStatus('idle'), 2000);
  };

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
            derivedName.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <div className="flex items-center flex-wrap gap-3">
            {!editingUsername && (
              <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
                {derivedName}
                <button
                  onClick={() => { setEditingUsername(true); setUsernameInput(derivedName); }}
                  className="ml-1 text-xs px-2.5 py-1 rounded-full bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-200 transition shadow-sm"
                  title="Edit username"
                >
                  Edit
                </button>
                {usernameStatus === 'saved' && (
                  <span className="text-[10px] font-medium text-green-600 dark:text-green-400">Saved</span>
                )}
              </h2>
            )}
            {editingUsername && (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="px-2 py-1 text-sm rounded border border-neutral-300 dark:border-neutral-700 bg-white/70 dark:bg-neutral-900/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  maxLength={32}
                  placeholder="New username"
                  autoFocus
                />
                <button
                  onClick={handleSaveUsername}
                  className="text-xs px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-500 transition"
                >Save</button>
                <button
                  onClick={() => { setEditingUsername(false); setUsernameInput(derivedName); }}
                  className="text-xs px-2 py-1 rounded bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-100 transition"
                >Cancel</button>
              </div>
            )}
            <span className="inline-block px-2 py-1 text-[10px] font-semibold !text-white bg-indigo-600 rounded-full">Basic Plan</span>
          </div>
          <p className="text-xs text-neutral-500">{user?.email}</p>
          <label className="mt-2 inline-block text-xs cursor-pointer text-indigo-500 hover:underline">
            Change picture
            <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
          </label>
        </div>
      </header>

      {/* Chain filter section now fully boxed */}
      <section>
  <div className="bg-white/70 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 space-y-2 backdrop-blur-md">
          <div>
            <h3 className="text-sm font-medium uppercase tracking-wide text-neutral-600 dark:text-neutral-400">Chain Filter</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">Select a blockchain to filter your feed across the app.</p>
          </div>
          <div className="pt-2">
            <ChainSelector showTitle={false} />
          </div>
        </div>
      </section>



      {/* Wallet Section boxed wrapper */}
      <section>
  <div className="bg-white/70 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 backdrop-blur-md">
          <div className="mb-4">
            <h3 className="text-sm font-medium uppercase tracking-wide text-neutral-600 dark:text-neutral-400">Wallet & Blockchain</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">Connect your wallet to interact with blockchain features and earn REACT tokens.</p>
          </div>
          {/* Reuse the existing WalletSection content minus its outer section styling */}
          <div>
            <WalletSection hideHeader />
          </div>
        </div>
      </section>

      {/* Saved News Section boxed */}
      <section>
  <div className="bg-white/70 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 rounded-lg p-5 space-y-4 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wide text-neutral-600 dark:text-neutral-400">Saved News</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                {getSavedNewsCount() > 0 
                  ? `${getSavedNewsCount()} saved article${getSavedNewsCount() !== 1 ? 's' : ''}`
                  : 'No saved articles yet. Save interesting news from the home feed!'}
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
                <article
                  key={item.id}
                  className="relative bg-white/70 dark:bg-neutral-900/70 rounded-lg border p-4 hover:shadow-md transition-shadow border-neutral-200 dark:border-neutral-800 hover:border-indigo-400/60"
                >
                  {/* Unsave button */}
                  <button
                    onClick={() => unsaveNews(item.id)}
                    className="absolute top-3 right-3 p-2 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-red-100 dark:hover:bg-red-900/40 hover:text-red-600 dark:hover:text-red-400"
                    title="Remove from saved"
                    aria-label="Remove from saved"
                    type="button"
                  >
                    <svg className="w-4 h-4" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v14.5l-7-3.5-7 3.5V5z" />
                    </svg>
                  </button>

                  <div className="pr-10">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200">
                        {item.category}
                      </span>
                      <time className="text-xs text-neutral-500">
                        {new Date(item.date).toLocaleString()}
                      </time>
                      <span className="text-[10px] text-neutral-400">by {item.author}</span>
                    </div>
                    <h4 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3 line-clamp-2">
                      {item.content}
                    </p>

                    <details className="group mb-3 rounded-md bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 px-3 py-2">
                      <summary className="cursor-pointer select-none text-xs font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                        <span className="transition group-open:rotate-90 inline-block">▶</span>
                        More Details
                      </summary>
                      <div className="mt-2 space-y-2 text-[11px] text-neutral-600 dark:text-neutral-400 font-mono break-all">
                        {[['ID', item.id], ['Category', item.category], ['Author', item.author], ['ISO Timestamp', item.date], ['Local Time', new Date(item.date).toLocaleString()], ['Tx Hash', item.transactionHash], ['From', item.fromAddress], ['To', item.toAddress], ['Proposal', item.proposalId]]
                          .filter(([,v]) => v)
                          .map(([label, value]) => (
                            <div key={label} className="flex items-start gap-2 group/item">
                              <span className="w-24 shrink-0 text-neutral-500 dark:text-neutral-400 font-semibold">{label}:</span>
                              <span className="flex-1 select-text">{value as string}</span>
                              <button
                                onClick={() => { try { navigator.clipboard.writeText(String(value)); } catch {} }}
                                className="opacity-0 group-hover/item:opacity-100 transition p-1 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-600"
                                title="Copy value"
                                aria-label="Copy value"
                                type="button"
                              >
                                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                  <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                                </svg>
                              </button>
                            </div>
                          ))}
                      </div>
                    </details>

                    {(item.transactionHash || item.fromAddress || item.toAddress || item.proposalId) && (
                      <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-700 text-[11px] text-neutral-500 dark:text-neutral-400 space-y-1 font-mono">
                        {item.transactionHash && <p><strong className="font-semibold text-neutral-600 dark:text-neutral-300">Tx:</strong> {item.transactionHash}</p>}
                        {item.fromAddress && <p><strong className="font-semibold text-neutral-600 dark:text-neutral-300">From:</strong> {item.fromAddress}</p>}
                        {item.toAddress && <p><strong className="font-semibold text-neutral-600 dark:text-neutral-300">To:</strong> {item.toAddress}</p>}
                        {item.proposalId && <p><strong className="font-semibold text-neutral-600 dark:text-neutral-300">Proposal:</strong> {item.proposalId}</p>}
                      </div>
                    )}

                    <div className="mt-3 text-[10px] text-neutral-500 dark:text-neutral-500">
                      Saved on {new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </article>
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
        </div>
      </section>
    </div>
  );
}
