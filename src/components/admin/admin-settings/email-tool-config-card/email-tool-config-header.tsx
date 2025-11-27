/**
 * Email Tool Config Header Component
 * Header with title, description, and enabled toggle
 * Following SRP: Only handles header rendering
 */

'use client';

import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { EmailToolConfig } from '@/types/tool-config.types';

interface EmailToolConfigHeaderProps {
  enabled: boolean;
  onToggle: () => void;
}

export const EmailToolConfigHeader = ({
  enabled,
  onToggle,
}: EmailToolConfigHeaderProps) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <div>
          <CardTitle>Email Tool</CardTitle>
          <CardDescription>
            Configure email sending provider. Supports SMTP or Resend API.
          </CardDescription>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={onToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 ${
            enabled
              ? 'bg-[var(--color-primary)]'
              : 'bg-[var(--color-muted)]'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </CardHeader>
  );
};

