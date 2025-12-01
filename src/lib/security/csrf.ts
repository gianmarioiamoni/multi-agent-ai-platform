/**
 * CSRF Protection Utilities
 * Implements CSRF token generation and validation
 * Following SRP: Only handles CSRF token logic
 */

'use server';

import { cookies } from 'next/headers';
import { createHmac, randomBytes } from 'crypto';

const CSRF_TOKEN_NAME = 'csrf-token';
const CSRF_SECRET = process.env.CSRF_SECRET || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'fallback-secret-change-in-production';

/**
 * Generate a CSRF token
 * Uses HMAC for token signing to prevent tampering
 */
export async function generateCsrfToken(): Promise<string> {
  const token = randomBytes(32).toString('hex');
  const timestamp = Date.now().toString();
  const signature = createHmac('sha256', CSRF_SECRET)
    .update(`${token}:${timestamp}`)
    .digest('hex');
  
  const csrfToken = `${token}:${timestamp}:${signature}`;
  
  // Store token in httpOnly cookie
  const cookieStore = await cookies();
  cookieStore.set(CSRF_TOKEN_NAME, csrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  });
  
  return token;
}

/**
 * Validate a CSRF token
 * @param token - The CSRF token to validate
 * @returns true if token is valid, false otherwise
 */
export async function validateCsrfToken(token: string | null | undefined): Promise<boolean> {
  if (!token) {
    return false;
  }
  
  const cookieStore = await cookies();
  const storedToken = cookieStore.get(CSRF_TOKEN_NAME)?.value;
  
  if (!storedToken) {
    return false;
  }
  
  const [storedTokenValue, timestamp, signature] = storedToken.split(':');
  
  if (!storedTokenValue || !timestamp || !signature) {
    return false;
  }
  
  // Verify signature
  const expectedSignature = createHmac('sha256', CSRF_SECRET)
    .update(`${storedTokenValue}:${timestamp}`)
    .digest('hex');
  
  if (signature !== expectedSignature) {
    return false;
  }
  
  // Check token matches
  if (storedTokenValue !== token) {
    return false;
  }
  
  // Check token hasn't expired (24 hours)
  const tokenAge = Date.now() - parseInt(timestamp, 10);
  const maxAge = 60 * 60 * 24 * 1000; // 24 hours in milliseconds
  
  if (tokenAge > maxAge) {
    return false;
  }
  
  return true;
}

/**
 * Get CSRF token from cookie (for client-side use)
 * Note: This only returns the token value, not the full signed token
 */
export async function getCsrfToken(): Promise<string | null> {
  const cookieStore = await cookies();
  const storedToken = cookieStore.get(CSRF_TOKEN_NAME)?.value;
  
  if (!storedToken) {
    return null;
  }
  
  const [token] = storedToken.split(':');
  return token || null;
}

