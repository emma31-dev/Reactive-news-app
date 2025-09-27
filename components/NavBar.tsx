"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { useAuth } from './AuthContext';
import WalletConnectButton from './WalletConnectButton';
import { usePathname } from 'next/navigation';

// Helper function for link classes
const getLinkClassName = (pathname: string, href: string) => 
  `flex items-center gap-2 px-3 py-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800/70 transition text-sm ${pathname === href ? 'text-blue-500 font-bold' : 'text-neutral-700 dark:text-neutral-200'}`;

// Simple inline icons to avoid asset loading issues for critical UI controls
function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6H20" />
      <path d="M4 12H20" />
      <path d="M4 18H20" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 6L18 18" />
      <path d="M6 18L18 6" />
    </svg>
  );
}

// --- MobileDrawer Component ---
function MobileDrawer({ open, setOpen, user, logout, toggleTheme, dark, pathname }: any) {
  const linkCls = (href: string) => getLinkClassName(pathname, href);
  
  // Prevent rendering if essential props are missing
  if (!setOpen || typeof toggleTheme !== 'function') {
    return null;
  }

  return (
    <div className={`fixed inset-0 z-40 transition-all duration-300 ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
      {/* Overlay */}
      <div 
        onClick={() => setOpen(false)} 
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity ${open ? 'opacity-100' : 'opacity-0'}`} 
      />
      {/* Drawer Content */}
      <div className={`absolute top-0 right-0 h-full w-full max-w-xs bg-white dark:bg-neutral-900 transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 flex items-center justify-between border-b dark:border-neutral-800">
          <span className="font-semibold text-indigo-400">Menu</span>
          <button onClick={() => setOpen(false)} className="p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800/70" aria-label="Close menu">
            <CloseIcon className="w-5 h-5 text-neutral-700 dark:text-neutral-200" />
          </button>
        </div>
        <nav className="p-2 flex flex-col">
          <button onClick={toggleTheme} className={linkCls('/theme')}>
            {dark ? 'Dark mode: ON' : 'Dark mode: OFF'}
          </button>
          <div className="my-2 border-t border-neutral-200 dark:border-neutral-800" />
          <div className="flex flex-col gap-1">
            {user && <a onClick={() => setOpen(false)} className={linkCls('/')} href="/">Home</a>}
            {user && <a onClick={() => setOpen(false)} className={linkCls('/profile')} href="/profile">Profile</a>}
            {user && <a onClick={() => setOpen(false)} className={linkCls('/review')} href="/review">Review</a>}
            <a onClick={() => setOpen(false)} className={linkCls('/learn')} href="/learn">Learn</a>
            <a onClick={() => setOpen(false)} className={linkCls('/about')} href="/about">About</a>
            <a onClick={() => setOpen(false)} className={linkCls('/pricing')} href="/pricing">Pricing</a>
            {!user && <a onClick={() => setOpen(false)} className={linkCls('/login')} href="/login">Login</a>}
            {!user && <a onClick={() => setOpen(false)} className={linkCls('/signup')} href="/signup">Sign Up</a>}
            {user && (
              <>
                <div className="my-2 border-t border-neutral-200 dark:border-neutral-800" />
                <button onClick={() => { logout(); setOpen(false); }} className={`${linkCls('/logout')} w-full`}><Image src="/logout.svg" alt="Logout" width={16} height={16} className="dark:invert" />Logout</button>
              </>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}

// --- NavLinks Component for Desktop ---
function NavLinks({ user, logout, toggleTheme, dark, pathname }: any) {
  const linkCls = (href: string) => getLinkClassName(pathname, href);

  return (
    <nav className="flex items-center gap-1">
      <button onClick={toggleTheme} className="flex items-center gap-1 px-3 py-2 rounded text-xs font-medium bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 transition text-neutral-700 dark:text-neutral-200">
        {dark ? 'Dark mode: ON' : 'Dark mode: OFF'}
      </button>
      {user && <a className={linkCls('/')} href="/">Home</a>}
      {user && <a className={linkCls('/profile')} href="/profile">Profile</a>}
      {user && <a className={linkCls('/review')} href="/review">Review</a>}
      <a className={linkCls('/learn')} href="/learn">Learn</a>
      <a className={linkCls('/about')} href="/about">About</a>
      <a className={linkCls('/pricing')} href="/pricing">Pricing</a>
      
      <div className="flex items-center gap-3 ml-2 pl-3 border-l border-neutral-300 dark:border-neutral-700">
        {!user && <a className={linkCls('/login')} href="/login"><Image src="/login.svg" alt="Login" width={16} height={16} className="dark:invert" />Login</a>}
        {!user && <a className={linkCls('/signup')} href="/signup">Sign Up</a>}
        {user && <button onClick={logout} className={linkCls('/logout')}><Image src="/logout.svg" alt="Logout" width={16} height={16} className="dark:invert" />Logout</button>}
        {/* Wallet Connect (always visible even if not signed auth user) */}
        <div className="ml-1 hidden lg:block">
          <WalletConnectButton />
        </div>
      </div>
    </nav>
  );
}

// --- Main NavBar Component ---
export function NavBar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  // Memoize theme toggle function to prevent unnecessary re-renders
  const toggleTheme = useCallback(() => {
    setDark(d => {
      const next = !d;
      document.documentElement.classList.toggle('dark', next);
      try {
        localStorage.setItem('theme', next ? 'dark' : 'light');
      } catch (error) {
        // Handle localStorage errors gracefully
        console.error('Failed to save theme preference:', error);
      }
      return next;
    });
  }, []);

  // Memoize close handler to prevent re-renders
  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  // Initialize component with error handling
  useEffect(() => {
    const initializeNavBar = async () => {
      try {
        // Mark component as mounted
        setMounted(true);

        // Handle theme initialization with error handling
        try {
          const storedTheme = localStorage.getItem('theme');
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          
          if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
            document.documentElement.classList.add('dark');
            setDark(true);
          } else if (storedTheme === 'light') {
            document.documentElement.classList.remove('dark');
            setDark(false);
          }
        } catch (error) {
          // Fallback to system preference if localStorage fails
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          setDark(prefersDark);
          if (prefersDark) {
            document.documentElement.classList.add('dark');
          }
        }

        // Small delay to ensure everything is properly initialized
        setTimeout(() => {
          setIsLoading(false);
        }, 50);
      } catch (error) {
        console.error('NavBar initialization error:', error);
        // Set mounted anyway to prevent infinite loading
        setMounted(true);
        setIsLoading(false);
      }
    };

    initializeNavBar();

    // Cleanup mobile drawer on route changes
    const handleRouteChange = () => {
      setOpen(false);
    };
    
    return () => {
      handleRouteChange();
    };
  }, []);

  // Memoize navigation props to prevent child re-renders
  const navProps = useMemo(() => ({
    user,
    logout,
    toggleTheme,
    dark,
    pathname
  }), [user, logout, toggleTheme, dark, pathname]);

  // Always render a stable header structure to prevent crashes
  const headerContent = useMemo(() => (
    <header className="border-b border-neutral-300 dark:border-neutral-800 px-4 h-14 flex items-center justify-between bg-white/70 dark:bg-neutral-950/60 backdrop-blur fixed top-0 left-0 right-0 z-30">
      <a href="/" className="flex items-center gap-2 font-semibold text-indigo-400 tracking-tight">
        <Image src="/logo.svg" alt="Logo" width={26} height={26} className="dark:invert" />
        <span><span className="!text-blue-600 dark:!text-blue-400">Reactive</span> Events</span>
      </a>
      
      {/* Mobile menu button - always render but control visibility with CSS */}
      <button
        aria-label="Toggle menu"
        onClick={() => setOpen(o => !o)}
        className="md:hidden p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800/70 transition text-neutral-700 dark:text-neutral-200"
        disabled={!mounted || isLoading}
      >
        <MenuIcon className="w-6 h-6" />
      </button>
      
      {/* Desktop navigation - always render for stability */}
      <div className="hidden md:block">
        {mounted && !isLoading ? (
          <NavLinks {...navProps} />
        ) : (
          <div className="flex items-center gap-4 h-8">
            {/* Loading placeholder for desktop nav */}
            <div className="w-16 h-6 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded"></div>
            <div className="w-20 h-6 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded"></div>
            <div className="w-24 h-6 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded"></div>
          </div>
        )}
      </div>
    </header>
  ), [mounted, isLoading, navProps]);

  // Prevent hydration mismatch by ensuring stable initial render
  if (!mounted) {
    return headerContent;
  }

  return (
    <>
      {headerContent}
      
      {/* Mobile drawer - render with proper error boundaries */}
      {mounted && !isLoading && (
        <div className="md:hidden">
          <MobileDrawer 
            open={open} 
            setOpen={setOpen} 
            {...navProps}
          />
          {/* Mobile wallet button fixed near bottom inside drawer overlay (if open) */}
          {open && (
            <div className="fixed bottom-16 left-0 right-0 px-5 flex justify-center md:hidden z-50">
              <WalletConnectButton compact className="w-full max-w-xs justify-center" />
            </div>
          )}
        </div>
      )}
    </>
  );
}
