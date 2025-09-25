"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface UserPrefs {
  'Whale Watch': boolean;
  'Governance': boolean;
  'Security': boolean;
  'Market': boolean;
}

interface StoredUser {
  email: string;
  prefs?: UserPrefs;
}

interface AuthContextValue {
  user: StoredUser | null;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updatePreferences: (prefs: UserPrefs) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('authUser') : null;
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored);
        // Check if user has old preference structure and migrate
        if (parsedUser.prefs && ('btc' in parsedUser.prefs || 'eth' in parsedUser.prefs)) {
          // Clear old preferences and use new structure
          const newUser = {
            ...parsedUser,
            prefs: { 'Whale Watch': true, 'Governance': true, 'Security': false, 'Market': false }
          };
          localStorage.setItem('authUser', JSON.stringify(newUser));
          setUser(newUser);
        } else {
          setUser(parsedUser);
        }
      } catch (_) {
        // Corrupted local storage entry; clear it.
        localStorage.removeItem('authUser');
      }
    }
  }, []);

  const signup = async (email: string, password: string) => {
    // Mock: simply store user
    const mockUser: StoredUser = { email, prefs: { 'Whale Watch': true, 'Governance': true, 'Security': false, 'Market': false } };
    localStorage.setItem('authUser', JSON.stringify(mockUser));
    setUser(mockUser);
    router.push('/');
  };

  const login = async (email: string, password: string) => {
    // Mock: accept any credentials; preserve prefs if same user
    let existingRaw = localStorage.getItem('authUser');
    let prefs: UserPrefs = { 'Whale Watch': true, 'Governance': true, 'Security': false, 'Market': false };
    if (existingRaw) {
      try {
        const existing: StoredUser = JSON.parse(existingRaw);
        if (existing.email === email && existing.prefs) {
          prefs = existing.prefs;
        } else if (existing.email !== email) {
          // overwrite user but start with defaults
          prefs = { 'Whale Watch': true, 'Governance': true, 'Security': false, 'Market': false };
        }
      } catch (_) {
        // If parse fails, reset
        existingRaw = null;
      }
    }
    const nextUser: StoredUser = { email, prefs };
    localStorage.setItem('authUser', JSON.stringify(nextUser));
    setUser(nextUser);
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('authUser');
    setUser(null);
    router.push('/login');
  };

  const updatePreferences = (prefs: UserPrefs) => {
    if (!user) return;
    const updated: StoredUser = { ...user, prefs };
    setUser(updated);
    localStorage.setItem('authUser', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, updatePreferences }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
