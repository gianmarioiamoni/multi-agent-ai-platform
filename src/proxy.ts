/**
 * Next.js Proxy (formerly Middleware)
 * Handles authentication and route protection
 * - /app/* routes: Require authentication
 * - /admin/* routes: Require admin role
 * - /auth/* routes: Redirect if already authenticated
 * 
 * Note: This file was renamed from middleware.ts to proxy.ts
 * to comply with Next.js 15+ conventions
 */

import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/types/database.types';

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  const { pathname } = request.nextUrl;

  // Create response object
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // Create Supabase client for proxy
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // Get user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Handle auth routes (/auth/*)
  if (pathname.startsWith('/auth')) {
    // Allow OAuth callbacks even if user is authenticated
    // (for connecting external services like Google Calendar)
    if (pathname.startsWith('/auth/callback')) {
      return response;
    }
    
    if (user) {
      // Already authenticated, redirect to dashboard
      return NextResponse.redirect(new URL('/app/dashboard', request.url));
    }
    return response;
  }

  // Handle app routes (/app/*)
  if (pathname.startsWith('/app')) {
    if (!user) {
      // Not authenticated, redirect to login
      const redirectUrl = new URL('/auth/login', request.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }
    return response;
  }

  // Handle admin routes (/admin/*)
  if (pathname.startsWith('/admin')) {
    if (!user) {
      // Not authenticated, redirect to login
      const redirectUrl = new URL('/auth/login', request.url);
      redirectUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(redirectUrl);
    }

    // Check if user has admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (!profile || profile.role !== 'admin') {
      // Not admin, redirect to dashboard
      return NextResponse.redirect(new URL('/app/dashboard', request.url));
    }

    return response;
  }

  // For all other routes, just return the response
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public folder
     * - api routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

