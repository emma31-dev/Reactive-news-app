"use client";
import React, { useState } from 'react';
import { useAuth } from './AuthContext';

interface AdvancedMonitorProps {
  hideHeader?: boolean; // when true, suppress internal heading/description (parent supplies its own)
}

export const AdvancedMonitor: React.FC<AdvancedMonitorProps> = ({ hideHeader = false }) => {
  const { monitoredAddresses, addMonitoredAddress, removeMonitoredAddress, clearMonitoredAddresses, monitoredOnly, setMonitoredOnly, monitoredMeta, toggleAddressAutoSave } = useAuth();
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
      {!hideHeader && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium uppercase tracking-wide text-neutral-500">Advanced Address Monitor</h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMonitoredOnly(!monitoredOnly)}
                className={`relative inline-flex items-center h-5 w-10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/40 border border-neutral-300 dark:border-neutral-700 ${monitoredOnly ? 'bg-indigo-600' : 'bg-neutral-300 dark:bg-neutral-700'}`}
                aria-pressed={monitoredOnly}
                title="Show Only Monitored"
                style={{ padding: 0 }}
              >
                <span className="sr-only">Show Only Monitored</span>
                <span
                  className={`absolute top-1/2 -translate-y-1/2 h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${monitoredOnly ? 'translate-x-5' : 'translate-x-1'}`}
                  style={{ left: 0 }}
                />
              </button>
              <span className="text-neutral-500 text-[11px] select-none">Show Only Monitored</span>
            </div>
          </div>
          <p className="text-xs text-neutral-400">Add wallet addresses or transaction hashes to highlight (and optionally filter) matching events.</p>
        </>
      )}
      {hideHeader && (
        <div className="flex items-center justify-end -mt-1">
          <div className="flex items-center gap-2 justify-end">
            <button
              type="button"
              onClick={() => setMonitoredOnly(!monitoredOnly)}
              className={`relative inline-flex items-center h-5 w-10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/40 border border-neutral-300 dark:border-neutral-700 ${monitoredOnly ? 'bg-indigo-600' : 'bg-neutral-300 dark:bg-neutral-700'}`}
              aria-pressed={monitoredOnly}
              title="Show Only Monitored"
            >
              <span className="sr-only">Show Only Monitored</span>
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${monitoredOnly ? 'translate-x-5' : 'translate-x-1'}`}
              />
            </button>
            <span className="text-neutral-500 text-[11px] select-none">Show Only Monitored</span>
          </div>
        </div>
      )}
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
          {/* Added max-h-56 for taller scroll, overflow-y-auto, and border for clarity */}
          <ul className="space-y-1 max-h-56 overflow-y-auto pr-1 border border-neutral-200 dark:border-neutral-700 rounded-md bg-white/60 dark:bg-neutral-900/40">
            {monitoredAddresses.map(addr => {
              const addrKey = addr.toLowerCase(); // Ensure consistent lookup
              const isAutoActive = monitoredMeta[addrKey]?.auto;
              return (
                <li key={addr} className={`group flex items-center gap-2 text-[11px] px-2 py-1 rounded border bg-neutral-100 dark:bg-neutral-800/60 ${isAutoActive ? 'border-indigo-400 dark:border-indigo-500 ring-1 ring-indigo-300/40 dark:ring-indigo-500/30' : 'border-neutral-200 dark:border-neutral-700'}`}>
                  <span className="flex items-center gap-1 flex-1 break-all font-mono text-[10px]">
                    {isAutoActive && (
                      <svg viewBox="0 0 20 20" className="w-3 h-3 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 10l3 3 7-7" />
                      </svg>
                    )}
                    {addr}
                  </span>
                  <button
                    onClick={() => {
                      toggleAddressAutoSave(addr);
                    }}
                    className={`auto-toggle-btn text-[10px] px-2 py-0.5 rounded font-semibold tracking-wide uppercase transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 relative border ${isAutoActive 
                      ? 'border-indigo-500 scale-[1.03]' 
                      : 'border-neutral-400 dark:border-neutral-600'} ${isAutoActive ? 'is-active' : ''}`}
                    aria-pressed={isAutoActive ? 'true' : 'false'}
                    data-active={isAutoActive ? 'true' : 'false'}
                    style={isAutoActive ? {
                      backgroundColor: '#4338CA', /* indigo-700 */
                      color: '#FFFFFF',
                      boxShadow: '0 0 0 2px rgba(99,102,241,0.55), 0 2px 6px -1px rgba(0,0,0,0.35)'
                    } : {
                      backgroundColor: '#D1D5DB', /* neutral-300 */
                      color: '#1F2937', /* neutral-800 */
                    }}
                    title={isAutoActive ? 'Disable auto-save for this entry' : 'Enable auto-save for this entry'}
                  >
                    {isAutoActive ? 'AUTO ON' : 'AUTO'}
                  </button>
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
              );
            })}
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
