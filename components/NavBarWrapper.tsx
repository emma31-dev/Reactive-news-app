"use client";
import React from 'react';
import { NavBar } from './NavBar';

// Error boundary component for NavBar
class NavBarErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('NavBar crashed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Fallback UI when NavBar crashes
      return this.props.fallback || (
        <header className="border-b border-neutral-300 dark:border-neutral-800 px-4 h-14 flex items-center justify-between bg-white/70 dark:bg-neutral-950/60 backdrop-blur fixed top-0 left-0 right-0 z-30">
          <a href="/" className="flex items-center gap-2 font-semibold text-indigo-400 tracking-tight">
            <span className="w-6 h-6 bg-indigo-400 rounded"></span>
            <span><span className="text-blue-600">Reactive</span> News</span>
          </a>
          <nav className="flex items-center gap-4 text-sm">
            <a href="/" className="hover:text-blue-500">Home</a>
            <a href="/about" className="hover:text-blue-500">About</a>
            <a href="/login" className="hover:text-blue-500">Login</a>
          </nav>
        </header>
      );
    }

    return this.props.children;
  }
}

// Wrapper component with additional stability features
export function NavBarWrapper() {
  return (
    <NavBarErrorBoundary>
      <NavBar />
    </NavBarErrorBoundary>
  );
}