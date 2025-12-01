/**
 * API Security Wrapper
 * Utility functions to wrap API routes with security checks
 * Following SRP: Only handles API security wrapping
 */

'use server';

import { type NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/utils';
import { checkRateLimit } from '@/lib/rate-limiting/rate-limiter';
import { logUnauthorizedAccess, detectAndLogThreats, extractClientInfo } from '@/lib/security/security-logger';
import { sanitizeErrorResponse } from '@/lib/security/secure-error-handler';
import { logWarn } from '@/lib/logging/logger';

export interface ApiSecurityOptions {
  requireAuth?: boolean;
  rateLimitEndpoint?: string;
  rateLimitIdentifier?: string; // If not provided, uses userId or IP
  checkThreats?: boolean;
}

/**
 * Wrapper for API route handlers with security checks
 */
export async function withApiSecurity<T>(
  request: NextRequest,
  handler: (request: NextRequest, user: { id: string } | null) => Promise<T>,
  options: ApiSecurityOptions = {}
): Promise<NextResponse> {
  const {
    requireAuth = true,
    rateLimitEndpoint = 'api:general',
    rateLimitIdentifier,
    checkThreats = true,
  } = options;

  try {
    // Detect security threats
    if (checkThreats) {
      const body = await request.clone().json().catch(() => null);
      const threatDetected = await detectAndLogThreats(request, body);
      
      if (threatDetected) {
        return NextResponse.json(
          sanitizeErrorResponse(new Error('Invalid request'), 'validation', false),
          { status: 400 }
        );
      }
    }

    // Check authentication
    const user = await getCurrentUser();
    
    if (requireAuth && !user) {
      await logUnauthorizedAccess(request, request.nextUrl.pathname, 'Authentication required');
      return NextResponse.json(
        sanitizeErrorResponse(new Error('Unauthorized'), 'authentication', false),
        { status: 401 }
      );
    }

    // Check rate limiting
    if (rateLimitEndpoint) {
      const identifier = rateLimitIdentifier || user?.id || extractClientInfo(request).ipAddress || 'unknown';
      
      if (!identifier || identifier === 'unknown') {
        // If we can't identify the user, use IP-based rate limiting
        const { ipAddress } = extractClientInfo(request);
        if (ipAddress) {
          const rateLimitResult = await checkRateLimit(ipAddress, 'public:api');
          
          if (!rateLimitResult.allowed) {
            await logWarn('rate_limit', 'Rate limit exceeded for unauthenticated request', {
              ipAddress,
              endpoint: request.nextUrl.pathname,
            });
            
            return NextResponse.json(
              {
                error: `Rate limit exceeded. Please try again in ${Math.ceil(
                  (rateLimitResult.resetAt.getTime() - Date.now()) / 1000 / 60
                )} minute(s).`,
              },
              {
                status: 429,
                headers: {
                  'Retry-After': Math.ceil(
                    (rateLimitResult.resetAt.getTime() - Date.now()) / 1000
                  ).toString(),
                  'X-RateLimit-Limit': '20',
                  'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                  'X-RateLimit-Reset': rateLimitResult.resetAt.toISOString(),
                },
              }
            );
          }
        }
      } else {
        const rateLimitResult = await checkRateLimit(identifier, rateLimitEndpoint);
        
        if (!rateLimitResult.allowed) {
          await logWarn('rate_limit', 'Rate limit exceeded', {
            userId: user?.id,
            identifier,
            endpoint: request.nextUrl.pathname,
          });
          
          return NextResponse.json(
            {
              error: `Rate limit exceeded. Please try again in ${Math.ceil(
                (rateLimitResult.resetAt.getTime() - Date.now()) / 1000 / 60
              )} minute(s).`,
            },
            {
              status: 429,
              headers: {
                'Retry-After': Math.ceil(
                  (rateLimitResult.resetAt.getTime() - Date.now()) / 1000
                ).toString(),
                'X-RateLimit-Limit': '60',
                'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                'X-RateLimit-Reset': rateLimitResult.resetAt.toISOString(),
              },
            }
          );
        }
      }
    }

    // Execute handler
    const result = await handler(request, user);

    // If result is already a NextResponse, return it
    if (result instanceof NextResponse) {
      return result;
    }

    // Otherwise, wrap in JSON response
    return NextResponse.json(result);
  } catch (error) {
    const sanitized = sanitizeErrorResponse(error, 'api', false);
    
    // Log error
    await logWarn('api', 'API route error', {
      path: request.nextUrl.pathname,
      method: request.method,
      error: sanitized.technicalDetails || error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      { error: sanitized.message },
      { status: 500 }
    );
  }
}

