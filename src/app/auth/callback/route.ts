/**
 * OAuth Callback Route Handler
 * Handles OAuth provider callbacks (Google)
 * Exchange code for session
 * Checks if user is disabled before allowing access
 */

import { createClient } from '@/lib/supabase/server';
import { NextResponse, type NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    
    const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      // Redirect to login with error
      return NextResponse.redirect(
        `${origin}/auth/login?error=${encodeURIComponent(error.message)}`
      );
    }

    // Check if user is disabled
    if (authData.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_disabled')
        .eq('user_id', authData.user.id)
        .single();

      const profileData = profile as { is_disabled?: boolean } | null;
      if (profileData?.is_disabled === true) {
        // User is disabled, sign them out and redirect to login with error
        await supabase.auth.signOut();
        return NextResponse.redirect(
          `${origin}/auth/login?error=${encodeURIComponent('Your account has been disabled. Please contact an administrator for assistance.')}`
        );
      }
    }
  }

  // Successful authentication, redirect to app
  return NextResponse.redirect(`${origin}/app/dashboard`);
}

