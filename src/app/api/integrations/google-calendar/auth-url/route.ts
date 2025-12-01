/**
 * Google Calendar OAuth URL API
 * Returns the OAuth authorization URL for Google Calendar
 */

import { type NextRequest, NextResponse } from 'next/server';
import { withApiSecurity } from '@/lib/security/api-security-wrapper';
import { getGoogleCalendarAuthUrlAction } from '@/lib/integrations/actions';
import { logError } from '@/lib/logging/logger';

export async function GET(request: NextRequest) {
  return withApiSecurity(
    request,
    async (req, user) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      try {
        const result = await getGoogleCalendarAuthUrlAction();
        
        if ('error' in result) {
          await logError('api', 'Failed to get Google Calendar auth URL', new Error(result.error), {
            userId: user.id,
            provider: 'google_calendar',
            category: 'integration',
          });
          return NextResponse.json(
            { error: result.error },
            { status: 500 }
          );
        }

        return { url: result.url };
      } catch (error) {
        await logError(
          'api',
          'Error getting Google Calendar auth URL',
          error instanceof Error ? error : new Error(String(error)),
          {
            provider: 'google_calendar',
            userId: user.id,
            category: 'integration',
          }
        );
        throw error;
      }
    },
    {
      requireAuth: true,
      rateLimitEndpoint: 'api:general',
    }
  );
}

