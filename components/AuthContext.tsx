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
      const ipfsHash = localStorage.getItem('authUserIpfsHash');
      if (ipfsHash) {
        try {
          const res = await fetch(`https://ipfs.io/ipfs/${ipfsHash}`);
          if (!res.ok) {
            // Only remove if 404 (not found), otherwise keep for retry
            if (res.status === 404) {
              localStorage.removeItem('authUserIpfsHash');
            }
            return;
          }
          const parsedUser = await res.json();
          if (parsedUser.prefs) {
            const needsMigration = Object.keys(defaultPrefs).some(k => !(k in parsedUser.prefs));
            if (needsMigration) {
              const migrated = { ...defaultPrefs, ...parsedUser.prefs };
              const newUser = { ...parsedUser, prefs: migrated };
              setUser(newUser);
              await saveUserToIPFS(newUser);
            } else {
              setUser(parsedUser);
            }
          } else {
            const newUser = { ...parsedUser, prefs: defaultPrefs };
            setUser(newUser);
            await saveUserToIPFS(newUser);
          }
        } catch (e) {
          // Network or transient error: do not remove hash, allow retry on next navigation
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

  // Helper to save user to IPFS and store hash
  // Returns the upload result ({ cid, url }) so callers can react when it's available
  const saveUserToIPFS = async (userObj: StoredUser): Promise<{ cid: string; url: string }> => {
    // This is a mock implementation since the IPFS upload functionality has been removed.
    // It returns a dummy CID and URL.
    console.log("Simulating user data save for:", userObj.email);
    const dummyCid = 'bafkreibm6jg3ux5qu3ye2i7s2gr26t2k5sd3ftsc6qreqq6a4v2l5f2mby';
    return Promise.resolve({
      cid: dummyCid,
      url: `https://ipfs.io/ipfs/${dummyCid}`,
    });
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
    const newUser: StoredUser = {
      email,
      username: cleanUsername,
      prefs: defaultPrefs,
      verified: true,
      projectId: generateProjectId(email),
    };
    setUser(newUser);
    // Save to IPFS in the background so signup/login do not block the UI.
    // Persisting the CID will happen when upload completes.
    saveUserToIPFS(newUser).then(({ cid }) => {
      try { localStorage.setItem('authUserIpfsHash', cid); } catch {}
    }).catch(() => {
      // Swallow network errors here to avoid breaking the signup flow; keep user in-memory
    });
    router.push('/');
  };

  const login = async (identifier: string, password: string) => {
    // For this client-side example, we'll simulate a login.
    // A real app would send credentials to a server for validation.
    const ipfsHash = localStorage.getItem('authUserIpfsHash');
    if (ipfsHash) {
      try {
        const res = await fetch(`https://ipfs.io/ipfs/${ipfsHash}`);
        if (!res.ok) {
          throw new Error('Failed to fetch user profile from IPFS.');
        }
        const existing: StoredUser = await res.json();
        
        // Check if the identifier (email/username) matches the stored user.
        // NOTE: Password is not being checked here as this is a demo.
        if (existing.email === identifier || existing.username === identifier) {
          const prefs = { ...defaultPrefs, ...existing.prefs };
          const merged = { ...existing, prefs };
          setUser(merged);
          
          // Non-blocking save to IPFS in case preferences were migrated.
          saveUserToIPFS(merged).catch(() => {});
          router.push('/');
          return;
        }
      } catch (e) {
        // Fall through to throw an error if IPFS fetch or parsing fails.
      }
    }

    // If no user is found in localStorage or they don't match, fail the login.
    throw new Error('Invalid credentials.');
  };

  const logout = () => {
    localStorage.removeItem('authUserIpfsHash');
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
    await saveUserToIPFS(updated);
  };

  const updateUsername = async (username: string) => {
    if (!user) return;
    const clean = username.trim();
    if (!clean) return;
    const updated: StoredUser = { ...user, username: clean };
    setUser(updated);
    await saveUserToIPFS(updated);
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
