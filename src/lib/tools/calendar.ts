/**
 * Calendar Tool
 * Implements Google Calendar functionality
 * Following SRP: Only handles calendar tool logic
 */

import type {
  Tool,
  CalendarEvent,
  ListEventsParams,
  CreateEventParams,
  ToolResult,
} from '@/types/tool.types';
import { getValidGoogleCalendarToken } from '../credentials/google-calendar';
import { getCurrentUser } from '../auth/utils';

const GOOGLE_CALENDAR_API_BASE = 'https://www.googleapis.com/calendar/v3';
const CALENDAR_TIMEOUT = 15000; // 15 seconds

/**
 * List upcoming events from Google Calendar
 */
async function listUpcomingEvents(
  params: ListEventsParams,
  accessToken: string
): Promise<ToolResult<{ events: CalendarEvent[] }>> {
  const startTime = Date.now();

  try {
    const timeMin = params.startDate || new Date().toISOString();
    const timeMax = params.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days default
    const maxResults = params.maxResults || 10;

    const url = new URL(`${GOOGLE_CALENDAR_API_BASE}/calendars/primary/events`);
    url.searchParams.set('timeMin', timeMin);
    url.searchParams.set('timeMax', timeMax);
    url.searchParams.set('maxResults', String(maxResults));
    url.searchParams.set('singleEvents', 'true');
    url.searchParams.set('orderBy', 'startTime');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CALENDAR_TIMEOUT);

    try {
      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          success: false,
          error: `Google Calendar API error: ${response.statusText}`,
          executionTime: Date.now() - startTime,
        };
      }

      const data = await response.json() as {
        items: Array<{
          id: string;
          summary: string;
          start: { dateTime?: string; date?: string };
          end: { dateTime?: string; date?: string };
          attendees?: Array<{ email: string }>;
        }>;
      };

      const events: CalendarEvent[] = data.items.map((item) => ({
        id: item.id,
        title: item.summary || 'Untitled Event',
        start: item.start.dateTime || item.start.date || '',
        end: item.end.dateTime || item.end.date || '',
        attendees: item.attendees?.map((a) => a.email),
      }));

      return {
        success: true,
        data: { events },
        executionTime: Date.now() - startTime,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        error: 'Calendar API request timeout',
        executionTime: Date.now() - startTime,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list events',
      executionTime: Date.now() - startTime,
    };
  }
}

/**
 * Create a new calendar event
 */
async function createCalendarEvent(
  params: CreateEventParams,
  accessToken: string
): Promise<ToolResult<{ event: CalendarEvent }>> {
  const startTime = Date.now();

  try {
    // Get user's timezone (default to Europe/Rome for Italy, handles DST automatically)
    // In a real app, you might want to store user timezone in their profile
    const userTimeZone = process.env.USER_TIMEZONE || 'Europe/Rome';
    
    // Parse dates - if they don't have timezone info, interpret them as user's local time
    // The agent might pass dates like "2024-11-21T15:00:00" which we interpret as 15:00 in user's timezone
    // For validation, we need to convert them to Date objects, but for Google Calendar API,
    // we'll use the original string (without timezone) and let Google interpret it with the timeZone field
    
    // Check if dates have timezone info
    // Note: If the date has "Z" (UTC), we'll strip it and treat it as user's local time
    // This is because the agent might incorrectly add "Z" even when the user meant local time
    const hasTimezone = (dateString: string): boolean => {
      return /[+-]\d{2}:\d{2}$/.test(dateString);
    };
    
    // Normalize date string: if it has "Z", remove it (treat as local time)
    const normalizeDateString = (dateString: string): string => {
      if (dateString.endsWith('Z')) {
        return dateString.slice(0, -1);
      }
      return dateString;
    };
    
    // Normalize date strings (remove "Z" if present, treat as local time)
    const normalizedStartString = normalizeDateString(params.start);
    const normalizedEndString = normalizeDateString(params.end);
    
    const startHasTimezone = hasTimezone(normalizedStartString);
    const endHasTimezone = hasTimezone(normalizedEndString);
    
    // Helper to extract date parts from a formatted date string
    const extractDateParts = (dateString: string): { year: string; month: string; day: string; hour: string; minute: string; second: string } | null => {
      const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/);
      if (!match) {
        return null;
      }
      const [, year, month, day, hour, minute, second] = match;
      return { year, month, day, hour, minute, second };
    };

    // Helper to get timezone offset in milliseconds
    const getTimezoneOffsetMs = (date: Date, timezone: string): number => {
      const formatter = new Intl.DateTimeFormat('en', {
        timeZone: timezone,
        timeZoneName: 'longOffset',
      });
      const offsetParts = formatter.formatToParts(date);
      const offsetStr = offsetParts.find(p => p.type === 'timeZoneName')?.value || 'GMT+00:00';
      const offsetMatch = offsetStr.match(/GMT([+-])(\d{2}):(\d{2})/);
      
      if (offsetMatch) {
        const [, sign, hours, minutes] = offsetMatch;
        return (parseInt(hours) * 60 + parseInt(minutes)) * 60 * 1000 * (sign === '+' ? 1 : -1);
      }
      return 0;
    };

    // For validation, parse dates (if no timezone, assume user's timezone)
    const parseForValidation = (dateString: string, timezone: string): Date => {
      if (hasTimezone(dateString)) {
        return new Date(dateString);
      }
      
      // No timezone - interpret this as the time in the user's timezone
      const parts = extractDateParts(dateString);
      if (!parts) {
        throw new Error(`Invalid date format: ${dateString}`);
      }
      
      // Create a UTC reference date (treating the input as if it were UTC)
      const utcReference = new Date(`${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}Z`);
      
      // Calculate the offset for this timezone at this specific date/time
      // This handles DST automatically
      const offsetMs = getTimezoneOffsetMs(utcReference, timezone);
      
      // Convert: if user says 15:00 in UTC+1, that's 14:00 UTC
      // So we subtract the offset to get the correct UTC time
      return new Date(utcReference.getTime() - offsetMs);
    };
    
    let startDate: Date;
    let endDate: Date;
    
    try {
      startDate = parseForValidation(normalizedStartString, userTimeZone);
      endDate = parseForValidation(normalizedEndString, userTimeZone);
    } catch (error) {
      return {
        success: false,
        error: `Invalid date format: ${error instanceof Error ? error.message : 'Unknown error'}. Expected ISO 8601 format (e.g., 2024-11-21T15:00:00)`,
        executionTime: Date.now() - startTime,
      };
    }
    
    if (isNaN(startDate.getTime())) {
      return {
        success: false,
        error: `Invalid start date format: ${params.start}. Expected ISO 8601 format (e.g., 2024-11-21T15:00:00)`,
        executionTime: Date.now() - startTime,
      };
    }
    
    if (isNaN(endDate.getTime())) {
      return {
        success: false,
        error: `Invalid end date format: ${params.end}. Expected ISO 8601 format (e.g., 2024-11-21T16:00:00)`,
        executionTime: Date.now() - startTime,
      };
    }
    
    if (endDate <= startDate) {
      return {
        success: false,
        error: 'End date must be after start date',
        executionTime: Date.now() - startTime,
      };
    }

    // Check if dates are in the past (with 1 minute buffer for clock differences)
    const now = new Date();
    const buffer = 60000; // 1 minute in milliseconds
    
    if (startDate.getTime() < now.getTime() - buffer) {
      return {
        success: false,
        error: `Start date is in the past: ${params.start}. The event start time must be in the future. Current time: ${now.toISOString()}`,
        executionTime: Date.now() - startTime,
      };
    }

    // Helper to format date parts as ISO string
    const formatDateParts = (parts: Intl.DateTimeFormatPart[]): string => {
      const getPart = (type: string) => parts.find(p => p.type === type)?.value || '';
      return `${getPart('year')}-${getPart('month')}-${getPart('day')}T${getPart('hour')}:${getPart('minute')}:${getPart('second')}`;
    };

    // Format dates for Google Calendar API
    // If the date string doesn't have timezone, use it as-is (Google will interpret it with timeZone field)
    // If it has timezone, convert it to user's timezone
    const formatForGoogleCalendar = (dateString: string, hasTz: boolean, timezone: string): string => {
      if (!hasTz) {
        // No timezone in original - use as-is, Google will interpret it in the specified timeZone
        const match = dateString.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2})/);
        return match ? match[1] : dateString;
      }
      
      // Has timezone - convert to user's timezone
      const date = new Date(dateString);
      const formatter = new Intl.DateTimeFormat('en-CA', {
        timeZone: timezone,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      });
      
      return formatDateParts(formatter.formatToParts(date));
    };

    const normalizedStart = formatForGoogleCalendar(normalizedStartString, startHasTimezone, userTimeZone);
    const normalizedEnd = formatForGoogleCalendar(normalizedEndString, endHasTimezone, userTimeZone);

    const requestPayload = {
      summary: params.title,
      start: {
        dateTime: normalizedStart,
        timeZone: userTimeZone,
      },
      end: {
        dateTime: normalizedEnd,
        timeZone: userTimeZone,
      },
      ...(params.description && { description: params.description }),
      ...(params.attendees && params.attendees.length > 0 && {
        attendees: params.attendees.map((email) => ({ email })),
      }),
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CALENDAR_TIMEOUT);

    try {
      const response = await fetch(
        `${GOOGLE_CALENDAR_API_BASE}/calendars/primary/events`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestPayload),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Failed to create event: ${response.statusText}`;
        
        try {
          const errorData = JSON.parse(errorText);
          if (errorData.error?.message) {
            errorMessage = `Google Calendar API error: ${errorData.error.message}`;
          } else if (errorData.error) {
            errorMessage = `Google Calendar API error: ${JSON.stringify(errorData.error)}`;
          }
        } catch {
          // If error response is not JSON, use the text as is
          if (errorText) {
            errorMessage = `Google Calendar API error: ${errorText.substring(0, 200)}`;
          }
        }
        
        return {
          success: false,
          error: errorMessage,
          executionTime: Date.now() - startTime,
        };
      }

      const eventData = await response.json() as {
        id?: string;
        summary?: string;
        start?: { dateTime?: string; date?: string };
        end?: { dateTime?: string; date?: string };
        attendees?: Array<{ email: string }>;
        error?: {
          message?: string;
          code?: number;
        };
      };

      // Check if the response contains an error
      if (eventData.error) {
        return {
          success: false,
          error: `Google Calendar API error: ${eventData.error.message || JSON.stringify(eventData.error)}`,
          executionTime: Date.now() - startTime,
        };
      }

      // Validate that we got an event ID (required for successful creation)
      if (!eventData.id) {
        return {
          success: false,
          error: 'Google Calendar API returned success but no event ID was provided',
          executionTime: Date.now() - startTime,
        };
      }

      // Helper to create CalendarEvent object
      const createCalendarEventData = (): CalendarEvent => ({
        id: eventData.id!,
        title: eventData.summary || params.title,
        start: eventData.start?.dateTime || eventData.start?.date || normalizedStart,
        end: eventData.end?.dateTime || eventData.end?.date || normalizedEnd,
        attendees: eventData.attendees?.map((a) => a.email),
      });

      // Verify the event was actually created by fetching it back
      try {
        const verifyResponse = await fetch(
          `${GOOGLE_CALENDAR_API_BASE}/calendars/primary/events/${eventData.id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!verifyResponse.ok) {
          return {
            success: false,
            error: `Event was created but could not be verified. Event ID: ${eventData.id}. Status: ${verifyResponse.statusText}`,
            executionTime: Date.now() - startTime,
          };
        }

        const verifiedEvent = await verifyResponse.json() as {
          id?: string;
          status?: string;
        };

        // Check if event was cancelled or deleted
        if (verifiedEvent.status === 'cancelled') {
          return {
            success: false,
            error: 'Event was created but immediately cancelled',
            executionTime: Date.now() - startTime,
          };
        }

        if (!verifiedEvent.id || verifiedEvent.id !== eventData.id) {
          return {
            success: false,
            error: 'Event verification failed: event ID mismatch',
            executionTime: Date.now() - startTime,
          };
        }
      } catch {
        // If verification fails, still return success
        // The event might exist but we couldn't verify it
      }

      return {
        success: true,
        data: { event: createCalendarEventData() },
        executionTime: Date.now() - startTime,
      };
    } finally {
      clearTimeout(timeoutId);
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        error: 'Calendar API request timeout',
        executionTime: Date.now() - startTime,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create event',
      executionTime: Date.now() - startTime,
    };
  }
}

/**
 * Calendar Tool implementation
 */
export const calendarTool: Tool = {
  id: 'calendar',
  name: 'Calendar',
  description:
    'List upcoming calendar events and create new events in Google Calendar. Requires Google Calendar integration. IMPORTANT: When creating events, you MUST calculate dates based on the CURRENT DATE provided in the system context. If the user says "tomorrow", calculate tomorrow\'s date from the current date. If they say "next week", calculate 7 days from the current date. ALWAYS use the current year, never use past years. CRITICAL: When specifying times for calendar events, use ISO 8601 format WITHOUT the "Z" suffix (e.g., 2024-12-01T14:00:00, NOT 2024-12-01T14:00:00Z). The time you specify will be interpreted as the user\'s local timezone (Europe/Rome). If you use "Z", the event will be created at the wrong time. Example: If current date is 2024-11-20 and user says "tomorrow at 14:00", use 2024-11-21T14:00:00 (without Z).',
  
  paramsSchema: {
    type: 'object',
    properties: {
      operation: {
        type: 'string',
        enum: ['list_events', 'create_event'],
        description: 'The calendar operation to perform',
      },
      // For list_events
      startDate: {
        type: 'string',
        format: 'date-time',
        description: 'Start date/time for listing events (ISO 8601)',
      },
      endDate: {
        type: 'string',
        format: 'date-time',
        description: 'End date/time for listing events (ISO 8601)',
      },
      maxResults: {
        type: 'number',
        description: 'Maximum number of events to return',
        default: 10,
      },
      // For create_event
      title: {
        type: 'string',
        description: 'Event title/name',
      },
      start: {
        type: 'string',
        format: 'date-time',
        description: 'Event start date/time in ISO 8601 format WITHOUT timezone suffix (e.g., 2024-12-01T14:00:00, NOT 2024-12-01T14:00:00Z). IMPORTANT: Use the current year (2024 or later), not past years. For "tomorrow", calculate tomorrow\'s date. The time will be interpreted as the user\'s local timezone.',
      },
      end: {
        type: 'string',
        format: 'date-time',
        description: 'Event end date/time in ISO 8601 format WITHOUT timezone suffix (e.g., 2024-12-01T15:00:00, NOT 2024-12-01T15:00:00Z). IMPORTANT: Use the current year (2024 or later), not past years. Must be after start time. The time will be interpreted as the user\'s local timezone.',
      },
      description: {
        type: 'string',
        description: 'Event description',
      },
      attendees: {
        type: 'array',
        items: { type: 'string' },
        description: 'List of attendee email addresses',
      },
    },
    required: ['operation'],
  },

  async execute(params: unknown): Promise<ToolResult<{ events?: CalendarEvent[]; event?: CalendarEvent }>> {
    const startTime = Date.now();

    try {
      // Get current user
      const user = await getCurrentUser();
      if (!user) {
        return {
          success: false,
          error: 'User not authenticated',
          executionTime: Date.now() - startTime,
        };
      }

      const accessToken = await getValidGoogleCalendarToken();
      if (!accessToken) {
        return {
          success: false,
          error:
            'Google Calendar not connected. Please connect your Google Calendar account in Integrations.',
          executionTime: Date.now() - startTime,
        };
      }

      // Validate params
      const calendarParams = params as {
        operation: 'list_events' | 'create_event';
        startDate?: string;
        endDate?: string;
        maxResults?: number;
        title?: string;
        start?: string;
        end?: string;
        description?: string;
        attendees?: string[];
      };

      if (!calendarParams.operation) {
        return {
          success: false,
          error: 'Operation is required',
          executionTime: Date.now() - startTime,
        };
      }

      // Route to appropriate handler
      if (calendarParams.operation === 'list_events') {
        return await listUpcomingEvents(
          {
            startDate: calendarParams.startDate,
            endDate: calendarParams.endDate,
            maxResults: calendarParams.maxResults,
          },
          accessToken
        );
      }

      if (calendarParams.operation === 'create_event') {
        if (!calendarParams.title || !calendarParams.start || !calendarParams.end) {
          return {
            success: false,
            error: 'Title, start, and end are required for creating events',
            executionTime: Date.now() - startTime,
          };
        }

        return await createCalendarEvent(
          {
            title: calendarParams.title,
            start: calendarParams.start,
            end: calendarParams.end,
            description: calendarParams.description,
            attendees: calendarParams.attendees,
          },
          accessToken
        );
      }

      return {
        success: false,
        error: `Unknown operation: ${calendarParams.operation}`,
        executionTime: Date.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Calendar operation failed',
        executionTime: Date.now() - startTime,
      };
    }
  },
};

