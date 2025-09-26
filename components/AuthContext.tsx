"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface UserPrefs {
  'Whale Watch': boolean;
  'Governance': boolean;
  'Security': boolean;
  'Market': boolean;
  'DeFi': boolean;
  'NFT': boolean;
  'Staking': boolean;
  'Airdrop': boolean;
}

const defaultPrefs: UserPrefs = {
  'Whale Watch': true,
  'Governance': true,
  'Security': false,
  'Market': false,
  'DeFi': true,
  'NFT': false,
  'Staking': false,
  'Airdrop': true,
};

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
        if (parsedUser.prefs) {
          // Determine if migration needed (missing any new keys)
            const needsMigration = Object.keys(defaultPrefs).some(k => !(k in parsedUser.prefs));
            if (needsMigration) {
              const migrated = { ...defaultPrefs, ...parsedUser.prefs };
              const newUser = { ...parsedUser, prefs: migrated };
              localStorage.setItem('authUser', JSON.stringify(newUser));
              setUser(newUser);
            } else {
              setUser(parsedUser);
            }
        } else {
          // No prefs stored, attach defaults
          const newUser = { ...parsedUser, prefs: defaultPrefs };
          localStorage.setItem('authUser', JSON.stringify(newUser));
          setUser(newUser);
        }
      } catch (_) {
        // Corrupted local storage entry; clear it.
        localStorage.removeItem('authUser');
      }
    }
  }, []);

  const signup = async (email: string, password: string) => {
    const mockUser: StoredUser = { email, prefs: defaultPrefs };
    localStorage.setItem('authUser', JSON.stringify(mockUser));
    setUser(mockUser);
    router.push('/');
  };

  const login = async (email: string, password: string) => {
    let existingRaw = localStorage.getItem('authUser');
    let prefs: UserPrefs = defaultPrefs;
    if (existingRaw) {
      try {
        const existing: StoredUser = JSON.parse(existingRaw);
        if (existing.email === email && existing.prefs) {
          // Merge existing with defaults to pick up new keys
          prefs = { ...defaultPrefs, ...existing.prefs };
        } else if (existing.email !== email) {
          prefs = defaultPrefs;
        }
      } catch (_) {
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
