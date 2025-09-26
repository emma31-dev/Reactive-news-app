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
  username?: string; // display / handle
  prefs?: UserPrefs;
  verified?: boolean; // email ownership confirmed
}

interface AuthContextValue {
  user: StoredUser | null;
  signup: (email: string, username: string, password: string) => Promise<void>;
  login: (identifier: string, password: string) => Promise<void>; // identifier can be email or username
  logout: () => void;
  updatePreferences: (prefs: UserPrefs) => void;
  updateUsername: (username: string) => void;
  monitoredAddresses: string[];
  addMonitoredAddress: (addr: string) => void;
  removeMonitoredAddress: (addr: string) => void;
  clearMonitoredAddresses: () => void;
  monitoredOnly: boolean;
  setMonitoredOnly: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [monitoredAddresses, setMonitoredAddresses] = useState<string[]>([]);
  const [monitoredOnly, setMonitoredOnly] = useState<boolean>(false);
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
    if (typeof window !== 'undefined') {
      try {
        const ma = localStorage.getItem('monitoredAddresses');
        if (ma) setMonitoredAddresses(JSON.parse(ma));
      } catch {}
      try {
        const mo = localStorage.getItem('monitoredOnly');
        if (mo) setMonitoredOnly(mo === 'true');
      } catch {}
    }
  }, []);

  const signup = async (email: string, username: string, password: string) => {
    const cleanUsername = username.trim() || email.split('@')[0];
    const newUser: StoredUser = { email, username: cleanUsername, prefs: defaultPrefs, verified: true };
    localStorage.setItem('authUser', JSON.stringify(newUser));
    setUser(newUser);
    router.push('/');
  };

  const login = async (identifier: string, password: string) => {
    const stored = localStorage.getItem('authUser');
    if (stored) {
      try {
        const existing: StoredUser = JSON.parse(stored);
        if (existing.email === identifier || existing.username === identifier) {
          // Ensure prefs merged with defaults
            const prefs = { ...defaultPrefs, ...existing.prefs };
            const merged = { ...existing, prefs };
            localStorage.setItem('authUser', JSON.stringify(merged));
            setUser(merged);
            router.push('/');
            return;
        }
      } catch { /* ignore */ }
    }
    // If user not found, create a new one with identifier treated as email
    const emailCandidate = identifier.includes('@') ? identifier : `${identifier}@example.local`; // fallback synthetic email
    const newUser: StoredUser = { email: emailCandidate, username: identifier.includes('@') ? identifier.split('@')[0] : identifier, prefs: defaultPrefs, verified: true };
    localStorage.setItem('authUser', JSON.stringify(newUser));
    setUser(newUser);
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('authUser');
    localStorage.removeItem('monitoredAddresses');
    localStorage.removeItem('monitoredOnly');
    setUser(null);
    setMonitoredAddresses([]);
    setMonitoredOnly(false);
    router.push('/login');
  };

  const updatePreferences = (prefs: UserPrefs) => {
    if (!user) return;
    const updated: StoredUser = { ...user, prefs };
    setUser(updated);
    localStorage.setItem('authUser', JSON.stringify(updated));
  };

  const updateUsername = (username: string) => {
    if (!user) return;
    const clean = username.trim();
    if (!clean) return;
    const updated: StoredUser = { ...user, username: clean };
    setUser(updated);
    localStorage.setItem('authUser', JSON.stringify(updated));
  };

  // Monitored address management
  const addMonitoredAddress = (addr: string) => {
    const norm = addr.trim();
    if (!norm) return;
    setMonitoredAddresses(prev => {
      if (prev.includes(norm)) return prev;
      const next = [...prev, norm];
      localStorage.setItem('monitoredAddresses', JSON.stringify(next));
      return next;
    });
  };
  const removeMonitoredAddress = (addr: string) => {
    setMonitoredAddresses(prev => {
      const next = prev.filter(a => a !== addr);
      localStorage.setItem('monitoredAddresses', JSON.stringify(next));
      return next;
    });
  };
  const clearMonitoredAddresses = () => {
    setMonitoredAddresses([]);
    localStorage.setItem('monitoredAddresses', JSON.stringify([]));
  };
  const setMonitoredOnlyWrapped = (v: boolean) => {
    setMonitoredOnly(v);
    localStorage.setItem('monitoredOnly', String(v));
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, updatePreferences, updateUsername, monitoredAddresses, addMonitoredAddress, removeMonitoredAddress, clearMonitoredAddresses, monitoredOnly, setMonitoredOnly: setMonitoredOnlyWrapped }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
