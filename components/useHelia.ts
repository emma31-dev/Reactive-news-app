"use client";

import { useState, useEffect } from 'react';

// This hook dynamically imports Helia and its JSON module, ensuring it only runs on the client.
export function useHelia() {
  const [helia, setHelia] = useState<any | null>(null);
  const [json, setJson] = useState<any | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function initHelia() {
      if (helia) return; // Already initialized

      try {
        // Dynamically import Helia and its dependencies
        const { createHelia } = await import('helia');
        const { json: heliaJson } = await import('@helia/json');

        // Create and set the Helia instance
        const heliaNode = await createHelia();
        const j = heliaJson(heliaNode);

        if (!mounted) return;
        setHelia(heliaNode);
        setJson(j);
      } catch (e: any) {
        console.error('Failed to initialize Helia:', e);
        if (!mounted) return;
        setError(e);
      }
    }

    initHelia();
    return () => { mounted = false; };
  }, [helia]); // Rerun if helia instance changes

  return { helia, json, error, initializing: !helia && !error };
}
