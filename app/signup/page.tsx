"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../components/AuthContext';
import Link from 'next/link';
import { TextField } from '../../components/ui/TextField';

export default function SignupPage() {
  const { signup, user } = useAuth();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [projectId, setProjectId] = useState<string | null>(null);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
  };

  const onSubmit = async (e: React.FormEvent) => {
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
      await signup(email, username, password);
      // Wait for AuthContext user to update and then show the real projectId
      // Use an effect below to pick up the user change
    } catch (err: any) {
      setError(err.message || 'Failed to create account. Please try again.');
    }
  };

  // When user is set after signup, show the actual projectId
  useEffect(() => {
    if (user && email && user.email === email && user.projectId) {
      setProjectId(user.projectId);
    }
  }, [user, email]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Sign Up</h1>
      <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-3 rounded-md text-sm">
        <b>Note:</b> A unique <span className="font-mono">Project ID</span> will be generated for your account. <br />
        <span className="text-blue-600 dark:text-blue-200">You will need this Project ID to log in. It will be shown in your profile after signup.</span>
      </div>
      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 p-3 rounded-md text-sm">
          {error}
        </div>
      )}
      {projectId && (
        <div className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-3 rounded-md text-sm">
          <b>Account created!</b> Your Project ID is:
          <span className="ml-2 font-mono bg-neutral-200 dark:bg-neutral-800 px-2 py-1 rounded select-all">{projectId}</span>
          <span className="block mt-1 text-xs text-neutral-600 dark:text-neutral-300">(You will need this Project ID to log in. It is also shown in your profile.)</span>
          <button
            className="ml-4 text-xs px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-500 transition"
            onClick={() => setProjectId(null)}
          >Dismiss</button>
        </div>
      )}
      <form onSubmit={onSubmit} className="space-y-4">
        <TextField
          label="Username"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Choose a username"
          minLength={2}
          required
        />
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
        <button className="btn btn-primary w-full" type="submit">Create Account</button>
      </form>
      <p className="text-sm text-neutral-400">Already have an account? <Link className="underline" href="/login">Log in</Link></p>
    </div>
  );
}
