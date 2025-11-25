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

    console.error('[Calendar Tool] Error listing events:', error);
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
    const eventData = {
      summary: params.title,
      start: {
        dateTime: params.start,
        timeZone: 'UTC',
      },
      end: {
        dateTime: params.end,
        timeZone: 'UTC',
      },
      description: params.description,
      attendees: params.attendees?.map((email) => ({ email })),
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
          body: JSON.stringify(eventData),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        return {
          success: false,
          error: `Failed to create event: ${response.statusText}`,
          executionTime: Date.now() - startTime,
        };
      }

      const event = await response.json() as {
        id: string;
        summary: string;
        start: { dateTime: string };
        end: { dateTime: string };
        attendees?: Array<{ email: string }>;
      };

      return {
        success: true,
        data: {
          event: {
            id: event.id,
            title: event.summary || params.title,
            start: event.start.dateTime,
            end: event.end.dateTime,
            attendees: event.attendees?.map((a) => a.email),
          },
        },
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

    console.error('[Calendar Tool] Error creating event:', error);
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
    'List upcoming calendar events and create new events in Google Calendar. Requires Google Calendar integration.',
  
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
        description: 'Event start date/time (ISO 8601)',
      },
      end: {
        type: 'string',
        format: 'date-time',
        description: 'Event end date/time (ISO 8601)',
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
    } catch {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Calendar operation failed',
        executionTime: Date.now() - startTime,
      };
    }
  },
};

