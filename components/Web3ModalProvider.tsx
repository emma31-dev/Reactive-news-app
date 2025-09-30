"use client";
import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';

// Web3ModalProvider: lazy-initializes @web3modal/react when NEXT_PUBLIC_WM_PROJECT_ID is set.
// Provides an open() helper through context so UI components (like WalletConnectButton)
// can open the modal without importing the modal library directly. If the env var
// is not set or the packages are not installed, this provider is a no-op and children
// are rendered as-is.

type Web3ModalContextType = {
  available: boolean;
  open: () => void;
};

const Web3ModalContext = createContext<Web3ModalContextType>({ available: false, open: () => {} });

export function useWeb3Modal() {
  return useContext(Web3ModalContext);
}

export function Web3ModalProvider({ children }: { children: React.ReactNode }) {
  const projectId = process.env.NEXT_PUBLIC_WM_PROJECT_ID || '';
  const [available, setAvailable] = useState<boolean>(false);
  const [openFn, setOpenFn] = useState<() => void>(() => () => {});

  // Try to lazily import the modal packages only when projectId is provided.
  useEffect(() => {
    if (!projectId) {
      setAvailable(false);
      return;
    }

    let mounted = true;

    (async () => {
      try {
        // dynamic import so build won't fail if package is missing
        const mod = await import('@web3modal/react');

        if (!mounted) return;

        // Resolve the Web3Modal component from the module (support named/default)
        const Web3ModalComp = (mod && (mod.Web3Modal || (mod as any).default)) as any;

        if (!Web3ModalComp) {
          throw new Error('Web3Modal component not found in @web3modal/react');
        }

        // Create a small wrapper to open a modal programmatically. We lazily
        // mount a tiny React tree that renders the Web3Modal component. This
        // keeps the integration minimal and avoids changing other providers.
        const open = () => {
          try {
            const container = document.createElement('div');
            document.body.appendChild(container);

            // Use React 18 createRoot to mount the modal dynamically
            import('react-dom/client').then(({ createRoot }) => {
              try {
                const el = React.createElement(Web3ModalComp, { projectId });
                const root = createRoot(container);
                root.render(el);
              } catch (err) {
                console.warn('Failed to render Web3Modal', err);
              }
            }).catch((err) => {
              console.warn('Failed to load react-dom/client for Web3Modal', err);
            });
          } catch (e) {
            console.warn('Failed to open Web3Modal programmatically', e);
          }
        };

        setOpenFn(() => open);
        setAvailable(true);
      } catch (err) {
        console.warn('Web3Modal packages not available or failed to load:', err);
        setAvailable(false);
      }
    })();

    return () => { mounted = false; };
  }, [projectId]);

  const value = useMemo(() => ({ available, open: openFn }), [available, openFn]);

  return (
    <Web3ModalContext.Provider value={value}>
      {children}
    </Web3ModalContext.Provider>
  );
}
