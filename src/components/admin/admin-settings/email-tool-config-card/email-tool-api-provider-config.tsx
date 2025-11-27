/**
 * Email Tool API Provider Config Component
 * Form fields for API-based provider configuration (Resend, SendGrid, Mailgun)
 * Following SRP: Only handles API provider configuration UI
 */

'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { EmailToolConfig } from '@/types/tool-config.types';

interface EmailToolAPIProviderConfigProps {
  formData: Partial<EmailToolConfig>;
  onFieldChange: <K extends keyof EmailToolConfig>(field: K, value: EmailToolConfig[K]) => void;
}

export const EmailToolAPIProviderConfig = ({
  formData,
  onFieldChange,
}: EmailToolAPIProviderConfigProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="api_key" required>API Key</Label>
        <Input
          id="api_key"
          type="password"
          value={formData.api_key || ''}
          onChange={(e) => onFieldChange('api_key', e.target.value)}
          placeholder="re_xxxxxxxxxxxxx"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="from_email" required>From Email</Label>
        <Input
          id="from_email"
          type="email"
          value={formData.from_email || ''}
          onChange={(e) => onFieldChange('from_email', e.target.value)}
          placeholder="noreply@example.com"
        />
      </div>
    </>
  );
};

