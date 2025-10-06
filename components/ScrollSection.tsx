"use client";

import React, { useEffect, useRef, ReactNode } from 'react';

export default function ScrollSection({ children, className = '', direction = 'left' }: { children: ReactNode; className?: string; direction?: 'left' | 'right' }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            target.classList.add('opacity-100', 'translate-x-0');
            target.classList.remove('opacity-0', direction === 'left' ? '-translate-x-12' : 'translate-x-12');
            obs.unobserve(target);
          }
        });
      },
      { threshold: 0.2 }
    );

    obs.observe(el);

    return () => obs.disconnect();
  }, [direction]);

  return (
    <div ref={ref} className={`scroll-section opacity-0 ${direction === 'left' ? '-translate-x-12' : 'translate-x-12'} transition-all duration-700 ease-out ${className}`}>
      {children}
    </div>
  );
}
