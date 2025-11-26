/**
 * Notifications Section Component
 * Notification preferences settings
 * Following SRP: Only handles notification settings UI
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { NotificationSettings } from '@/types/settings.types';

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
  const [localNotifications, setLocalNotifications] = useState(notifications);
  const [hasChanges, setHasChanges] = useState(false);

  const handleToggle = (key: keyof NotificationSettings) => {
    const updated = {
      ...localNotifications,
      [key]: !localNotifications[key],
    };
    setLocalNotifications(updated);
    setHasChanges(JSON.stringify(updated) !== JSON.stringify(notifications));
  };

  const handleSave = async () => {
    await onUpdate(localNotifications);
    setHasChanges(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Choose how and when you want to be notified about platform activities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications" className="text-base font-medium">
                Email Notifications
              </Label>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Receive email notifications about important events
              </p>
            </div>
            <button
              type="button"
              id="email-notifications"
              role="switch"
              aria-checked={localNotifications.email}
              onClick={() => handleToggle('email')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 ${
                localNotifications.email
                  ? 'bg-[var(--color-primary)]'
                  : 'bg-[var(--color-muted)]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localNotifications.email ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* In-App Notifications */}
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="inapp-notifications" className="text-base font-medium">
                In-App Notifications
              </Label>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Show notifications in the application interface
              </p>
            </div>
            <button
              type="button"
              id="inapp-notifications"
              role="switch"
              aria-checked={localNotifications.inApp}
              onClick={() => handleToggle('inApp')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 ${
                localNotifications.inApp
                  ? 'bg-[var(--color-primary)]'
                  : 'bg-[var(--color-muted)]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localNotifications.inApp ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Workflow Runs Notifications */}
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="workflow-notifications" className="text-base font-medium">
                Workflow Runs
              </Label>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Get notified when workflows complete or encounter errors
              </p>
            </div>
            <button
              type="button"
              id="workflow-notifications"
              role="switch"
              aria-checked={localNotifications.workflowRuns}
              onClick={() => handleToggle('workflowRuns')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 ${
                localNotifications.workflowRuns
                  ? 'bg-[var(--color-primary)]'
                  : 'bg-[var(--color-muted)]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localNotifications.workflowRuns ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Agent Runs Notifications */}
          <div className="flex items-center justify-between py-2">
            <div className="space-y-0.5">
              <Label htmlFor="agent-notifications" className="text-base font-medium">
                Agent Runs
              </Label>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Get notified when agents complete execution
              </p>
            </div>
            <button
              type="button"
              id="agent-notifications"
              role="switch"
              aria-checked={localNotifications.agentRuns}
              onClick={() => handleToggle('agentRuns')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 ${
                localNotifications.agentRuns
                  ? 'bg-[var(--color-primary)]'
                  : 'bg-[var(--color-muted)]'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  localNotifications.agentRuns ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {hasChanges && (
          <div className="flex justify-end pt-2">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              variant="primary"
              size="sm"
            >
              {isSaving ? 'Saving...' : 'Save Notifications'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

