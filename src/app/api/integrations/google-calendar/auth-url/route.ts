/**
 * Google Calendar OAuth URL API
 * Returns the OAuth authorization URL for Google Calendar
 */

import { NextResponse } from 'next/server';
import { getGoogleCalendarAuthUrlAction } from '@/lib/integrations/actions';

export async function GET() {
  try {
    const result = await getGoogleCalendarAuthUrlAction();
    
    if ('error' in result) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: result.url });
  } catch (error) {
    console.error('[Integrations API] Error getting auth URL:', error);
    return NextResponse.json(
      { error: 'Failed to get authorization URL' },
      { status: 500 }
    );
  }
}

