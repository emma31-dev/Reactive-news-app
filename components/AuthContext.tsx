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
  verified?: boolean; // email ownership confirmed
}

interface AuthContextValue {
  user: StoredUser | null;
  signup: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updatePreferences: (prefs: UserPrefs) => void;
  requestEmailCode: (email: string) => Promise<{ devCode?: string } | void>;
  verifyEmailCode: (email: string, code: string) => Promise<boolean>;
  emailVerification: {
    requestedFor: string | null;
    status: 'idle' | 'requesting' | 'requested' | 'verifying' | 'verified' | 'error';
    error?: string | null;
    expiresAt?: number | null;
    devCode?: string | null; // exposed only in dev
  };
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [emailVerification, setEmailVerification] = useState<AuthContextValue['emailVerification']>({
    requestedFor: null,
    status: 'idle',
    error: null,
    expiresAt: null,
    devCode: null,
  });
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
    // Require verification first – if not verified, block and auto-request code
    const existingRaw = localStorage.getItem('authUser');
    if (existingRaw) {
      try {
        const existing: StoredUser = JSON.parse(existingRaw);
        if (existing.email === email && existing.verified !== true) {
          throw new Error('Email not verified');
        }
      } catch { /* ignore */ }
    }
    const mockUser: StoredUser = { email, prefs: defaultPrefs, verified: true };
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
          if (existing.verified) {
            // preserve verified flag
            localStorage.setItem('authUser', JSON.stringify({ ...existing, prefs }));
            setUser({ ...existing, prefs });
            router.push('/');
            return;
          }
        } else if (existing.email !== email) {
          prefs = defaultPrefs;
        }
      } catch (_) {
        existingRaw = null;
      }
    }
    // If not verified yet, start verification flow instead of logging fully in
    if (!emailVerification.requestedFor || emailVerification.requestedFor !== email) {
      await requestEmailCode(email); // auto request
    }
    setEmailVerification(v => ({ ...v, status: 'requested' }));
    // Store a provisional unverified user
    const provisional: StoredUser = { email, prefs, verified: false };
    localStorage.setItem('authUser', JSON.stringify(provisional));
    setUser(provisional);
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

  const requestEmailCode: AuthContextValue['requestEmailCode'] = async (email) => {
    setEmailVerification(v => ({ ...v, status: 'requesting', error: null }));
    try {
      const res = await fetch('/api/auth/request-code', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed requesting code');
      setEmailVerification({ requestedFor: email, status: 'requested', error: null, expiresAt: Date.now() + (data.expiresIn * 1000), devCode: data.devCode || null });
      return { devCode: data.devCode };
    } catch (e: any) {
      setEmailVerification(v => ({ ...v, status: 'error', error: e.message }));
    }
  };

  const verifyEmailCode: AuthContextValue['verifyEmailCode'] = async (email, code) => {
    setEmailVerification(v => ({ ...v, status: 'verifying', error: null }));
    try {
      const res = await fetch('/api/auth/verify-code', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, code }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed');
      // Update user verified flag if present
      if (user && user.email === email) {
        const updated: StoredUser = { ...user, verified: true };
        setUser(updated);
        localStorage.setItem('authUser', JSON.stringify(updated));
      }
      setEmailVerification(v => ({ ...v, status: 'verified', error: null }));
      return true;
    } catch (e: any) {
      setEmailVerification(v => ({ ...v, status: 'error', error: e.message }));
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, updatePreferences, requestEmailCode, verifyEmailCode, emailVerification }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
