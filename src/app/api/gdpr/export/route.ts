/**
 * GDPR Data Export API Route
 * Provides downloadable JSON file of all user data
 * Implements Right to Access (Article 15) and Right to Data Portability (Article 20)
 */

import { NextResponse } from 'next/server';
import { exportUserData } from '@/lib/gdpr/data-export';

export const dynamic = 'force-dynamic';

export async function GET() {
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
    console.error('Error in GDPR export API:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}

