"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, useRef, ReactNode } from 'react';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  category: string;
  transactionHash?: string;
  fromAddress?: string;
  toAddress?: string;
  proposalId?: string;
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
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export function NewsProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loadedFromCache, setLoadedFromCache] = useState(false);
  const [newItemIds, setNewItemIds] = useState<Set<string>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
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
      
      // Smart merge: combine cached items with server data
      setItems(currentItems => {
        
        // Add new items from server that aren't in cache
        const cachedItemIds = new Set(currentItems.map(item => item.id));
        const newServerItems = sortedServerData.filter(item => !cachedItemIds.has(item.id));
        
        if (newServerItems.length === 0) {
          return currentItems;
        }
        
        // Sort current items by date (newest first)
        const sortedCurrent = [...currentItems].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        // Store new items temporarily and calculate capacity management
        const temporaryNewItems = [...newServerItems];
        const totalAfterMerge = sortedCurrent.length + temporaryNewItems.length;
        const itemsToDelete = Math.max(0, totalAfterMerge - 89);
        
        // Delete oldest items first, then add new items
        const cleanedArray = itemsToDelete > 0 
          ? sortedCurrent.slice(0, sortedCurrent.length - itemsToDelete)
          : [...sortedCurrent];
          
        const finalMergedItems = [...temporaryNewItems, ...cleanedArray];
        
        const mergedItems = finalMergedItems;
        
        // Only update if there are actual changes
        const hasChanges = currentItems.length !== mergedItems.length || 
                          JSON.stringify(currentItems.map(i => i.id)) !== JSON.stringify(mergedItems.map(i => i.id));
        
        if (hasChanges) {
          setSuccess(true);
          setLoadedFromCache(false);
          setTimeout(() => setSuccess(false), 2000);
          
          // Track new item IDs for blue circle indicators
          if (newServerItems.length > 0) {
            setNewItemIds(prevIds => {
              const updatedIds = new Set(prevIds);
              newServerItems.forEach(item => updatedIds.add(item.id));
              return updatedIds;
            });
            
            // Auto-remove new indicators after 30 seconds
            setTimeout(() => {
              setNewItemIds(prevIds => {
                const updatedIds = new Set(prevIds);
                newServerItems.forEach(item => updatedIds.delete(item.id));
                return updatedIds;
              });
            }, 30000);
          }
          
          // Save merged data to localStorage
          localStorage.setItem('newsCache', JSON.stringify(mergedItems));
          
          return mergedItems;
        } else {
          return currentItems;
        }
      });
    } catch (e: any) {
      // Don't log errors for aborted requests
      if (e.name === 'AbortError') {
        return;
      }
      
      console.error('Error fetching news:', e.message);
      setError(e.message || 'Failed to fetch');
    } finally {
      // Only set loading false if request wasn't aborted
      if (!abortControllerRef.current?.signal.aborted) {
        setLoading(false);
      }
    }
  }, []);

  // Keep a stable reference to fetchNews
  fetchNewsRef.current = fetchNews;

  // Initial fetch on mount
  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const refreshNews = useCallback(async () => {
    await fetchNews();
  }, [fetchNews]);

  // Cache management and polling
  useEffect(() => {
    
    const currentLoginTime = Date.now().toString();
    const lastLoginTime = localStorage.getItem('lastLoginTime');
    
    try {
      // Load cached news if available
      const cachedNews = localStorage.getItem('newsCache');
      if (cachedNews) {
        const parsedCache = JSON.parse(cachedNews);
        const validCategories = ['Whale Watch', 'Governance', 'Security', 'Market'];
        const isValidCache = Array.isArray(parsedCache) && parsedCache.every(item => 
          item && 
          typeof item.category === 'string' && 
          validCategories.includes(item.category)
        );
        
        if (isValidCache) {
          setItems(parsedCache);
          setLoadedFromCache(true);
          
          // Show cache indicator briefly
          setTimeout(() => setLoadedFromCache(false), 3000);
        }
      }
      
      // Update login time
      localStorage.setItem('lastLoginTime', currentLoginTime);
    } catch (e) {
      console.error('Error loading cache:', e);
    }

    // Set up polling every 30 seconds
    intervalRef.current = setInterval(() => {
      if (fetchNewsRef.current) {
        fetchNewsRef.current();
      }
    }, 30000);
    
    return () => {
      // Clean up interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      
      // Cancel any pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []); // No dependencies needed since we use refs

  const value: NewsContextType = {
    items,
    loading,
    error,
    success,
    loadedFromCache,
    newItemIds,
    fetchNews,
    refreshNews
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