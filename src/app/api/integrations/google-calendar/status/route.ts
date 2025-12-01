/**
 * Google Calendar Integration Status API
 * Returns connection status for Google Calendar
 */

import { type NextRequest } from 'next/server';
import { withApiSecurity } from '@/lib/security/api-security-wrapper';
import { isGoogleCalendarConnected } from '@/lib/integrations/actions';
import { logError } from '@/lib/logging/logger';

export async function GET(request: NextRequest) {
  return withApiSecurity(
    request,
    async (req, user) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      try {
        const connected = await isGoogleCalendarConnected();
        return { connected };
      } catch (error) {
        await logError(
          'api',
          'Error checking Google Calendar connection status',
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

