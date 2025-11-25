/**
 * Google Calendar Integration Status API
 * Returns connection status for Google Calendar
 */

import { NextResponse } from 'next/server';
import { isGoogleCalendarConnected } from '@/lib/integrations/actions';

export async function GET() {
  try {
    const connected = await isGoogleCalendarConnected();
    return NextResponse.json({ connected });
  } catch (error) {
    console.error('[Integrations API] Error checking status:', error);
    return NextResponse.json(
      { connected: false, error: 'Failed to check connection status' },
      { status: 500 }
    );
  }
}

