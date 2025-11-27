/**
 * Notifications Section Header Component
 * Header with title and description
 * Following SRP: Only handles header rendering
 */

import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const NotificationsSectionHeader = () => {
  return (
    <CardHeader>
      <CardTitle>Notifications</CardTitle>
      <CardDescription>
        Choose how and when you want to be notified about platform activities
      </CardDescription>
    </CardHeader>
  );
};

