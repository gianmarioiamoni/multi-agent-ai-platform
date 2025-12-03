/**
 * Next.js Middleware
 * Handles session refresh, route protection, and security headers
 * Following SRP: Only handles middleware logic
 */

import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { logUnauthorizedAccess, detectAndLogThreats } from '@/lib/security/security-logger';

/**
 * Public routes that don't require authentication
 */
const publicRoutes = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/callback',
  '/privacy',
];

/**
 * Admin routes that require admin role
 */
const adminRoutes = ['/admin'];

/**
 * API routes that don't require authentication
 */
const publicApiRoutes = [
  '/api/stripe/webhook', // Stripe webhook uses signature verification
  '/api/cron/subscription-expiry', // Cron job uses secret verification
];

/**
 * Check if a path matches any of the patterns
 */
function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some((route) => {
    if (route === pathname) {
      return true;
    }
    // Support wildcard matching for nested routes
    if (route.endsWith('/*')) {
      const prefix = route.slice(0, -2);
      return pathname.startsWith(prefix);
    }
    return pathname.startsWith(route);
  });
}

/**
 * Add security headers to response
 */
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Content Security Policy
  // In development, Next.js requires 'unsafe-eval' for hot reloading
  // In production, we can use stricter policies
  const isDev = process.env.NODE_ENV === 'development';
  const csp = [
    "default-src 'self'",
    isDev
      ? "script-src 'self' 'unsafe-eval' 'unsafe-inline'"
      : "script-src 'self' 'unsafe-inline'", // Stripe requires unsafe-inline
    "style-src 'self' 'unsafe-inline'", // Tailwind requires unsafe-inline
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    "connect-src 'self' https://*.supabase.co https://*.upstash.io https://api.openai.com https://api.stripe.com https://vitals.vercel-insights.com",
    "frame-src 'self' https://js.stripe.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join('; ');

  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  // HSTS - only in production
  if (process.env.NODE_ENV === 'production') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files and Next.js internals
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/_next') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/icon.svg') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|gif|webp|woff|woff2|ttf|eot)$/)
  ) {
    return NextResponse.next();
  }

  // Update Supabase session
  const { supabaseResponse, user } = await updateSession(request);

  // Handle API routes
  if (pathname.startsWith('/api')) {
    // Detect security threats in request
    await detectAndLogThreats(request);
    
    // Allow public API routes
    if (matchesRoute(pathname, publicApiRoutes)) {
      return addSecurityHeaders(supabaseResponse);
    }

    // Require authentication for all other API routes
    if (!user) {
      await logUnauthorizedAccess(request, pathname, 'Authentication required');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return addSecurityHeaders(supabaseResponse);
  }

  // Handle admin routes
  if (matchesRoute(pathname, adminRoutes)) {
    if (!user) {
      await logUnauthorizedAccess(request, pathname, 'Admin access requires authentication');
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check admin role (will be verified in the page component)
    // We just ensure user is authenticated here
    return addSecurityHeaders(supabaseResponse);
  }

  // Handle app routes (require authentication)
  if (pathname.startsWith('/app')) {
    if (!user) {
      await logUnauthorizedAccess(request, pathname, 'App access requires authentication');
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return addSecurityHeaders(supabaseResponse);
  }

  // Public routes - allow access
  if (matchesRoute(pathname, publicRoutes)) {
    return addSecurityHeaders(supabaseResponse);
  }

  // Default: allow access but add security headers
  return addSecurityHeaders(supabaseResponse);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
  // Explicitly set runtime to edge (default in Next.js 15)
  runtime: 'edge',
};

