"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

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

interface SavedNewsContextType {
  savedNews: NewsItem[];
  saveNews: (newsItem: NewsItem) => void;
  unsaveNews: (newsId: string) => void;
  isNewsSaved: (newsId: string) => boolean;
  getSavedNewsCount: () => number;
  getSaveLimit: () => number;
  canSaveMore: () => boolean;
}

const SavedNewsContext = createContext<SavedNewsContextType | undefined>(undefined);

export function SavedNewsProvider({ children }: { children: React.ReactNode }) {
  const [savedNews, setSavedNews] = useState<NewsItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved news from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('savedNews');
      if (saved) {
        const parsedSaved = JSON.parse(saved);
        if (Array.isArray(parsedSaved)) {
          setSavedNews(parsedSaved);
        }
      }
    } catch (error) {
      console.error('Error loading saved news from localStorage:', error);
      localStorage.removeItem('savedNews'); // Clear corrupted data
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever savedNews changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem('savedNews', JSON.stringify(savedNews));
      } catch (error) {
        console.error('Error saving news to localStorage:', error);
      }
    }
  }, [savedNews, isLoaded]);

  const saveNews = (newsItem: NewsItem) => {
    setSavedNews(prev => {
      // Don't add duplicates
      if (prev.some(item => item.id === newsItem.id)) {
        return prev;
      }
      
      // Set saved items limit to 50 for all users
      // In a real app, this could be adjusted based on user subscription status
      const maxSavedItems = 50;
      
      // Check if adding would exceed the limit
      if (prev.length >= maxSavedItems) {
        // Remove oldest item when limit reached (smart capacity management)
        const newSaved = [newsItem, ...prev.slice(0, maxSavedItems - 1)];
        return newSaved;
      }
      
      // Add to beginning of array (most recent first)
      return [newsItem, ...prev];
    });
  };

  const unsaveNews = (newsId: string) => {
    setSavedNews(prev => prev.filter(item => item.id !== newsId));
  };

  const isNewsSaved = (newsId: string) => {
    return savedNews.some(item => item.id === newsId);
  };

  const getSavedNewsCount = () => {
    return savedNews.length;
  };

  const getSaveLimit = () => {
    return 50; // Maximum 50 saved items for all users
  };

  const canSaveMore = () => {
    return savedNews.length < getSaveLimit();
  };

  const value: SavedNewsContextType = {
    savedNews,
    saveNews,
    unsaveNews,
    isNewsSaved,
    getSavedNewsCount,
    getSaveLimit,
    canSaveMore,
  };

  return (
    <SavedNewsContext.Provider value={value}>
      {children}
    </SavedNewsContext.Provider>
  );
}

export function useSavedNews() {
  const context = useContext(SavedNewsContext);
  if (context === undefined) {
    throw new Error('useSavedNews must be used within a SavedNewsProvider');
  }
  return context;
}