/**
 * Auth Debug Utilities
 * Temporary debug helpers to diagnose authentication issues
 */

'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';

export const debugAuthState = async () => {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  
  console.log('=== AUTH DEBUG ===');
  console.log('Total cookies:', allCookies.length);
  console.log('Supabase cookies:', allCookies.filter(c => 
    c.name.includes('supabase') || c.name.includes('auth')
  ));

  const supabase = await createClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  
  console.log('Session exists:', !!session);
  console.log('Session error:', error);
  console.log('User ID:', session?.user?.id);
  console.log('User email:', session?.user?.email);
  console.log('==================');

  return {
    hasCookies: allCookies.length > 0,
    hasSession: !!session,
    userId: session?.user?.id,
    userEmail: session?.user?.email,
  };
};

