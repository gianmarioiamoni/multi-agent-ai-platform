/**
 * Google Calendar OAuth Utilities
 * Handles Google Calendar OAuth flow and token refresh
 * Following SRP: Only handles Google Calendar OAuth logic
 */

import { getStoredCredential, saveStoredCredential } from './actions';
import type { GoogleOAuthTokens } from '@/types/credentials.types';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

/**
 * Refresh Google OAuth token
 */
async function refreshGoogleToken(refreshToken: string): Promise<GoogleOAuthTokens | null> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return null;
  }

  try {
    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json() as {
      access_token: string;
      expires_in: number;
      scope: string;
      token_type: string;
    };

    return {
      access_token: data.access_token,
      refresh_token: refreshToken, // Keep the same refresh token
      expires_at: Math.floor(Date.now() / 1000) + data.expires_in,
      scope: data.scope,
      token_type: data.token_type,
    };
  } catch {
    return null;
  }
}

/**
 * Get valid access token for Google Calendar API
 * Automatically refreshes if expired
 */
export async function getValidGoogleCalendarToken(): Promise<string | null> {
  try {
    const { data: tokens, error } = await getStoredCredential('google_calendar');

    if (error || !tokens) {
      return null;
    }

    // Check if token is expired (with 5 minute buffer)
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = tokens.expires_at;
    const buffer = 300; // 5 minutes

    if (expiresAt && now >= expiresAt - buffer) {
      const refreshed = await refreshGoogleToken(tokens.refresh_token);

      if (!refreshed) {
        return null;
      }

      await saveStoredCredential('google_calendar', refreshed, [refreshed.scope]);
      
      return refreshed.access_token;
    }

    return tokens.access_token;
  } catch {
    return null;
  }
}

/**
 * Get OAuth authorization URL for Google Calendar
 */
export function getGoogleCalendarAuthUrl(): string {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback/google-calendar`;

  if (!clientId) {
    throw new Error('GOOGLE_CLIENT_ID is not configured');
  }

  const scopes = [
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/calendar.readonly',
  ].join(' ');

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes,
    access_type: 'offline',
    prompt: 'consent', // Force consent to get refresh token
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeGoogleCalendarCode(code: string): Promise<GoogleOAuthTokens | null> {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_REDIRECT_URI || `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback/google-calendar`;

  if (!clientId || !clientSecret) {
    return null;
  }

  try {
    const response = await fetch(GOOGLE_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json() as {
      access_token: string;
      refresh_token: string;
      expires_in: number;
      scope: string;
      token_type: string;
    };

    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: Math.floor(Date.now() / 1000) + data.expires_in,
      scope: data.scope,
      token_type: data.token_type,
    };
  } catch {
    return null;
  }
}

