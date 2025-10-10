/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'raw.githubusercontent.com',
      'images.unsplash.com',
      'tailwindui.com'
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "stream": false,
      "crypto": false,
      "util": false,
      "assert": false,
      "http": false,
      "https": false,
      "os": false,
      "url": false,
      "zlib": false,
    };

    // Some libraries import Node core modules using the "node:" scheme (e.g. "node:stream").
    // Map those to false so Webpack won't attempt to resolve them during the build.
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'node:stream': false,
      'node:crypto': false,
      'node:util': false,
      'node:assert': false,
      'node:http': false,
      'node:https': false,
      'node:os': false,
      'node:url': false,
      'node:zlib': false,
      'node:buffer': false,
    };
    return config;
  }
};

export default nextConfig;
