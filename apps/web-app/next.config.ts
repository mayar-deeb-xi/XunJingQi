import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  /** Enables hot reloading for local packages without a build step */
  transpilePackages: ['@acme/ui', '@acme/white-label', '@acme/client'],
};

export default nextConfig;
