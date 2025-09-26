"use client";
import React, { useMemo } from 'react';
import { useNews } from './NewsContext';

interface ChainSelectorProps { showTitle?: boolean }

export const ChainSelector: React.FC<ChainSelectorProps> = ({ showTitle = true }) => {
  const { items, selectedChain, setSelectedChain } = useNews();
  // Derive unique chains from items
  const chains = useMemo(() => {
    const set = new Set<string>();
    items.forEach(i => { if (i.chain) set.add(i.chain); });
    return Array.from(set).sort();
  }, [items]);

  if (chains.length === 0) {
    return (
      <div className="text-xs text-neutral-500">No chain data yet.</div>
    );
  }

  return (
    <div className="space-y-2">
      {showTitle && (
        <h4 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Chain Filter</h4>
      )}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedChain('All')}
          className={`px-3 py-1 text-xs rounded-full border transition ${selectedChain === 'All' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'}`}
        >All</button>
        {chains.map(c => (
          <button
            key={c}
            onClick={() => setSelectedChain(c)}
            className={`px-3 py-1 text-xs rounded-full border transition ${selectedChain === c ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300'}`}
          >{c}</button>
        ))}
      </div>
    </div>
  );
};
