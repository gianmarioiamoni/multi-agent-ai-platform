/**
 * Notifications Section Toggle Component
 * Reusable toggle switch for notification preferences
 * Following SRP: Only handles toggle switch rendering
 */

'use client';

import { Label } from '@/components/ui/label';

interface NotificationsSectionToggleProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onToggle: () => void;
}

export const NotificationsSectionToggle = ({
  id,
  label,
  description,
  checked,
  onToggle,
}: NotificationsSectionToggleProps) => {
  return (
    <div className="flex items-center justify-between py-2">
      <div className="space-y-0.5">
        <Label htmlFor={id} className="text-base font-medium">
          {label}
        </Label>
        <p className="text-sm text-[var(--color-muted-foreground)]">{description}</p>
      </div>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 ${
          checked ? 'bg-[var(--color-primary)]' : 'bg-[var(--color-muted)]'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
            checked ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};

