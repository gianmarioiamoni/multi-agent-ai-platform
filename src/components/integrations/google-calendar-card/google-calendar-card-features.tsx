/**
 * Google Calendar Card Features Component
 * Lists available features when connected
 * Following SRP: Only handles features list rendering
 */

import { CardContent } from '@/components/ui/card';

export const GoogleCalendarCardFeatures = () => {
  return (
    <CardContent>
      <div className="space-y-2">
        <p className="text-sm text-[var(--color-muted-foreground)]">
          When connected, agents can:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-[var(--color-muted-foreground)] ml-2">
          <li>List your upcoming calendar events</li>
          <li>Create new events and meetings</li>
          <li>Manage event attendees</li>
        </ul>
      </div>
    </CardContent>
  );
};

