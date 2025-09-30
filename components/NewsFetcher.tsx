"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useSavedNews } from './SavedNewsContext';
import { useNews } from './NewsContext';
import { VerificationBadge } from './VerificationBadge';
import { useAuth } from './AuthContext';

// Removed external ldrs loader; using lightweight inline CSS dots

interface NewsItem {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  category: string;
  chain?: string;
  transactionHash?: string;
  fromAddress?: string;
  toAddress?: string;
  proposalId?: string;
  verbose?: string;
  eventType?: string;
  blockHeight?: number;
  gasUsed?: number;
  reactValue?: number;
}

const ITEMS_PER_PAGE = 25;

// Static category list (defined outside component to avoid re-creation each render and dependency churn)
const CATEGORIES = ['All', 'Whale Watch', 'Governance', 'Security', 'Market', 'DeFi', 'NFT', 'Staking', 'Airdrop'] as const;

export function NewsFetcher() {
  // Get news data from global context
  const { items, loading, error, success, loadedFromCache, newItemIds, refreshNews, cumulativeTotal, autoRefresh, pauseAutoRefresh, resumeAutoRefresh, selectedChain } = useNews();
  // Auth (for user category preferences)
  const { user, monitoredAddresses, monitoredOnly, monitoredMeta } = useAuth();
  
  // Local state for UI management
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('All');
  
  const { saveNews, unsaveNews, isNewsSaved, getSavedNewsCount, getSaveLimit, canSaveMore } = useSavedNews();
  const [saveError, setSaveError] = useState<string | null>(null);

  // Preferences UI was removed; treat all categories as enabled
  const preferenceFilteredItems = items;

  // Apply chain filter (news-level) AFTER preference filtering
  const chainFilteredItems = useMemo(() => {
    if (!selectedChain || selectedChain === 'All') return preferenceFilteredItems;
    return preferenceFilteredItems.filter(i => i.chain === selectedChain);
  }, [preferenceFilteredItems, selectedChain]);

  // Apply monitored-only filter (if enabled) then manual UI category filter
  const filteredItems = useMemo(() => {
    let base = chainFilteredItems;
    if (monitoredOnly && monitoredAddresses.length) {
      base = base.filter(i => {
        const hay = [i.fromAddress, i.toAddress, i.transactionHash].filter(Boolean) as string[];
        return hay.some(val => monitoredAddresses.includes(val.toLowerCase()));
      });
    }
    if (filter === 'All') return base;
    return base.filter(item => item.category === filter);
  }, [chainFilteredItems, filter, monitoredOnly, monitoredAddresses]);
  
  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

  useEffect(() => {
    const newTotalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    if (newTotalPages > 0 && currentPage > newTotalPages) {
      setCurrentPage(newTotalPages);
    }
  }, [filteredItems.length, currentPage]);

  // Use useMemo to ensure proper recalculation of currentItems
  const currentItems = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const slicedItems = filteredItems.slice(startIndex, endIndex);
    return slicedItems;
  }, [filteredItems, currentPage]);

  // Auto-save monitored matching items (scan full dataset so filtering/pagination doesn't hide matches)
  useEffect(() => {
    if (monitoredAddresses.length === 0) return;
    if (!items || items.length === 0) return;
    try {
      items.forEach(item => {
        if (isNewsSaved(item.id)) return;
        const hay = [item.fromAddress, item.toAddress, item.transactionHash].filter(Boolean) as string[];
        if (hay.some(v => monitoredMeta[v.toLowerCase()]?.auto)) {
          try { saveNews(item); } catch { /* swallow */ }
        }
      });
    } catch { /* swallow */ }
  }, [monitoredAddresses, monitoredMeta, items, saveNews, isNewsSaved]);

  const goToNextPage = () => setCurrentPage((page) => Math.min(page + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((page) => Math.max(page - 1, 1));

  return (
    <div className="space-y-6">
      
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={autoRefresh ? pauseAutoRefresh : resumeAutoRefresh}
          className={`px-3 py-1.5 text-xs rounded-md font-medium border transition ${autoRefresh ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-300 border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-900/40' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900/40'}`}
          title={autoRefresh ? 'Stop automatic fetching' : 'Resume automatic fetching'}
        >
          {autoRefresh ? 'Stop Auto Fetch' : 'Resume Auto Fetch'}
        </button>
        <button
          onClick={refreshNews}
          disabled={loading}
          className="px-3 py-1.5 text-xs rounded-md font-medium border border-indigo-300 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Refreshing…' : 'Manual Refresh'}
        </button>
      </div>

      {/* Summary Stats */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="bg-blue-100 dark:bg-blue-900/20 px-3 py-1.5 rounded-full">
          <span className="font-medium text-blue-800 dark:text-blue-300">
            {filter === 'All' ? chainFilteredItems.length : filteredItems.length} {filter === 'All' ? 'Visible' : filter} • {cumulativeTotal} Total
          </span>
        </div>
        {selectedChain && selectedChain !== 'All' && (
          <div className="bg-purple-100 dark:bg-purple-900/20 px-3 py-1.5 rounded-full">
            <span className="font-medium text-purple-800 dark:text-purple-300">Chain: {selectedChain}</span>
          </div>
        )}
        {getSavedNewsCount() > 0 && (
          <div className="bg-green-100 dark:bg-green-900/20 px-3 py-1.5 rounded-full">
            <span className="font-medium text-green-800 dark:text-green-300">
              {getSavedNewsCount()}/{getSaveLimit()} Saved
            </span>
          </div>
        )}
        {loadedFromCache && (
          <div className="bg-amber-100 dark:bg-amber-900/20 px-3 py-1.5 rounded-full">
            <span className="font-medium text-amber-800 dark:text-amber-300">
              📦 Loaded from cache
            </span>
          </div>
        )}
        {success && (
          <div className="bg-green-100 dark:bg-green-900/20 px-3 py-1.5 rounded-full">
            <span className="font-medium text-green-800 dark:text-green-300">
              ✨ Updated
            </span>
          </div>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        {CATEGORIES.map(category => {
          const isActive = filter === category;
          return (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-3 py-1 text-xs rounded-full transition ${
                isActive
                  ? '!bg-indigo-600 !text-white font-semibold border-2 border-indigo-600'
                  : 'bg-slate-100 dark:bg-neutral-800 hover:bg-slate-200 dark:hover:bg-neutral-700 text-slate-700 dark:text-neutral-300 border-2 border-transparent'
              }`}
              style={isActive ? { backgroundColor: '#4f46e5 !important', color: 'white !important', border: '2px solid #4f46e5 !important' } : {}}
            >
              {category}
            </button>
          );
        })}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-8 gap-3">
          <div className="flex items-center gap-1" aria-label="Loading">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.2s]"></span>
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.1s]"></span>
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce"></span>
          </div>
          <span className="text-sm text-neutral-500">Fetching latest events...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-red-500">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Error fetching news
              </p>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* News List */}
      {!loading && !error && (
        <div className="space-y-4">
          {currentItems.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              {items.length === 0 ? (
                <p className="text-neutral-500 text-sm">No events available</p>
              ) : (
                <p className="text-neutral-500 text-sm">No events in &quot;{filter}&quot; category</p>
              )}
            </div>
          ) : (
            currentItems.map((item: NewsItem) => {
              const isNewItem = newItemIds.has(item.id);
              const isSaved = isNewsSaved(item.id);
              
              // Determine if this item matches monitored addresses for highlighting
              const relatedValues = [item.fromAddress, item.toAddress, item.transactionHash].filter(Boolean) as string[];
              const monitoredMatch = monitoredAddresses.length > 0 && relatedValues.some(val => monitoredAddresses.includes(val.toLowerCase()));
              const autoMatch = relatedValues.some(v => monitoredMeta[v.toLowerCase()]?.auto);
              return (
                <article
                  key={item.id}
                  className={`relative bg-white/70 dark:bg-neutral-900/70 rounded-lg border p-4 hover:shadow-md transition-shadow ${monitoredMatch ? (autoMatch ? 'border-emerald-500 dark:border-emerald-400 shadow-emerald-500/30' : 'border-emerald-400 dark:border-emerald-500 shadow-emerald-500/20') : 'border-neutral-200 dark:border-neutral-800'}`}
                >
                  {/* Save button top left */}
                  <button
                    onClick={() => {
                      try {
                        setSaveError(null);
                        if (isSaved) {
                          unsaveNews(item.id);
                        } else {
                          saveNews(item);
                        }
                      } catch (error) {
                        setSaveError(error instanceof Error ? error.message : 'Failed to save article');
                      }
                    }}
                    className={`absolute right-2 top-2 z-10 p-2 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition ${
                      isSaved
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                    }`}
                    title={isSaved ? 'Remove from saved' : 'Save for later'}
                    aria-label={isSaved ? 'Remove from saved' : 'Save for later'}
                  >
                    <svg className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </button>

                  {autoMatch && (
                    <div className="absolute -left-2 top-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-500 text-white shadow">
                        <svg viewBox="0 0 20 20" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 10l3 3 7-7" />
                        </svg>
                        Auto-Saved
                      </span>
                    </div>
                  )}
                  {/* New item indicator */}
                  {isNewItem && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  )}

                  <div className="pr-2">
                    {/* Main content row */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-200">
                        {item.category}
                      </span>
                      {item.chain && (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-200">
                          {item.chain}
                        </span>
                      )}
                      {autoMatch && (
                        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full bg-emerald-500/90 text-white">
                          Auto
                        </span>
                      )}
                      <time className="text-xs text-neutral-500">
                        {new Date(item.date).toLocaleString()}
                      </time>
                    </div>
                    <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                      {item.title}
                    </h3>
                      
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                        {item.content}
                      </p>

                      <details className="group mb-3 rounded-md bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700 px-3 py-2">
                        <summary className="cursor-pointer select-none text-xs font-medium text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                          <span className="transition group-open:rotate-90 inline-block">▶</span>
                          Detailed Event Context
                        </summary>
                        <div className="mt-2 space-y-3">
                          {item.verbose && (
                            <div className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400 whitespace-pre-line">
                              {item.verbose}
                            </div>
                          )}
                          <div className="overflow-x-auto">
                            <table className="w-full text-[11px] border-separate border-spacing-y-1">
                              <tbody className="align-top">
                                {[
                                  ['Event Type', item.eventType],
                                  ['Category', item.category],
                                  ['Chain', item.chain],
                                  ['Block Height', item.blockHeight?.toString()],
                                  ['Gas Used', item.gasUsed?.toString()],
                                  ['Value (REACT)', item.reactValue?.toLocaleString()],
                                  ['Transaction Hash', item.transactionHash],
                                  ['From Address', item.fromAddress],
                                  ['To Address', item.toAddress],
                                  ['Proposal ID', item.proposalId],
                                  ['ISO Timestamp', item.date],
                                  ['Local Time', new Date(item.date).toLocaleString()],
                                  ['ID', item.id],
                                ].filter(([,v]) => v !== undefined && v !== null && v !== '')
                                  .map(([label, value]) => (
                                    <tr key={label} className="group/row">
                                      <td className="py-1 pr-3 font-medium text-neutral-600 dark:text-neutral-300 whitespace-nowrap">{label}</td>
                                      <td className="py-1 text-neutral-700 dark:text-neutral-200 break-all">
                                        <div className="flex items-start gap-2">
                                          <span className="select-text">{value as string}</span>
                                          <button
                                            onClick={() => { try { navigator.clipboard.writeText(String(value)); } catch {} }}
                                            className="opacity-0 group-hover/row:opacity-100 transition p-1 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-600"
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
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </details>
                      
                      {/* Blockchain Verification Badge */}
                      <div className="mb-3">
                        <VerificationBadge
                          newsId={item.id}
                          title={item.title}
                          content={item.content}
                          category={item.category}
                        />
                      </div>
                      
                      <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
                        <span>By {item.author}</span>
                        {(item.transactionHash || item.fromAddress || item.proposalId) && (
                          <div className="flex flex-col items-end gap-0.5 sm:flex-row sm:items-center sm:gap-1.5 text-right">
                            {item.transactionHash && (
                              <span className="flex items-center gap-1 group/address">
                                <span className={`${monitoredAddresses.includes(item.transactionHash?.toLowerCase?.() ?? '') ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''} ${monitoredMeta[item.transactionHash?.toLowerCase?.() ?? '']?.auto ? 'underline decoration-emerald-500/70' : ''}`}>Tx: {item.transactionHash}</span>
                                <button
                                  type="button"
                                  onClick={() => { try { navigator.clipboard.writeText(item.transactionHash!); } catch {} }}
                                  className="p-1 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition"
                                  title="Copy transaction hash"
                                  aria-label="Copy transaction hash"
                                >
                                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                                  </svg>
                                </button>
                              </span>
                            )}
                            {item.transactionHash && item.fromAddress && <span className="hidden sm:inline">|</span>}
                            {item.fromAddress && (
                              <span className="flex items-center gap-1 group/address">
                                <span className={`${monitoredAddresses.includes(item.fromAddress?.toLowerCase?.() ?? '') ? 'text-emerald-600 dark:text-emerald-400 font-semibold' : ''} ${monitoredMeta[item.fromAddress?.toLowerCase?.() ?? '']?.auto ? 'underline decoration-emerald-500/70' : ''}`}>From: {item.fromAddress}</span>
                                <button
                                  type="button"
                                  onClick={() => { try { navigator.clipboard.writeText(item.fromAddress!); } catch {} }}
                                  className="p-1 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-200 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition"
                                  title="Copy from address"
                                  aria-label="Copy from address"
                                >
                                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
                                  </svg>
                                </button>
                              </span>
                            )}
                            {item.proposalId && (
                              <span className="flex items-center gap-1">
                                <span>Proposal: {item.proposalId}</span>
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                  </div>


                </article>
              );
            })
            )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between py-4">
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                Page {currentPage} of {totalPages} • {filteredItems.length} total events
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Previous
                </button>
                
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Save Error Display */}
      {saveError && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-red-500">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Save Error
              </p>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                {saveError}
              </p>
            </div>
            <button
              onClick={() => setSaveError(null)}
              className="ml-auto text-red-500 hover:text-red-700 text-sm"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Manual Refresh Button */}
      <div className="text-center">
        <button
          onClick={refreshNews}
          disabled={loading}
          className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Refreshing...' : 'Refresh News'}
        </button>
      </div>
    </div>
  );
}