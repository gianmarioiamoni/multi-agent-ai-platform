/**
 * Rate Limiter Utility
 * Implements rate limiting using Upstash Redis
 * Following SRP: Only handles rate limiting logic
 */

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

/**
 * Rate limiters for different endpoints
 * Using sliding window algorithm for smooth rate limiting
 * 
 * Prefix format: multi-agent-ai:ratelimit:{endpoint}
 * This ensures no conflicts if sharing the Redis database with other applications
 */
const agentLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
  analytics: true,
  prefix: 'multi-agent-ai:ratelimit:agent:execute',
});

const workflowLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '5 m'), // 5 requests per 5 minutes
  analytics: true,
  prefix: 'multi-agent-ai:ratelimit:workflow:run',
});

// Public API rate limiter (for unauthenticated endpoints)
const publicApiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 m'), // 20 requests per minute
  analytics: true,
  prefix: 'multi-agent-ai:ratelimit:public:api',
});

// General API rate limiter (for authenticated endpoints)
const generalApiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, '1 m'), // 60 requests per minute
  analytics: true,
  prefix: 'multi-agent-ai:ratelimit:api:general',
});

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: Date;
  error?: string;
};

/**
 * Check if a request is within rate limits
 * @param identifier - User ID or IP address making the request
 * @param endpoint - Endpoint identifier (e.g., 'agent:execute', 'workflow:run', 'public:api', 'api:general')
 * @returns Rate limit check result
 */
export async function checkRateLimit(
  identifier: string,
  endpoint: string
): Promise<RateLimitResult> {
  try {
    // Select the appropriate limiter based on endpoint
    let limiter: Ratelimit;
    let windowSeconds: number;

    switch (endpoint) {
      case 'agent:execute':
        limiter = agentLimiter;
        windowSeconds = 60; // 1 minute
        break;
      case 'workflow:run':
        limiter = workflowLimiter;
        windowSeconds = 300; // 5 minutes
        break;
      case 'public:api':
        limiter = publicApiLimiter;
        windowSeconds = 60; // 1 minute
        break;
      case 'api:general':
        limiter = generalApiLimiter;
        windowSeconds = 60; // 1 minute
        break;
      default:
        // Fallback to general API limiter for unknown endpoints
        limiter = generalApiLimiter;
        windowSeconds = 60;
    }

    // Check rate limit using identifier (user ID or IP address)
    const result = await limiter.limit(identifier);

    // Calculate reset time
    const resetAt = new Date(Date.now() + (result.reset || windowSeconds) * 1000);

    return {
      allowed: result.success,
      remaining: result.remaining,
      resetAt,
    };
  } catch (error) {
    // On error, allow the request but log the error
    // This is a fail-open approach to avoid blocking legitimate requests
    console.error('Rate limit check error:', error instanceof Error ? error : new Error(String(error)));

    // If Redis is not configured, allow requests (for development)
    if (
      !process.env.UPSTASH_REDIS_REST_URL ||
      !process.env.UPSTASH_REDIS_REST_TOKEN
    ) {
      console.warn(
        'Upstash Redis not configured. Rate limiting disabled. Please configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN'
      );
      return {
        allowed: true,
        remaining: 10,
        resetAt: new Date(Date.now() + 60000),
        error: 'Rate limiting disabled: Upstash Redis not configured',
      };
    }

    return {
      allowed: true,
      remaining: 0,
      resetAt: new Date(Date.now() + 60000),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get rate limit configuration for an endpoint
 * @deprecated This function is kept for compatibility but rate limits are now managed by Upstash
 */
export function getRateLimitConfig(endpoint: string): {
  maxRequests: number;
  windowMinutes: number;
} {
  switch (endpoint) {
    case 'agent:execute':
      return { maxRequests: 10, windowMinutes: 1 };
    case 'workflow:run':
      return { maxRequests: 5, windowMinutes: 5 };
    case 'public:api':
      return { maxRequests: 20, windowMinutes: 1 };
    case 'api:general':
      return { maxRequests: 60, windowMinutes: 1 };
    default:
      return { maxRequests: 60, windowMinutes: 1 };
  }
}
