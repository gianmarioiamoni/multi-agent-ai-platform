/**
 * Google Calendar Card Header Component
 * Header with icon, title, description, and connection status
 * Following SRP: Only handles header rendering
 */

import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface GoogleCalendarCardHeaderProps {
  isConnected: boolean;
}

export const GoogleCalendarCardHeader = ({ isConnected }: GoogleCalendarCardHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5zm7 4h5v5h-5v-5z" />
            </svg>
            Google Calendar
          </CardTitle>
          <CardDescription>
            Connect your Google Calendar to let agents create and view calendar events
          </CardDescription>
        </div>
        {isConnected ? <span className="px-3 py-1 text-sm font-medium rounded-full bg-green-500/20 text-green-500">
            Connected
          </span> : null}
      </div>
    </CardHeader>
  );
};

