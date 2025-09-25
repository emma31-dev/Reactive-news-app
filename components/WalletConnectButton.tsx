"use client";
import React from 'react';
import { useWeb3 } from './Web3Context';

interface Props {
  variant?: 'primary' | 'ghost';
  className?: string;
  compact?: boolean;
}

// Utility shorten address
const short = (addr: string) => `${addr.slice(0, 6)}…${addr.slice(-4)}`;

export const WalletConnectButton: React.FC<Props> = ({ variant = 'primary', className = '', compact }) => {
  const { connected, connecting, connect, disconnect, account, chainId, switchToReactiveNetwork } = useWeb3();

  const base = 'relative group inline-flex items-center gap-2 rounded-full font-medium tracking-wide transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-400 disabled:opacity-60 disabled:cursor-not-allowed';
  const primary = 'bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white shadow-sm shadow-indigo-900/30 hover:shadow-md px-5 py-2';
  const ghost = 'bg-neutral-100/70 dark:bg-neutral-800/60 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 px-4 py-2';
  const pill = variant === 'primary' ? primary : ghost;

  if (!connected) {
    return (
      <button
        onClick={() => connect().catch(()=>{})}
        disabled={connecting}
        className={`${base} ${pill} ${className} font-[var(--font-outfit)]`}
      >
        {connecting ? (
          <span className='flex items-center gap-2'>
            <span className='w-2 h-2 rounded-full bg-white animate-pulse'></span>
            <span className='text-xs uppercase tracking-wider'>Connecting…</span>
          </span>
        ) : (
          <span className='flex items-center gap-2'>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className='opacity-90'>
              <path d="M4 12h16" />
              <path d="M12 4v16" />
            </svg>
            <span className='text-sm'>Connect Wallet</span>
          </span>
        )}
      </button>
    );
  }

  const wrongNetwork = chainId !== 5318008 && chainId !== null;

  return (
    <div className={`flex items-stretch ${className} font-[var(--font-outfit)]`}>
      <button
        className={`${base} ${pill} pr-4 pl-4 ${wrongNetwork ? 'ring-2 ring-amber-400 animate-pulse' : ''}`}
        title={account || 'Wallet Connected'}
        onClick={() => wrongNetwork ? switchToReactiveNetwork() : undefined}
      >
        <span className='flex items-center gap-2'>
          <span className={`w-2 h-2 rounded-full ${wrongNetwork ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`}></span>
          <span className='text-xs md:text-sm'>{account ? short(account) : 'Connected'}</span>
          {wrongNetwork && <span className='text-[10px] font-semibold bg-amber-500/20 text-amber-200 px-2 py-0.5 rounded-full'>Switch</span>}
        </span>
      </button>
      {!compact && (
        <button
          onClick={disconnect}
          className={`ml-2 ${base} bg-neutral-200/70 dark:bg-neutral-700/60 hover:bg-neutral-300 dark:hover:bg-neutral-600 text-neutral-800 dark:text-neutral-100 px-3`}
          title='Disconnect'
        >
          <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
            <path d='M15 3h4a2 2 0 0 1 2 2v3' />
            <path d='M21 16v3a2 2 0 0 1-2 2h-4' />
            <path d='M3 9v6' />
            <path d='M7 9v6' />
            <path d='M3 12h14' />
          </svg>
        </button>
      )}
    </div>
  );
};

export default WalletConnectButton;
