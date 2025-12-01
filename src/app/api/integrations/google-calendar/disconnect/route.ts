/**
 * Google Calendar Disconnect API
 * Disconnects Google Calendar integration
 */

import { type NextRequest, NextResponse } from 'next/server';
import { withApiSecurity } from '@/lib/security/api-security-wrapper';
import { disconnectGoogleCalendar } from '@/lib/integrations/actions';
import { logError } from '@/lib/logging/logger';

export async function POST(request: NextRequest) {
  return withApiSecurity(
    request,
    async (req, user) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      try {
        const result = await disconnectGoogleCalendar();
        
        if (!result.success) {
          await logError('integration', 'Failed to disconnect Google Calendar', new Error(result.error || 'Unknown error'), {
            userId: user.id,
            provider: 'google_calendar',
          });
          return NextResponse.json(
            { error: result.error || 'Failed to disconnect' },
            { status: 500 }
          );
        }

        return { success: true };
      } catch (error) {
        await logError(
          'integration',
          'Error disconnecting Google Calendar',
          error instanceof Error ? error : new Error(String(error)),
          {
            provider: 'google_calendar',
            userId: user.id,
          }
        );
        throw error;
      }
    },
    {
      requireAuth: true,
      rateLimitEndpoint: 'api:general',
      checkThreats: true,
    }
  );
}

