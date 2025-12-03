/**
 * Fix Middleware NFT File
 * Workaround for Vercel build issue with middleware.js.nft.json
 * Creates the missing .nft.json file before/during build
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const nftFilePath = join(process.cwd(), '.next', 'server', 'middleware.js.nft.json');
const nftDir = join(process.cwd(), '.next', 'server');

// Create minimal .nft.json file for middleware
// This file contains the traced dependencies for the middleware
// Vercel expects this file to exist even if empty
const nftContent = {
  version: 1,
  files: [],
};

try {
  // Ensure directory exists
  if (!existsSync(nftDir)) {
    mkdirSync(nftDir, { recursive: true });
  }

  // Write the .nft.json file
  writeFileSync(nftFilePath, JSON.stringify(nftContent, null, 2));
  console.log(`✅ Created ${nftFilePath}`);
} catch (error) {
  // Don't fail if directory doesn't exist yet - it will be created during build
  console.warn('⚠️  Could not create middleware.js.nft.json (will retry after build):', error);
}

