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
    status: 'idle' | 'requesting' | 'requested' | 'verifying' | 'verified' | 'error' | 'cooldown';
    error?: string | null;
    expiresAt?: number | null;
    devCode?: string | null; // exposed only in dev
    sent?: boolean | null; // whether an email was actually dispatched
    cooldownUntil?: number | null; // timestamp when rate limit resets
    transport?: string | null; // diagnostic transport mode
    sendError?: string | null; // diagnostic send error
    previewUrl?: string | null; // ethereal preview URL (dev only)
    fallbackMock?: boolean | null; // whether mock fallback was used
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
    sent: null,
    cooldownUntil: null,
    transport: null,
    sendError: null,
    previewUrl: null,
    fallbackMock: null,
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
    // Enforce that the email has been verified in the current session BEFORE allowing account creation
    // The verification flow sets emailVerification.status === 'verified' once the user enters a valid code.
    if (!(emailVerification.status === 'verified' && emailVerification.requestedFor === email)) {
      // Auto-request a code if none requested yet to guide the user
      if (!emailVerification.requestedFor) {
        await requestEmailCode(email);
      }
      throw new Error('Please verify your email before creating the account');
    }

    // Prevent overwriting a different user's data accidentally
    const existingRaw = localStorage.getItem('authUser');
    if (existingRaw) {
      try {
        const existing: StoredUser = JSON.parse(existingRaw);
        if (existing.email !== email) {
          // Different provisional user -> replace
          localStorage.removeItem('authUser');
        }
      } catch { /* ignore parse error */ }
    }

    // At this stage we have a verified email. (Password handling is mock only – not persisted.)
    const newUser: StoredUser = { email, prefs: defaultPrefs, verified: true };
    localStorage.setItem('authUser', JSON.stringify(newUser));
    setUser(newUser);
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
      if (!res.ok) {
        if (res.status === 429 && typeof data.retryIn === 'number') {
          const until = Date.now() + data.retryIn * 1000;
            setEmailVerification(v => ({
              ...v,
              requestedFor: email,
              status: 'cooldown',
              error: data.error || 'Rate limited',
              cooldownUntil: until,
              transport: data.transport || v.transport || null,
            }));
          return;
        }
        throw new Error(data.error || 'Failed requesting code');
      }
      setEmailVerification({
        requestedFor: email,
        status: 'requested',
        error: null,
        expiresAt: Date.now() + (data.expiresIn * 1000),
        devCode: data.devCode || null,
        sent: Boolean(data.sent),
        cooldownUntil: null,
        transport: data.transport || null,
        sendError: data.sendError || null,
        previewUrl: data.previewUrl || null,
        fallbackMock: data.fallbackMock || null,
      });
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
        // If user was verifying during login flow, redirect home
        router.push('/');
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
