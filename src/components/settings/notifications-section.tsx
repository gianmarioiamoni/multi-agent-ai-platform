/**
 * Notifications Section Component
 * Main composition component for notification preferences
 * Following SRP: Only handles component composition
 */

'use client';

import { Card, CardContent } from '@/components/ui/card';
import type { NotificationSettings } from '@/types/settings.types';
import { useNotificationsSection } from '@/hooks/settings/use-notifications-section';
import { NotificationsSectionHeader } from './notifications-section/notifications-section-header';
import { NotificationsSectionToggle } from './notifications-section/notifications-section-toggle';
import { NotificationsSectionActions } from './notifications-section/notifications-section-actions';

interface NotificationsSectionProps {
  notifications: NotificationSettings;
  onUpdate: (notifications: Partial<NotificationSettings>) => Promise<void>;
  isSaving: boolean;
}

export const NotificationsSection = ({
  notifications,
  onUpdate,
  isSaving,
}: NotificationsSectionProps) => {
  const { localNotifications, hasChanges, handleToggle, handleSave } =
    useNotificationsSection({ notifications, onUpdate });

  return (
    <Card>
      <NotificationsSectionHeader />

      <CardContent className="space-y-4">
        <div className="space-y-4">
          <NotificationsSectionToggle
            id="email-notifications"
            label="Email Notifications"
            description="Receive email notifications about important events"
            checked={localNotifications.email}
            onToggle={() => handleToggle('email')}
          />

          <NotificationsSectionToggle
            id="inapp-notifications"
            label="In-App Notifications"
            description="Show notifications in the application interface"
            checked={localNotifications.inApp}
            onToggle={() => handleToggle('inApp')}
          />

          <NotificationsSectionToggle
            id="workflow-notifications"
            label="Workflow Runs"
            description="Get notified when workflows complete or encounter errors"
            checked={localNotifications.workflowRuns}
            onToggle={() => handleToggle('workflowRuns')}
          />

          <NotificationsSectionToggle
            id="agent-notifications"
            label="Agent Runs"
            description="Get notified when agents complete execution"
            checked={localNotifications.agentRuns}
            onToggle={() => handleToggle('agentRuns')}
          />
        </div>

        <NotificationsSectionActions
          hasChanges={hasChanges}
          isSaving={isSaving}
          onSave={handleSave}
        />
      </CardContent>
    </Card>
  );
};

