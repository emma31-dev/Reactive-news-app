"use client";
import React, { useState } from 'react';
import { useAuth } from './AuthContext';

export const AdvancedMonitor: React.FC = () => {
  const { monitoredAddresses, addMonitoredAddress, removeMonitoredAddress, clearMonitoredAddresses, monitoredOnly, setMonitoredOnly } = useAuth();
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  const onAdd = () => {
    const raw = input.trim();
    if (!raw) return;
    addMonitoredAddress(raw);
    setInput("");
    flash(`Added ${raw.substring(0, 16)}${raw.length>16?'…':''}`);
  };

  const flash = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 2000);
  };

  const copy = (val: string) => {
    try { navigator.clipboard.writeText(val); flash('Copied'); } catch { flash('Copy failed'); }
  };

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium uppercase tracking-wide text-neutral-500">Advanced Address Monitor</h3>
        <label className="flex items-center gap-1 text-[11px] cursor-pointer select-none">
          <input
            type="checkbox"
            checked={monitoredOnly}
            onChange={e => setMonitoredOnly(e.target.checked)}
            className="accent-indigo-600"
          />
          <span className="text-neutral-500">Show Only Monitored</span>
        </label>
      </div>
      <p className="text-xs text-neutral-400">Add wallet addresses or transaction hashes to highlight (and optionally filter) matching events.</p>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="0x... address or tx hash"
          className="flex-1 px-3 py-2 text-xs rounded-md bg-white/60 dark:bg-neutral-900/40 border border-neutral-300 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="button"
          onClick={onAdd}
          disabled={!input.trim()}
          className="px-3 py-2 text-xs rounded-md bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >Add</button>
      </div>
      {feedback && <div className="text-[11px] text-emerald-600">{feedback}</div>}
      {monitoredAddresses.length === 0 ? (
        <div className="text-xs text-neutral-500">No monitored addresses yet.</div>
      ) : (
        <div className="space-y-2">
          <ul className="space-y-1 max-h-40 overflow-y-auto pr-1">
            {monitoredAddresses.map(addr => (
              <li key={addr} className="group flex items-center gap-2 text-[11px] px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
                <span className="flex-1 break-all font-mono text-[10px]">{addr}</span>
                <button
                  onClick={() => copy(addr)}
                  className="opacity-0 group-hover:opacity-100 transition text-[10px] px-1.5 py-0.5 rounded bg-neutral-300 dark:bg-neutral-600 hover:bg-neutral-400 dark:hover:bg-neutral-500"
                  title="Copy"
                >Copy</button>
                <button
                  onClick={() => removeMonitoredAddress(addr)}
                  className="opacity-0 group-hover:opacity-100 transition text-[10px] px-1.5 py-0.5 rounded bg-red-500 text-white hover:bg-red-400"
                  title="Remove"
                >✕</button>
              </li>
            ))}
          </ul>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => { clearMonitoredAddresses(); flash('Cleared'); }}
              className="text-[10px] px-2 py-1 rounded bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600"
              type="button"
            >Clear All</button>
          </div>
        </div>
      )}
    </section>
  );
};
