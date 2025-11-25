/**
 * Google Calendar OAuth Callback Route
 * Handles OAuth callback for Google Calendar integration
 */

import { NextResponse, type NextRequest } from 'next/server';
import { exchangeGoogleCalendarCode } from '@/lib/credentials/google-calendar';
import { saveStoredCredential } from '@/lib/credentials/actions';
import { getCurrentUser } from '@/lib/auth/utils';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const origin = requestUrl.origin;

  // Handle OAuth errors
  if (error) {
    return NextResponse.redirect(
      `${origin}/app/integrations?error=${encodeURIComponent(error)}`
    );
  }

  // Verify user is authenticated
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.redirect(
      `${origin}/auth/login?error=${encodeURIComponent('Please log in to connect Google Calendar')}`
    );
  }

  if (!code) {
    return NextResponse.redirect(
      `${origin}/app/integrations?error=${encodeURIComponent('Missing authorization code')}`
    );
  }

  try {
    const tokens = await exchangeGoogleCalendarCode(code);
    
    if (!tokens) {
      return NextResponse.redirect(
        `${origin}/app/integrations?error=${encodeURIComponent('Failed to exchange authorization code')}`
      );
    }

    const scopes = tokens.scope.split(' ').filter(Boolean);
    const result = await saveStoredCredential('google_calendar', tokens, scopes);
    
    if (!result.success) {
      return NextResponse.redirect(
        `${origin}/app/integrations?error=${encodeURIComponent(result.error || 'Failed to save credentials')}`
      );
    }
    
    return NextResponse.redirect(
      `${origin}/app/integrations?success=${encodeURIComponent('Google Calendar connected successfully')}`
    );
  } catch (err) {
    return NextResponse.redirect(
      `${origin}/app/integrations?error=${encodeURIComponent(`An unexpected error occurred: ${err instanceof Error ? err.message : 'Unknown error'}`)}`
    );
  }
}

