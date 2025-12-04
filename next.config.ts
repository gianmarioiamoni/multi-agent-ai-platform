import type { NextConfig } from "next";
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

// Create middleware.js.nft.json file during config load
// This ensures it exists before Vercel's tracing phase
// Vercel may clean .next before build, so we also create it in postbuild
try {
  const nftDir = join(process.cwd(), '.next', 'server');
  const nftFilePath = join(nftDir, 'middleware.js.nft.json');
  
  if (!existsSync(nftDir)) {
    mkdirSync(nftDir, { recursive: true });
  }

  const nftContent = {
    version: 1,
    files: [],
  };

  writeFileSync(nftFilePath, JSON.stringify(nftContent, null, 2));
  // eslint-disable-next-line no-console
  console.log(`✅ Created ${nftFilePath} during config load`);
} catch (error) {
  // Don't fail - will retry in postbuild script
  // eslint-disable-next-line no-console
  console.warn('⚠️  Could not create middleware.js.nft.json during config load:', error);
}

const nextConfig: NextConfig = {
  // reactCompiler is Next.js 16+ feature, removed for Next.js 15 compatibility
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
