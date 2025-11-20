/**
 * OAuth Callback Route Handler
 * Handles OAuth provider callbacks (Google)
 * Exchange code for session
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      // Redirect to login with error
      return NextResponse.redirect(
        `${origin}/auth/login?error=${encodeURIComponent(error.message)}`
      );
    }
  }

  // Successful authentication, redirect to app
  return NextResponse.redirect(`${origin}/app/dashboard`);
}

