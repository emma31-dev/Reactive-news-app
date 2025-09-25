"use client";
import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Wraps route content and provides a 250ms fade / slight slide transition
 * on pathname changes. Uses CSS classes defined in globals.css.
 */
export const PageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const [displayed, setDisplayed] = useState(children);
  const [stage, setStage] = useState<'enter' | 'enter-active'>('enter');
  const prevPath = useRef(pathname);

  useEffect(() => {
    // If path changed, trigger reflow and animate
    if (pathname !== prevPath.current) {
      prevPath.current = pathname;
      setStage('enter');
      setDisplayed(children);
      // Next frame -> activate transition
      const id = requestAnimationFrame(() => setStage('enter-active'));
      return () => cancelAnimationFrame(id);
    } else {
      // Initial mount
      const id = requestAnimationFrame(() => setStage('enter-active'));
      return () => cancelAnimationFrame(id);
    }
  }, [pathname, children]);

  return (
    <div className={`page-transition-${stage}`}>{displayed}</div>
  );
};

export default PageTransition;
