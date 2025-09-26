"use client";
import React from 'react';

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
}

/**
 * Unified text input styling for auth forms and other simple inputs.
 */
export const TextField: React.FC<TextFieldProps> = ({
  label,
  error,
  hint,
  containerClassName = 'space-y-1',
  labelClassName = 'block text-sm font-medium text-neutral-700 dark:text-neutral-300',
  inputClassName = '',
  className,
  ...rest
}) => {
  const base = 'w-full rounded-sm border bg-white/70 dark:bg-neutral-900/40 px-3 py-2 text-sm outline-none transition placeholder:text-neutral-400 dark:placeholder:text-neutral-600 border-neutral-300 dark:border-neutral-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed';
  const errorRing = error ? ' ring-2 ring-red-400 focus:ring-red-500 focus:border-red-500 border-red-400 dark:border-red-600' : '';

  return (
    <div className={containerClassName}>
      {label && (
        <label className={labelClassName}>
          {label}
        </label>
      )}
      <input
        className={`${base}${errorRing} ${inputClassName || ''} ${className || ''}`}
        {...rest}
      />
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      {!error && hint && <p className="text-xs text-neutral-500 dark:text-neutral-400">{hint}</p>}
    </div>
  );
};
