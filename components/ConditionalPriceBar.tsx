"use client";
import React from 'react';
import { usePathname } from 'next/navigation';
import ReactPriceBar from './ReactPriceBar';

export default function ConditionalPriceBar() {
  const pathname = usePathname();
  // Hide the global price bar on the /chart page
  if (pathname === '/chart' || pathname?.startsWith('/chart/')) return null;
  return <ReactPriceBar />;
}
