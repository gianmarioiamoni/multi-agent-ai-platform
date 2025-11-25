/**
 * Integrations Server Actions
 * Server actions for integration management
 * Following SRP: Only handles integration logic
 */

'use server';

import { getGoogleCalendarAuthUrl } from '../credentials/google-calendar';
import { hasActiveCredential, deleteStoredCredential } from '../credentials/actions';

/**
 * Get Google Calendar OAuth URL for connection
 */
export async function getGoogleCalendarAuthUrlAction(): Promise<{ url: string } | { error: string }> {
  try {
    const url = getGoogleCalendarAuthUrl();
    return { url };
  } catch (error) {
    return { error: error instanceof Error ? error.message : 'Failed to get authorization URL' };
  }
}

/**
 * Check if Google Calendar is connected
 */
export async function isGoogleCalendarConnected(): Promise<boolean> {
  return hasActiveCredential('google_calendar');
}

/**
 * Disconnect Google Calendar
 */
export async function disconnectGoogleCalendar(): Promise<{ success: boolean; error: string | null }> {
  return deleteStoredCredential('google_calendar');
}

