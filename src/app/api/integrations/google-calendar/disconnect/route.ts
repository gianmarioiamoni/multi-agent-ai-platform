/**
 * Google Calendar Disconnect API
 * Disconnects Google Calendar integration
 */

import { NextResponse } from 'next/server';
import { disconnectGoogleCalendar } from '@/lib/integrations/actions';

export async function POST() {
  try {
    const result = await disconnectGoogleCalendar();
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to disconnect' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: 'Failed to disconnect' },
      { status: 500 }
    );
  }
}

