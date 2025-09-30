"use client";
import React from 'react';
import dynamic from 'next/dynamic';

const AdvancedMonitor = dynamic(() => import('./AdvancedMonitor').then(mod => mod.AdvancedMonitor), { ssr: false });

interface Props {
  hideHeader?: boolean;
}

export default function ClientOnlyAdvancedMonitor({ hideHeader }: Props) {
  return <AdvancedMonitor hideHeader={hideHeader} />;
}
