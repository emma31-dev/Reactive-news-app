"use client";
import React, { useEffect, useState } from 'react';
import { useWeb3 } from './Web3Context';

interface VerificationBadgeProps {
  newsId?: string;
  title: string;
  content: string;
  category: string;
}

export function VerificationBadge({ newsId, title, content, category }: VerificationBadgeProps) {
  const { connected, account, getNewsVerification, newsContract } = useWeb3() as any;
  const [verified, setVerified] = useState<boolean | null>(null);
  const [isVerifier, setIsVerifier] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!newsId) {
        if (mounted) {
          setVerified(null);
          setIsVerifier(null);
        }
        return;
      }
      if (mounted) setLoading(true);
      try {
        // Check on-chain verification flag for this news item
        try {
          const onChain = await getNewsVerification(String(newsId));
          if (mounted) setVerified(Boolean(onChain));
        } catch (e) {
          if (mounted) setVerified(null);
        }

        // If wallet connected and contract exposes verifier info, check if current account is an authorized verifier
        if (connected && account && newsContract && typeof newsContract.getVerifierInfo === 'function') {
          try {
            const info = await newsContract.getVerifierInfo(account);
            const authorized = info && (info.authorized ?? info[0]);
            if (mounted) setIsVerifier(Boolean(authorized));
          } catch (e) {
            if (mounted) setIsVerifier(null);
          }
        } else {
          if (mounted) setIsVerifier(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [newsId, connected, account, getNewsVerification, newsContract]);

  // Show verified state priority -> verifier badge -> not on blockchain
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-neutral-500">
        <svg className="w-4 h-4 animate-spin text-neutral-400" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2"></circle><path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>
        <span>Checking on-chain</span>
      </div>
    );
  }

  if (verified) {
    return (
      <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
        <svg viewBox="0 0 20 20" className="w-4 h-4 text-emerald-600 dark:text-emerald-300" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 10l3 3 7-7" /></svg>
        <span>Verified on-chain</span>
      </div>
    );
  }

  if (isVerifier) {
    return (
      <div className="inline-flex items-center gap-2 text-xs font-medium text-indigo-700 dark:text-indigo-300">
        <svg viewBox="0 0 20 20" className="w-4 h-4 text-indigo-600 dark:text-indigo-300" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2l2 4 4 .5-3 3 .7 4L10 12l-3.7 2.5.7-4L4 6.5 8 6 10 2z" /></svg>
        <span>You are an authorized verifier</span>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1 text-xs text-neutral-600 dark:text-neutral-400">
      <div className="w-2 h-2 bg-gray-400 rounded-full" />
      <span>Not on blockchain</span>
    </div>
  );
}

