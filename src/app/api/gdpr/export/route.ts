/**
 * GDPR Data Export API Route
 * Provides downloadable JSON file of all user data
 * Implements Right to Access (Article 15) and Right to Data Portability (Article 20)
 */

import { type NextRequest, NextResponse } from 'next/server';
import { withApiSecurity } from '@/lib/security/api-security-wrapper';
import { exportUserData } from '@/lib/gdpr/data-export';
import { logError } from '@/lib/logging/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  return withApiSecurity(
    request,
    async (req, user) => {
      if (!user) {
        throw new Error('User not authenticated');
      }

      try {
        const result = await exportUserData();

        if ('error' in result) {
          return NextResponse.json(
            { error: result.error },
            { status: 401 }
          );
        }

        // Generate filename with timestamp
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `user-data-export-${timestamp}.json`;

        // Return JSON file as downloadable response
        return new NextResponse(JSON.stringify(result, null, 2), {
          headers: {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="${filename}"`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        });
      } catch (error) {
        await logError(
          'api',
          'Error in GDPR data export API',
          error instanceof Error ? error : new Error(String(error)),
          {
            endpoint: '/api/gdpr/export',
            userId: user.id,
            category: 'gdpr',
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

