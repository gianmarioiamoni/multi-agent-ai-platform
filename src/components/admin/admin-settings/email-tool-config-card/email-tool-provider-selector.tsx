/**
 * Email Tool Provider Selector Component
 * Dropdown for selecting email provider (SMTP, Resend, etc.)
 * Following SRP: Only handles provider selection UI
 */

'use client';

import { Label } from '@/components/ui/label';
import type { EmailToolConfig } from '@/types/tool-config.types';

interface EmailToolProviderSelectorProps {
  provider: EmailToolConfig['provider'];
  onProviderChange: (provider: EmailToolConfig['provider']) => void;
}

export const EmailToolProviderSelector = ({
  provider,
  onProviderChange,
}: EmailToolProviderSelectorProps) => {
  return (
    <div className="space-y-2">
      <Label>Provider</Label>
      <select
        value={provider || 'smtp'}
        onChange={(e) => onProviderChange(e.target.value as EmailToolConfig['provider'])}
        className="flex h-10 w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
      >
        <option value="smtp">SMTP</option>
        <option value="resend">Resend</option>
        <option value="sendgrid">SendGrid</option>
        <option value="mailgun">Mailgun</option>
      </select>
    </div>
  );
};

