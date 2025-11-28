/**
 * Subscription Expiry Cron Job
 * Called by Vercel Cron (or external scheduler) to process subscription expiries
 * 
 * Cron schedule: Run daily at 2 AM UTC
 * 
 * To configure in Vercel:
 * Add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/subscription-expiry",
 *     "schedule": "0 2 * * *"
 *   }]
 * }
 */

import { NextResponse } from 'next/server';
import { processSubscriptionExpiries } from '@/lib/subscription/expiry-manager';
import { logInfo, logError } from '@/lib/logging/logger';

/**
 * Verify cron secret (if set)
 */
function verifyCronSecret(request: Request): boolean {
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    // No secret configured, allow all (not recommended for production)
    return true;
  }

  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: Request) {
  try {
    // Verify cron secret if configured
    if (!verifyCronSecret(request)) {
      logError('Unauthorized cron job request', {
        hasAuthHeader: !!request.headers.get('authorization'),
      });
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    logInfo('Subscription expiry cron job started');

    const stats = await processSubscriptionExpiries();

    logInfo('Subscription expiry cron job completed', stats);

    return NextResponse.json({
      success: true,
      message: 'Subscription expiry processing completed',
      stats,
    });
  } catch (error) {
    logError('Subscription expiry cron job failed', {
      error: error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process subscription expiries',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// Also support POST for Vercel Cron
export const POST = GET;

