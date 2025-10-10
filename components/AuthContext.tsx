"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { hashEmail } from '../lib/hash';
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
  projectId: string; // unique project id
}

interface MonitoredMetaEntry {
  auto?: boolean; // auto-save enabled for this entry
}

interface AuthContextValue {
  user: StoredUser | null;
  initializing: boolean;
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
  monitoredMeta: Record<string, MonitoredMetaEntry>;
  toggleAddressAutoSave: (addr: string) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [initializing, setInitializing] = useState<boolean>(true);
  const [monitoredAddresses, setMonitoredAddresses] = useState<string[]>([]);
  const [monitoredOnly, setMonitoredOnly] = useState<boolean>(false);
  const [monitoredMeta, setMonitoredMeta] = useState<Record<string, MonitoredMetaEntry>>({});
  const router = useRouter();

  // IPFS: Load user data from IPFS hash in localStorage (if present)
  useEffect(() => {
    const loadUserFromIPFS = async () => {
      if (typeof window === 'undefined') return;
      const cid = localStorage.getItem('authUserCid');
      if (cid) {
        try {
          // Try to fetch user from our server-side API
          const res = await fetch(`/api/user?cid=${encodeURIComponent(cid)}`);
          if (!res.ok) {
            localStorage.removeItem('authUserCid');
          } else {
            const parsedUser = await res.json() as StoredUser;
            const prefs = parsedUser.prefs || defaultPrefs;
            const needsMigration = Object.keys(defaultPrefs).some(k => !(k in prefs));
            if (needsMigration || !parsedUser.prefs) {
              const migrated = { ...defaultPrefs, ...prefs };
              const newUser = { ...parsedUser, prefs: migrated };
              setUser(newUser);
              // save updated version
              await saveUserToServer(newUser);
            } else {
              setUser(parsedUser);
            }
          }
        } catch (e) {
          // ignore
        }
      }
      // Monitored addresses and meta (optional: can also be IPFS)
      try {
        const ma = localStorage.getItem('monitoredAddresses');
        if (ma) setMonitoredAddresses(JSON.parse(ma));
      } catch {}
      try {
        const mo = localStorage.getItem('monitoredOnly');
        if (mo) setMonitoredOnly(mo === 'true');
      } catch {}
      try {
        const mm = localStorage.getItem('monitoredMeta');
        if (mm) setMonitoredMeta(JSON.parse(mm));
      } catch {}
    };
    loadUserFromIPFS().finally(() => setInitializing(false));
  }, []);

  // Helper to save user to server and return CID-like id
  const saveUserToServer = async (userObj: StoredUser): Promise<{ cid: string }> => {
    const res = await fetch('/api/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userObj),
    });
    if (!res.ok) throw new Error('Failed to save user');
    return res.json();
  };

  // Migration: ensure all monitored addresses & meta keys are lowercase (idempotent)
  useEffect(() => {
    if (monitoredAddresses.length === 0 && Object.keys(monitoredMeta).length === 0) return;
    const anyUpper = monitoredAddresses.some(a => a !== a.toLowerCase());
    const metaUpper = Object.keys(monitoredMeta).some(k => k !== k.toLowerCase());
    if (!anyUpper && !metaUpper) return; // already normalized
    const lowered = Array.from(new Set(monitoredAddresses.map(a => a.toLowerCase())));
    const newMeta: Record<string, MonitoredMetaEntry> = {};
    Object.entries(monitoredMeta).forEach(([k, v]) => { newMeta[k.toLowerCase()] = v; });
    setMonitoredAddresses(lowered);
    setMonitoredMeta(newMeta);
    try {
      localStorage.setItem('monitoredAddresses', JSON.stringify(lowered));
      localStorage.setItem('monitoredMeta', JSON.stringify(newMeta));
    } catch {}
  }, [monitoredAddresses, monitoredMeta]);

  // Helper to generate a unique project ID
  function generateProjectId(email: string) {
    return hashEmail(email.toLowerCase());
  }

  const signup = async (email: string, username: string, password: string) => {
    const cleanUsername = username.trim() || email.split('@')[0];

    // Check if username is already taken
    const checkRes = await fetch(`/api/cid-registry?username=${encodeURIComponent(cleanUsername)}`);
    if (checkRes.ok) {
        throw new Error('Username is already taken.');
    }

    const newUser: StoredUser = {
      email,
      username: cleanUsername,
      prefs: defaultPrefs,
      verified: true, // Assuming email verification is handled elsewhere
      projectId: generateProjectId(email),
    };

    try {
      // 1. Save user data to server
      const { cid } = await saveUserToServer(newUser);

      // 2. Register the user in the CID registry
      const registerRes = await fetch('/api/cid-registry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: cleanUsername, cid }),
      });

      if (!registerRes.ok) {
        const { error } = await registerRes.json();
        throw new Error(error || 'Failed to register user.');
      }

      // 3. Set user state and cache CID
      setUser(newUser);
      try { localStorage.setItem('authUserCid', cid); } catch {}
      router.push('/');
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    }
  };

  const login = async (identifier: string, password: string) => {
    try {
      // 1. Look up username in the CID registry
      const res = await fetch(`/api/cid-registry?username=${encodeURIComponent(identifier)}`);
      if (!res.ok) throw new Error('Invalid username or password');
      const { cid } = await res.json();

      // 2. Fetch user record from server
      const userRes = await fetch(`/api/user?cid=${encodeURIComponent(cid)}`);
      if (!userRes.ok) throw new Error('Failed to load user');
      const existing = await userRes.json() as StoredUser;

      const prefs = { ...defaultPrefs, ...existing.prefs };
      const merged = { ...existing, prefs };
      setUser(merged);
      try { localStorage.setItem('authUserCid', cid); } catch {}
      router.push('/');
    } catch (e) {
      console.error('Login failed', e);
      throw new Error('Invalid username or password');
    }
  };

  const logout = () => {
    localStorage.removeItem('authUserCid');
    localStorage.removeItem('monitoredAddresses');
    localStorage.removeItem('monitoredOnly');
    localStorage.removeItem('monitoredMeta');
    setUser(null);
    setMonitoredAddresses([]);
    setMonitoredOnly(false);
    setMonitoredMeta({});
    router.push('/login');
  };

  const updatePreferences = async (prefs: UserPrefs) => {
    if (!user) return;
    const updated: StoredUser = { ...user, prefs };
    setUser(updated);
    const { cid } = await saveUserToServer(updated);
    try { localStorage.setItem('authUserCid', cid); } catch {}
  };

  const updateUsername = async (username: string) => {
    if (!user) return;
    const clean = username.trim();
    if (!clean) return;
    const updated: StoredUser = { ...user, username: clean };
    setUser(updated);
    const { cid } = await saveUserToServer(updated);
    try { localStorage.setItem('authUserCid', cid); } catch {}
  };

  // Monitored address management
  const addMonitoredAddress = (addr: string) => {
    const norm = addr.trim().toLowerCase();
    if (!norm) return;
    setMonitoredAddresses(prev => {
      if (prev.includes(norm)) return prev;
      const next = [...prev, norm];
      localStorage.setItem('monitoredAddresses', JSON.stringify(next));
      return next;
    });
    setMonitoredMeta(prev => {
      const next = { ...prev };
      if (!next[norm]) next[norm] = { auto: false };
      localStorage.setItem('monitoredMeta', JSON.stringify(next));
      return next;
    });
  };
  const removeMonitoredAddress = (addr: string) => {
    const norm = addr.toLowerCase();
    setMonitoredAddresses(prev => {
      const next = prev.filter(a => a !== norm);
      localStorage.setItem('monitoredAddresses', JSON.stringify(next));
      return next;
    });
    setMonitoredMeta(prev => {
      const next = { ...prev };
      delete next[norm];
      localStorage.setItem('monitoredMeta', JSON.stringify(next));
      return next;
    });
  };
  const clearMonitoredAddresses = () => {
    setMonitoredAddresses([]);
    localStorage.setItem('monitoredAddresses', JSON.stringify([]));
    setMonitoredMeta({});
    localStorage.setItem('monitoredMeta', JSON.stringify({}));
  };
  const setMonitoredOnlyWrapped = (v: boolean) => {
    setMonitoredOnly(v);
    localStorage.setItem('monitoredOnly', String(v));
  };
  const toggleAddressAutoSave = (addr: string) => {
    const norm = addr.toLowerCase();
    setMonitoredMeta(prev => {
      // Always create a new object and a new entry object
      const next = { ...prev };
      const prevEntry = prev[norm] || { auto: false };
      // Create a new entry object to ensure state change is detected
      const entry = { ...prevEntry, auto: !prevEntry.auto };
      next[norm] = entry;
      localStorage.setItem('monitoredMeta', JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider value={{ user, initializing, signup, login, logout, updatePreferences, updateUsername, monitoredAddresses, addMonitoredAddress, removeMonitoredAddress, clearMonitoredAddresses, monitoredOnly, setMonitoredOnly: setMonitoredOnlyWrapped, monitoredMeta, toggleAddressAutoSave }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
