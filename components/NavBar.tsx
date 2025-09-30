"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useTheme } from './useTheme';
import Image from 'next/image';
import WalletConnectButton from './WalletConnectButton';
import { useAuth } from './AuthContext';
import { usePathname } from 'next/navigation';

// Helper function for link classes
const getLinkClassName = (pathname: string, href: string) => 
  `flex items-center gap-2 px-3 py-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800/70 transition text-sm ${pathname === href ? 'text-[color:var(--accent)] font-bold' : 'text-neutral-700 dark:text-neutral-200'}`;

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
  if (!setOpen) {
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
          <span className="font-semibold text-[color:var(--accent-hover)]">Menu</span>
          <button onClick={() => setOpen(false)} className="p-2 rounded hover:bg-neutral-200 dark:hover:bg-neutral-800/70" aria-label="Close menu">
            <CloseIcon className="w-5 h-5 text-neutral-700 dark:text-neutral-200" />
          </button>
        </div>
        <nav className="p-2 flex flex-col">
          {/* animate UI removed - animations are enabled by default */}
          <button onClick={toggleTheme} className={linkCls('/theme')}>
            {dark ? 'Dark mode: ON' : 'Dark mode: OFF'}
          </button>
          <div className="my-2 border-t border-neutral-200 dark:border-neutral-800" />
          <div className="flex flex-col divide-y divide-neutral-200 dark:divide-neutral-800">
              <div className="flex flex-col space-y-2 py-1">
              <a onClick={() => setOpen(false)} className={linkCls('/')} href="/">Home</a>
              <a onClick={() => setOpen(false)} className={linkCls('/news')} href="/news">News</a>
              {user && <a onClick={() => setOpen(false)} className={linkCls('/profile')} href="/profile">Profile</a>}
              <a onClick={() => setOpen(false)} className={linkCls('/learn')} href="/learn">Learn</a>
              <a onClick={() => setOpen(false)} className={linkCls('/about')} href="/about">About</a>
              <a onClick={() => setOpen(false)} className={linkCls('/pricing')} href="/pricing">Pricing</a>
              {!user && <a onClick={() => setOpen(false)} className={linkCls('/login')} href="/login">Login</a>}
              {!user && <a onClick={() => setOpen(false)} className={linkCls('/signup')} href="/signup">Sign Up</a>}
            </div>
            <div className="py-2 flex justify-start">
              <WalletConnectButton />
            </div>
            {user && (
              <div className="py-1">
                <button onClick={() => { logout(); setOpen(false); }} className={`${linkCls('/logout')} w-full`}><Image src="/logout.svg" alt="Logout" width={16} height={16} className="dark:invert" />Logout</button>
              </div>
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
      {/* animate button removed - animations enabled by default */}
  <a className={linkCls('/')} href="/">Home</a>
  <a className={linkCls('/news')} href="/news">News</a>
  {user && <a className={linkCls('/profile')} href="/profile">Profile</a>}
  <a className={linkCls('/learn')} href="/learn">Learn</a>
  <a className={linkCls('/about')} href="/about">About</a>
  <a className={linkCls('/pricing')} href="/pricing">Pricing</a>
      <div className="flex items-center gap-3 ml-2 pl-3 border-l border-neutral-300 dark:border-neutral-700">
        {!user && <a className={linkCls('/login')} href="/login"><Image src="/login.svg" alt="Login" width={16} height={16} className="dark:invert" />Login</a>}
        {!user && <a className={linkCls('/signup')} href="/signup">Sign Up</a>}
        {user && <button onClick={logout} className={linkCls('/logout')}><Image src="/logout.svg" alt="Logout" width={16} height={16} className="dark:invert" />Logout</button>}
        <WalletConnectButton />
      </div>
    </nav>
  );
}

// --- Main NavBar Component ---
export function NavBar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const { dark, toggleTheme } = useTheme();

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
  <a href="/" className="flex items-center gap-2 font-semibold text-[color:var(--accent-hover)] tracking-tight">
        <Image src="/logo.svg" alt="Logo" width={26} height={26} className="dark:invert" />
  <span><span className="!text-[color:var(--accent)] dark:!text-[color:var(--accent-hover)]">Reactive</span> Events</span>
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
  useEffect(() => {
    setMounted(true);
    setIsLoading(false);
  }, []);

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
          {/* Mobile wallet button at bottom removed */}
        </div>
      )}
    </>
  );
}
