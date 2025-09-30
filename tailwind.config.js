/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    screens: {
      'sm': '650px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        'sans': ['var(--font-outfit)', 'system-ui', 'sans-serif'],
        'heading': ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#2563eb', // blue-600
          light: '#60a5fa',   // blue-400
          dark: '#1e40af',    // blue-800
        },
        accent: {
          DEFAULT: '#4f46e5', // indigo-600
          light: '#818cf8',   // indigo-400
          dark: '#4338ca',    // indigo-800
        },
      },
    },
  },
  plugins: [],
};
