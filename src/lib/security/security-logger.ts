/**
 * Security Logger
 * Specialized logging for security events
 * Following SRP: Only handles security event logging
 */

'use server';

import { logWarn, logError } from '@/lib/logging/logger';
import { getCurrentUser } from '@/lib/auth/utils';
import type { NextRequest } from 'next/server';

export type SecurityEventType =
  | 'unauthorized_access'
  | 'failed_login'
  | 'rate_limit_exceeded'
  | 'suspicious_activity'
  | 'csrf_token_mismatch'
  | 'invalid_token'
  | 'privilege_escalation_attempt'
  | 'sql_injection_attempt'
  | 'xss_attempt'
  | 'path_traversal_attempt';

export interface SecurityEvent {
  type: SecurityEventType;
  userId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  path?: string;
  method?: string;
  details?: Record<string, unknown>;
}

/**
 * Log a security event
 */
export async function logSecurityEvent(event: SecurityEvent): Promise<void> {
  const context: Record<string, unknown> = {
    securityEventType: event.type,
    ...event.details,
  };
  
  // Add userId if provided in event or get from current user
  if (event.userId) {
    context.userId = event.userId;
  } else {
    const user = await getCurrentUser();
    if (user) {
      context.userId = user.id;
    }
  }
  
  if (event.ipAddress) {
    context.ipAddress = event.ipAddress;
  }
  
  if (event.userAgent) {
    context.userAgent = event.userAgent;
  }
  
  if (event.path) {
    context.path = event.path;
  }
  
  if (event.method) {
    context.method = event.method;
  }
  
  // Use warn level for security events to ensure they're visible
  await logWarn(
    'security',
    `Security event: ${event.type}`,
    context
  );
  
  // For critical events, also log as error
  const criticalEvents: SecurityEventType[] = [
    'privilege_escalation_attempt',
    'sql_injection_attempt',
    'xss_attempt',
    'path_traversal_attempt',
  ];
  
  if (criticalEvents.includes(event.type)) {
    await logError(
      'security',
      `Critical security event: ${event.type}`,
      new Error(`Security violation: ${event.type}`),
      context
    );
  }
}

/**
 * Extract client information from request
 */
export function extractClientInfo(request: NextRequest): {
  ipAddress: string | null;
  userAgent: string | null;
} {
  // Get IP address from headers (considering proxies)
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ipAddress = forwardedFor?.split(',')[0]?.trim() || realIp || null;
  
  const userAgent = request.headers.get('user-agent') || null;
  
  return { ipAddress, userAgent };
}

/**
 * Log unauthorized access attempt
 */
export async function logUnauthorizedAccess(
  request: NextRequest,
  path: string,
  reason?: string
): Promise<void> {
  const { ipAddress, userAgent } = extractClientInfo(request);
  
  await logSecurityEvent({
    type: 'unauthorized_access',
    ipAddress,
    userAgent,
    path,
    method: request.method,
    details: {
      reason: reason || 'Authentication required',
    },
  });
}

/**
 * Log failed login attempt
 */
export async function logFailedLogin(
  request: NextRequest,
  email?: string,
  reason?: string
): Promise<void> {
  const { ipAddress, userAgent } = extractClientInfo(request);
  
  await logSecurityEvent({
    type: 'failed_login',
    ipAddress,
    userAgent,
    path: request.nextUrl.pathname,
    method: request.method,
    details: {
      email: email ? email.substring(0, 3) + '***' : undefined, // Partial email for privacy
      reason: reason || 'Invalid credentials',
    },
  });
}

/**
 * Log CSRF token mismatch
 */
export async function logCsrfMismatch(
  request: NextRequest,
  path: string
): Promise<void> {
  const { ipAddress, userAgent } = extractClientInfo(request);
  
  await logSecurityEvent({
    type: 'csrf_token_mismatch',
    ipAddress,
    userAgent,
    path,
    method: request.method,
    details: {
      message: 'CSRF token validation failed',
    },
  });
}

/**
 * Log CSRF token mismatch from server action
 * Simplified version for server actions that don't have NextRequest
 */
export async function logCsrfMismatchFromAction(
  path: string,
  userId?: string | null
): Promise<void> {
  await logSecurityEvent({
    type: 'csrf_token_mismatch',
    userId,
    path,
    method: 'POST',
    details: {
      message: 'CSRF token validation failed in server action',
    },
  });
}

/**
 * Detect and log potential security threats
 */
export async function detectAndLogThreats(
  request: NextRequest,
  body?: unknown
): Promise<boolean> {
  const { ipAddress, userAgent } = extractClientInfo(request);
  const path = request.nextUrl.pathname;
  const bodyString = body ? JSON.stringify(body) : '';
  const queryString = request.nextUrl.search;
  const fullInput = `${path}${queryString}${bodyString}`.toLowerCase();
  
  let threatDetected = false;
  
  // SQL Injection patterns
  const sqlPatterns = [
    /(\bunion\b.*\bselect\b)/i,
    /(\bselect\b.*\bfrom\b)/i,
    /(\bdrop\b.*\btable\b)/i,
    /(\binsert\b.*\binto\b)/i,
    /(\bdelete\b.*\bfrom\b)/i,
    /('|(\\')|(;)|(--)|(\/\*)|(\*\/))/,
  ];
  
  if (sqlPatterns.some((pattern) => pattern.test(fullInput))) {
    await logSecurityEvent({
      type: 'sql_injection_attempt',
      ipAddress,
      userAgent,
      path,
      method: request.method,
      details: {
        detectedPattern: 'SQL injection',
      },
    });
    threatDetected = true;
  }
  
  // XSS patterns
  const xssPatterns = [
    /<script/i,
    /javascript:/i,
    /onerror=/i,
    /onload=/i,
    /onclick=/i,
    /<iframe/i,
    /<img.*src.*javascript/i,
  ];
  
  if (xssPatterns.some((pattern) => pattern.test(fullInput))) {
    await logSecurityEvent({
      type: 'xss_attempt',
      ipAddress,
      userAgent,
      path,
      method: request.method,
      details: {
        detectedPattern: 'XSS',
      },
    });
    threatDetected = true;
  }
  
  // Path traversal patterns
  const pathTraversalPatterns = [
    /\.\.\//,
    /\.\.\\/,
    /\.\.%2f/i,
    /\.\.%5c/i,
  ];
  
  if (pathTraversalPatterns.some((pattern) => pattern.test(fullInput))) {
    await logSecurityEvent({
      type: 'path_traversal_attempt',
      ipAddress,
      userAgent,
      path,
      method: request.method,
      details: {
        detectedPattern: 'Path traversal',
      },
    });
    threatDetected = true;
  }
  
  return threatDetected;
}

