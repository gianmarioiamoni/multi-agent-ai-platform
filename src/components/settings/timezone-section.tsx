/**
 * Timezone Section Component
 * Timezone preference selector
 * Following SRP: Only handles timezone setting UI
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface TimezoneSectionProps {
  timezone: string;
  onUpdate: (timezone: string) => Promise<void>;
  isSaving: boolean;
}

const COMMON_TIMEZONES = [
  { value: 'Europe/Rome', label: 'Rome (CET/CEST)' },
  { value: 'Europe/London', label: 'London (GMT/BST)' },
  { value: 'Europe/Paris', label: 'Paris (CET/CEST)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)' },
  { value: 'America/New_York', label: 'New York (EST/EDT)' },
  { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)' },
  { value: 'America/Chicago', label: 'Chicago (CST/CDT)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT/AEST)' },
  { value: 'UTC', label: 'UTC' },
];

export const TimezoneSection = ({ timezone, onUpdate, isSaving }: TimezoneSectionProps) => {
  const [selectedTimezone, setSelectedTimezone] = useState(timezone);
  const [hasChanges, setHasChanges] = useState(false);

  const handleTimezoneChange = (newTimezone: string) => {
    setSelectedTimezone(newTimezone);
    setHasChanges(newTimezone !== timezone);
  };

  const handleSave = async () => {
    await onUpdate(selectedTimezone);
    setHasChanges(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Timezone</CardTitle>
        <CardDescription>
          Set your timezone for accurate date and time in calendar events and reports
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="timezone">Select Timezone</Label>
          <select
            id="timezone"
            value={selectedTimezone}
            onChange={(e) => handleTimezoneChange(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            {COMMON_TIMEZONES.map((tz) => (
              <option key={tz.value} value={tz.value}>
                {tz.label}
              </option>
            ))}
          </select>
        </div>

        {hasChanges ? <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={isSaving}
              variant="primary"
              size="sm"
            >
              {isSaving ? 'Saving...' : 'Save Timezone'}
            </Button>
          </div> : null}
      </CardContent>
    </Card>
  );
};

