"use client";
import React, { useState } from 'react';
import { useAuth } from '../../components/AuthContext';
import Link from 'next/link';
import { TextField } from '../../components/ui/TextField';
import Loader from '../../components/ui/Loader';

export default function LoginPage() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    if (!identifier.trim()) {
      setError('Please enter a username or email');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      await login(identifier.trim(), password);
      setSuccess(true);
      // The router push is handled inside the login function on success
    } catch (err: any) {
      setError(err.message || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Login</h1>
      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <TextField
          label="Username or Email"
          type="text"
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
          placeholder="yourname or yourname@example.com"
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
        <button className="btn btn-primary w-full flex items-center justify-center gap-3" type="submit" disabled={loading}>
          {loading ? (
            <>
              <Loader size={18} stroke={2} className="!block" ariaLabel="Logging in" />
              <span>Validating…</span>
            </>
          ) : success ? (
            <span>Success — redirecting…</span>
          ) : (
            <span>Login</span>
          )}
        </button>
      </form>
      <p className="text-sm text-neutral-400">No account? <Link className="underline" href="/signup">Sign up</Link></p>
    </div>
  );
}
