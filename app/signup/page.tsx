"use client";
import React, { useState } from 'react';
import { useAuth } from '../../components/AuthContext';
import Link from 'next/link';
import { TextField } from '../../components/ui/TextField';

export default function SignupPage() {
  const { signup, requestEmailCode, verifyEmailCode, emailVerification } = useAuth();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  // Removed loading state per request
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
  };

  const onSubmitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (!validatePassword(password)) {
      setError('Password must be at least 8 characters long and contain both letters and numbers');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await signup(email, password);
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    }
  };

  const onRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    await requestEmailCode(email);
    setStep(2);
  };

  const onVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!/^[0-9]{6}$/.test(code)) { setError('Enter the 6-digit code'); return; }
    const ok = await verifyEmailCode(email, code);
    if (ok) setStep(3);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Sign Up</h2>
      <div className="flex gap-2 text-[11px] uppercase tracking-wide font-medium text-neutral-500">
        <span className={step === 1 ? 'text-indigo-600' : ''}>Email</span>
        <span>›</span>
        <span className={step === 2 ? 'text-indigo-600' : ''}>Verify</span>
        <span>›</span>
        <span className={step === 3 ? 'text-indigo-600' : ''}>Password</span>
      </div>
      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      {step === 1 && (
        <form onSubmit={onRequestCode} className="space-y-4">
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
          />
          <button className="btn-primary w-full rounded-sm" type="submit" disabled={emailVerification.status === 'requesting'}>
            {emailVerification.status === 'requesting' ? 'Sending Code…' : 'Send Verification Code'}
          </button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={onVerifyCode} className="space-y-4">
          <div className="text-xs text-neutral-500">
            A 6‑digit code was {emailVerification.sent ? 'sent' : 'generated'} for <strong>{email}</strong>. Enter it below.
            {emailVerification.devCode && (
              <span className="text-emerald-600 ml-1">(Dev Code: {emailVerification.devCode})</span>
            )}
            {emailVerification.transport && (
              <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200">
                mode: {emailVerification.transport}
              </span>
            )}
          </div>
          <TextField
            label="Verification Code"
            maxLength={6}
            value={code}
            onChange={e => setCode(e.target.value.replace(/[^0-9]/g,''))}
            placeholder="••••••"
            required
            inputClassName="tracking-widest text-center"
          />
          <div className="flex gap-2 items-start">
            <button className="btn-primary flex-1 rounded-sm" type="submit" disabled={emailVerification.status === 'verifying'}>
              {emailVerification.status === 'verifying' ? 'Verifying…' : 'Verify Code'}
            </button>
            <button
              type="button"
              onClick={() => requestEmailCode(email)}
              disabled={emailVerification.status === 'requesting' || emailVerification.status === 'cooldown'}
              className="px-3 py-2 text-xs rounded-sm border bg-neutral-100 dark:bg-neutral-800 disabled:opacity-50 hover:bg-neutral-200 dark:hover:bg-neutral-700 disabled:cursor-not-allowed"
            >
              {emailVerification.status === 'requesting' ? 'Sending…' : emailVerification.status === 'cooldown' && emailVerification.cooldownUntil ? `Wait ${Math.max(0, Math.ceil((emailVerification.cooldownUntil - Date.now())/1000))}s` : 'Resend'}
            </button>
          </div>
          {emailVerification.status === 'cooldown' && emailVerification.cooldownUntil && (
            <p className="text-[10px] text-amber-600 dark:text-amber-400">{emailVerification.error} You can request a new code once the timer reaches 0.</p>
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
      )}
      {step === 3 && (
        <form onSubmit={onSubmitPassword} className="space-y-4">
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="At least 8 characters with letters and numbers"
            minLength={8}
            required
          />
          <TextField
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
            minLength={8}
            required
          />
          <button className="btn-primary w-full rounded-sm" type="submit">Create Account</button>
        </form>
      )}
      <p className="text-sm text-neutral-400">Already have an account? <Link className="underline" href="/login">Log in</Link></p>
    </div>
  );
}
