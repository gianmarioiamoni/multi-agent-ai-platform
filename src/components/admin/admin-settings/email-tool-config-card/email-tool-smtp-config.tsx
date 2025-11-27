/**
 * Email Tool SMTP Config Component
 * Form fields for SMTP configuration
 * Following SRP: Only handles SMTP configuration UI
 */

'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { EmailToolConfig } from '@/types/tool-config.types';

interface EmailToolSMTPConfigProps {
  formData: Partial<EmailToolConfig>;
  onFieldChange: <K extends keyof EmailToolConfig>(field: K, value: EmailToolConfig[K]) => void;
}

export const EmailToolSMTPConfig = ({
  formData,
  onFieldChange,
}: EmailToolSMTPConfigProps) => {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="smtp_host" required>SMTP Host</Label>
          <Input
            id="smtp_host"
            type="text"
            value={formData.smtp_host || ''}
            onChange={(e) => onFieldChange('smtp_host', e.target.value)}
            placeholder="smtp.example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="smtp_port" required>SMTP Port</Label>
          <Input
            id="smtp_port"
            type="number"
            value={formData.smtp_port || ''}
            onChange={(e) => onFieldChange('smtp_port', parseInt(e.target.value, 10))}
            placeholder="587"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="smtp_user" required>SMTP User</Label>
        <Input
          id="smtp_user"
          type="text"
          value={formData.smtp_user || ''}
          onChange={(e) => onFieldChange('smtp_user', e.target.value)}
          placeholder="user@example.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="smtp_password" required>SMTP Password</Label>
        <Input
          id="smtp_password"
          type="password"
          value={formData.smtp_password || ''}
          onChange={(e) => onFieldChange('smtp_password', e.target.value)}
          placeholder="••••••••"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="smtp_from_email">From Email</Label>
        <Input
          id="smtp_from_email"
          type="email"
          value={formData.smtp_from_email || ''}
          onChange={(e) => onFieldChange('smtp_from_email', e.target.value)}
          placeholder="noreply@example.com"
        />
      </div>
    </>
  );
};

