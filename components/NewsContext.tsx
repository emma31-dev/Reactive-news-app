"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';

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
  verbose?: string; // Rich descriptive context
  eventType?: string;
  blockHeight?: number;
  gasUsed?: number;
  reactValue?: number;
}

interface NewsContextType {
  items: NewsItem[];
  loading: boolean;
  error: string | null;
  success: boolean;
  loadedFromCache: boolean;
  newItemIds: Set<string>;
  fetchNews: () => Promise<void>;
  refreshNews: () => Promise<void>;
  clearCache: () => void;
  reloadCache: () => void;
  cumulativeTotal: number;
  autoRefresh: boolean;
  pauseAutoRefresh: () => void;
  resumeAutoRefresh: () => void;
  selectedChain: string | 'All';
  setSelectedChain: (chain: string | 'All') => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export function NewsProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loadedFromCache, setLoadedFromCache] = useState(false);
  const [newItemIds, setNewItemIds] = useState<Set<string>>(new Set());
  const [cumulativeTotal, setCumulativeTotal] = useState<number>(() => {
    if (typeof window === 'undefined') return 0;
    try {
      const raw = localStorage.getItem('newsCumulativeTotal');
      return raw ? parseInt(raw, 10) || 0 : 0;
    } catch {
      return 0;
    }
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedChain, setSelectedChain] = useState<string | 'All'>('All');
  const abortControllerRef = useRef<AbortController | null>(null);
  const fetchNewsRef = useRef<(() => Promise<void>) | null>(null);

  const fetchNews = useCallback(async () => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;
    
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/news', { 
        cache: 'no-store',
        signal // Add abort signal to request
      });
      
      if (signal.aborted) {
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }
      const data: NewsItem[] = await response.json();
      const sortedServerData = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setItems(currentItems => {
        // Build a map to deduplicate by id, preferring newest timestamp
        const map = new Map<string, NewsItem>();
        // Insert existing items first
        for (const it of currentItems) {
          map.set(it.id, it);
        }
        // Track which ones are newly added
        const newlyAdded: NewsItem[] = [];
        for (const it of sortedServerData) {
          if (!map.has(it.id)) {
            newlyAdded.push(it);
          } else {
            // Optionally replace if server version is newer
            const existing = map.get(it.id)!;
            if (new Date(it.date).getTime() > new Date(existing.date).getTime()) {
              map.set(it.id, it);
            }
            continue;
          }
          map.set(it.id, it);
        }

        // Compose merged array and sort descending by date
  let merged = Array.from(map.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  // Cap at 500 entries
  if (merged.length > 500) merged = merged.slice(0, 500);
        const hasChanges = currentItems.length !== merged.length ||
          currentItems.some((v, idx) => merged[idx]?.id !== v.id);

        if (!hasChanges) {
          return currentItems; // nothing meaningful changed
        }

        // Success state & new item tracking
        if (newlyAdded.length > 0) {
          setSuccess(true);
          setLoadedFromCache(false);
          setTimeout(() => setSuccess(false), 2000);
          setNewItemIds(prev => {
            const next = new Set(prev);
            newlyAdded.forEach(n => next.add(n.id));
            return next;
          });
          setTimeout(() => {
            setNewItemIds(prev => {
              const next = new Set(prev);
              newlyAdded.forEach(n => next.delete(n.id));
              return next;
            });
          }, 30000);
          // Update cumulative total counter
          setCumulativeTotal(prev => {
            const next = prev + newlyAdded.length;
            try { localStorage.setItem('newsCumulativeTotal', String(next)); } catch {}
            return next;
          });
        }

        localStorage.setItem('newsCache', JSON.stringify(merged));
        return merged;
      });
    } catch (e: any) {
      // Don't log errors for aborted requests
      if (e.name === 'AbortError') {
        return;
      }
      
      console.error('Error fetching news:', e.message);
      setError(e.message || 'Failed to fetch');
      // Fallback: attempt to merge cache with current in-memory items
      try {
        const cached = localStorage.getItem('newsCache');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setItems(prev => {
              const map = new Map<string, NewsItem>();
              prev.forEach(i => map.set(i.id, i));
              parsed.forEach((i: NewsItem) => { if (!map.has(i.id)) map.set(i.id, i); });
              const merged = Array.from(map.values()).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 500);
              setLoadedFromCache(true);
              return merged;
            });
          }
        }
      } catch (fallbackErr) {
        console.warn('Cache fallback merge failed:', fallbackErr);
      }
    } finally {
      // Only set loading false if request wasn't aborted
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  // Keep a stable reference to fetchNews
  fetchNewsRef.current = fetchNews;

  // Always attempt cache hydration before first fetch
  useEffect(() => {
    try {
      const cached = localStorage.getItem('newsCache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setItems(parsed);
          setLoadedFromCache(true);
          setCumulativeTotal(prev => {
            if (prev === 0) {
              try { localStorage.setItem('newsCumulativeTotal', String(parsed.length)); } catch {}
              return parsed.length;
            }
            return prev;
          });
        }
      }
    } catch (e) {
      console.warn('Cache hydration failed:', e);
    }
    fetchNews();
  }, [fetchNews]);

  const refreshNews = useCallback(async () => {
    await fetchNews();
  }, [fetchNews]);

  // Polling only (cache bootstrap handled above) - 10s cadence to match backend interval
  useEffect(() => {
    if (!autoRefresh) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    intervalRef.current = setInterval(() => {
      if (fetchNewsRef.current) {
        fetchNewsRef.current();
      }
    }, 10000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [autoRefresh]);

  const pauseAutoRefresh = useCallback(() => setAutoRefresh(false), []);
  const resumeAutoRefresh = useCallback(() => {
    setAutoRefresh(true);
    // Kick an immediate fetch so user sees fresh data right after resuming
    if (fetchNewsRef.current) fetchNewsRef.current();
  }, []);

  const clearCache = useCallback(() => {
    try {
      localStorage.removeItem('newsCache');
      setLoadedFromCache(false);
    } catch (e) {
      console.warn('Failed to clear cache:', e);
    }
  }, []);

  const reloadCache = useCallback(() => {
    try {
      const cached = localStorage.getItem('newsCache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          setItems(prev => {
            const map = new Map<string, NewsItem>();
            parsed.forEach((i: NewsItem) => map.set(i.id, i));
            // keep any in-memory that aren't in cache yet (shouldn't happen but safe)
            prev.forEach(i => { if (!map.has(i.id)) map.set(i.id, i); });
            const merged = Array.from(map.values()).sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime()).slice(0,500);
            return merged;
          });
          setLoadedFromCache(true);
          setCumulativeTotal(prev => {
            if (prev === 0) {
              try { localStorage.setItem('newsCumulativeTotal', String(parsed.length)); } catch {}
              return parsed.length;
            }
            return prev;
          });
        }
      }
    } catch (e) {
      console.warn('Reload cache failed:', e);
    }
  }, []);

  // Sync across tabs / other auth sessions
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === 'newsCache') {
        reloadCache();
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [reloadCache]);

  const value: NewsContextType = {
    items,
    loading,
    error,
    success,
    loadedFromCache,
    newItemIds,
    fetchNews,
    refreshNews,
    clearCache,
    reloadCache,
    cumulativeTotal,
    autoRefresh,
    pauseAutoRefresh,
    resumeAutoRefresh,
    selectedChain,
    setSelectedChain
  };

  return (
    <NewsContext.Provider value={value}>
      {children}
    </NewsContext.Provider>
  );
}

export function useNews() {
  const context = useContext(NewsContext);
  if (context === undefined) {
    throw new Error('useNews must be used within a NewsProvider');
  }
  return context;
}