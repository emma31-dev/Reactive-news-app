"use client";
import React, { useState } from 'react';
import { useAuth } from '../../components/AuthContext';
import Link from 'next/link';
import { TextField } from '../../components/ui/TextField';

export default function LoginPage() {
  const { login, emailVerification, requestEmailCode, verifyEmailCode, user } = useAuth();
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Removed loading state per request (instant login UX)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials.');
    }
  };

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!/^[0-9]{6}$/.test(code)) { setError('Enter the 6-digit code'); return; }
    await verifyEmailCode(email, code);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Login</h2>
      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      {(!user || user?.verified) && (
        <form onSubmit={onSubmit} className="space-y-4">
        <TextField
          label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter your password (8+ characters)"
          minLength={8}
          required
        />
        <button className="btn-primary w-full rounded-sm" type="submit">
          Login
        </button>
        </form>) }

      {user && !user.verified && (
        <div className="mt-6 space-y-4 border-t border-neutral-800 pt-6">
          <p className="text-sm text-neutral-500">Email verification required for <strong>{user.email}</strong>.</p>
          <form onSubmit={onVerify} className="space-y-3">
            <TextField
              label="Verification Code"
              maxLength={6}
              value={code}
              onChange={e => setCode(e.target.value.replace(/[^0-9]/g,''))}
              placeholder="••••••"
              required
              inputClassName="tracking-widest text-center"
            />
            <div className="flex items-center gap-2">
              {emailVerification.devCode && (
                <p className="text-[10px] text-emerald-500">Dev Code: {emailVerification.devCode}</p>
              )}
              {emailVerification.transport && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200">mode: {emailVerification.transport}</span>
              )}
              {emailVerification.sent === false && emailVerification.transport && (
                <span className="text-[10px] text-red-500">not sent</span>
              )}
            </div>
            <div className="flex gap-2">
              <button type="submit" className="btn-primary flex-1 rounded-sm" disabled={emailVerification.status === 'verifying'}>
                {emailVerification.status === 'verifying' ? 'Verifying…' : 'Verify'}
              </button>
              <button
                type="button"
                className="px-3 py-2 text-xs rounded-sm border bg-neutral-100 dark:bg-neutral-800 disabled:opacity-50 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:cursor-not-allowed"
                disabled={emailVerification.status === 'requesting' || emailVerification.status === 'cooldown'}
                onClick={() => requestEmailCode(user.email)}
              >
                {emailVerification.status === 'requesting' ? 'Sending…' : (emailVerification.status === 'cooldown' && emailVerification.cooldownUntil) ? `Wait ${Math.max(0, Math.ceil((emailVerification.cooldownUntil - Date.now())/1000))}s` : 'Resend'}
              </button>
            </div>
            {emailVerification.status === 'cooldown' && emailVerification.cooldownUntil && (
              <p className="text-[10px] text-amber-600 dark:text-amber-400">{emailVerification.error}</p>
            )}
            {emailVerification.transport === 'disabled' && (
              <p className="text-[10px] text-red-500">Email transport disabled: no SMTP credentials configured.</p>
            )}
            {emailVerification.transport === 'error' && (
              <p className="text-[10px] text-red-500">Email sending error logged on server. Check server logs.</p>
            )}
            {emailVerification.sendError && (
              <p className="text-[10px] text-red-500">Send Error: {emailVerification.sendError}</p>
            )}
            {emailVerification.previewUrl && (
              <p className="text-[10px] text-emerald-500">Preview: <a className="underline" href={emailVerification.previewUrl} target="_blank" rel="noreferrer">open</a></p>
            )}
            {emailVerification.fallbackMock && (
              <p className="text-[10px] text-indigo-500">Mock Delivery Active (ETIMEDOUT fallback)</p>
            )}
          </form>
        </div>
      )}
      <p className="text-sm text-neutral-400">No account? <Link className="underline" href="/signup">Sign up</Link></p>
    </div>
  );
}
