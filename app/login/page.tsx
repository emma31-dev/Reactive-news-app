"use client";
import React, { useState } from 'react';
import { useAuth } from '../../components/AuthContext';
import Link from 'next/link';
import { TextField } from '../../components/ui/TextField';

export default function LoginPage() {
  const { login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const looksLikeEmail = (val: string) => /@/.test(val);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!identifier.trim()) {
      setError('Please enter a username or email');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      await login(identifier.trim(), password);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials.');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Login</h2>
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
        <button className="btn-primary w-full rounded-sm" type="submit">
          Login
        </button>
      </form>
      <p className="text-sm text-neutral-400">No account? <Link className="underline" href="/signup">Sign up</Link></p>
    </div>
  );
}
