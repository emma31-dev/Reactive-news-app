"use client";

import React, { useEffect, useRef, ReactNode } from 'react';

export default function ScrollSection({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            // add visible utilities and remove hidden ones
            target.classList.add('opacity-100', 'translate-y-0');
            target.classList.remove('opacity-0', 'translate-y-6');
            obs.unobserve(target);
          }
        });
      },
      { threshold: 0.2 }
    );

    obs.observe(el);

    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className={`scroll-section opacity-0 translate-y-6 transition-all duration-700 ease-out ${className}`}>
      {children}
    </div>
  );
}
