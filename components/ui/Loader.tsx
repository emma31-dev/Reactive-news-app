"use client";
import React, { useEffect, useState } from 'react';

// We defer importing 'ldrs' until client runtime to avoid SSR bundling issues

interface LoaderProps {
  size?: number;
  color?: string;
  speed?: number;
  stroke?: number;
  themeColor?: 'auto' | 'foreground' | 'accent';
  className?: string;
  label?: string; // Visually shown label
  ariaLabel?: string; // For screen readers only
  variant?: 'auto' | 'waveform' | 'line';
}

export const Loader: React.FC<LoaderProps> = ({
  size = 40,
  stroke = 3,
  color,
  speed = 1,
  themeColor = 'auto',
  className = '',
  label,
  ariaLabel = 'Loading',
  variant = 'auto'
}) => {
  // Determine effective color: explicit color prop > themed variable
  let effectiveColor: string;
  if (color) {
    effectiveColor = color;
  } else if (themeColor === 'accent') {
    effectiveColor = 'var(--accent)';
  } else if (themeColor === 'foreground' || themeColor === 'auto') {
    effectiveColor = 'var(--foreground)';
  } else {
    effectiveColor = 'currentColor';
  }

  const [tag, setTag] = useState<string>('');
  const [ready, setReady] = useState<boolean>(() => typeof window !== 'undefined' && (!!customElements.get('l-waveform') || !!customElements.get('l-line-spinner')));

  useEffect(() => {
    if (ready && tag) return;
    let cancelled = false;
    (async () => {
      try {
        const mod: any = await import('ldrs');
        const wantWave = variant === 'waveform' || variant === 'auto';
        const wantLine = variant === 'line' || variant === 'auto';

        const ensure = async (element: 'l-waveform' | 'l-line-spinner') => {
          if (customElements.get(element)) return true;
          try {
            if (element === 'l-waveform') {
              if (mod?.waveform?.register) mod.waveform.register();
              else if (mod?.register?.waveform) mod.register.waveform();
              else if (typeof mod?.waveform === 'function') mod.waveform();
            } else if (element === 'l-line-spinner') {
              if (mod?.lineSpinner?.register) mod.lineSpinner.register();
              else if (mod?.register?.lineSpinner) mod.register.lineSpinner();
              else if (typeof mod?.lineSpinner === 'function') mod.lineSpinner();
            }
          } catch { /* ignore */ }
          return !!customElements.get(element);
        };

        let picked = '';
        if (wantWave) {
          const ok = await ensure('l-waveform');
          if (ok) picked = 'l-waveform';
        }
        if (!picked && wantLine) {
          const ok2 = await ensure('l-line-spinner');
            if (ok2) picked = 'l-line-spinner';
        }
        if (!cancelled && picked) {
          setTag(picked);
          setReady(true);
        } else if (!cancelled) {
          // Leave ready false -> fallback SVG
        }
      } catch {
        // ignore -> fallback
      }
    })();
    return () => { cancelled = true; };
  }, [variant, ready, tag]);

  const duration = `${Math.max(0.2, 1 / speed)}s`;

  const renderFallback = () => (
    <svg width={size} height={size} viewBox="0 0 50 50" role="img" aria-label={ariaLabel} className="animate-[spin_1s_linear_infinite]" style={{ color: effectiveColor }}>
      <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeDasharray="31.4 31.4" strokeDashoffset="0">
        <animate attributeName="stroke-dashoffset" values="0;31.4" dur={duration} repeatCount="indefinite" />
        <animate attributeName="opacity" values="1;0.6;1" dur={duration} repeatCount="indefinite" />
      </circle>
    </svg>
  );

  const elementProps: any = { size, stroke, speed, color: effectiveColor };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`.trim()} role="status" aria-live="polite" aria-busy="true" aria-label={!label ? ariaLabel : undefined}>
      {ready && tag === 'l-waveform' && (
        // @ts-ignore
        <l-waveform {...elementProps} />
      )}
      {ready && tag === 'l-line-spinner' && (
        // @ts-ignore
        <l-line-spinner {...elementProps} />
      )}
      {!ready && renderFallback()}
      {label && <span className="mt-2 text-xs text-neutral-400">{label}</span>}
    </div>
  );
};

export default Loader;
