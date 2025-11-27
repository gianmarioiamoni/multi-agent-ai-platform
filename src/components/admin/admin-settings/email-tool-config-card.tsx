/**
 * Email Tool Configuration Card Component
 * Form for configuring email tool settings (SMTP or Resend)
 * Following SRP: Only handles email tool configuration UI
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/contexts/toast-context';
import { upsertToolConfig } from '@/lib/admin/tool-config-actions';
import type { ToolConfigRow, EmailToolConfig } from '@/types/tool-config.types';

interface EmailToolConfigCardProps {
  config: ToolConfigRow | null;
  onConfigUpdated: (config: ToolConfigRow) => void;
}

export const EmailToolConfigCard = ({ config, onConfigUpdated }: EmailToolConfigCardProps) => {
  const { addToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const currentConfig = (config?.config || {}) as Partial<EmailToolConfig>;
  const [formData, setFormData] = useState<Partial<EmailToolConfig>>({
    provider: currentConfig.provider || 'smtp',
    enabled: config?.enabled ?? true,
    smtp_host: currentConfig.smtp_host || '',
    smtp_port: currentConfig.smtp_port || 587,
    smtp_user: currentConfig.smtp_user || '',
    smtp_password: currentConfig.smtp_password || '',
    smtp_from_email: currentConfig.smtp_from_email || '',
    api_key: currentConfig.api_key || '',
    from_email: currentConfig.from_email || '',
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data, error } = await upsertToolConfig({
        tool_id: 'email',
        config: formData as EmailToolConfig,
        enabled: formData.enabled ?? true,
      });

      if (error || !data) {
        addToast('error', 'Error', error || 'Failed to save email configuration');
        return;
      }

      onConfigUpdated(data);
      addToast('success', 'Success', 'Email configuration saved successfully');
    } catch (error) {
      console.error('Error saving email config:', error);
      addToast('error', 'Error', 'An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  const isProviderSMTP = formData.provider === 'smtp';

  return (
    <Card>
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
            aria-checked={formData.enabled}
            onClick={() => setFormData((prev) => ({ ...prev, enabled: !prev.enabled }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 ${
              formData.enabled
                ? 'bg-[var(--color-primary)]'
                : 'bg-[var(--color-muted)]'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.enabled ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Provider Selection */}
        <div className="space-y-2">
          <Label>Provider</Label>
          <select
            value={formData.provider || 'smtp'}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, provider: e.target.value as EmailToolConfig['provider'] }))
            }
            className="flex h-10 w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
          >
            <option value="smtp">SMTP</option>
            <option value="resend">Resend</option>
            <option value="sendgrid">SendGrid</option>
            <option value="mailgun">Mailgun</option>
          </select>
        </div>

        {/* SMTP Configuration */}
        {isProviderSMTP && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="smtp_host" required>SMTP Host</Label>
                <Input
                  id="smtp_host"
                  type="text"
                  value={formData.smtp_host || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, smtp_host: e.target.value }))}
                  placeholder="smtp.example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="smtp_port" required>SMTP Port</Label>
                <Input
                  id="smtp_port"
                  type="number"
                  value={formData.smtp_port || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, smtp_port: parseInt(e.target.value, 10) }))}
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
                onChange={(e) => setFormData((prev) => ({ ...prev, smtp_user: e.target.value }))}
                placeholder="user@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp_password" required>SMTP Password</Label>
              <Input
                id="smtp_password"
                type="password"
                value={formData.smtp_password || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, smtp_password: e.target.value }))}
                placeholder="••••••••"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp_from_email">From Email</Label>
              <Input
                id="smtp_from_email"
                type="email"
                value={formData.smtp_from_email || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, smtp_from_email: e.target.value }))}
                placeholder="noreply@example.com"
              />
            </div>
          </>
        )}

        {/* API Provider Configuration (Resend, SendGrid, Mailgun) */}
        {!isProviderSMTP && (
          <>
            <div className="space-y-2">
              <Label htmlFor="api_key" required>API Key</Label>
              <Input
                id="api_key"
                type="password"
                value={formData.api_key || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, api_key: e.target.value }))}
                placeholder="re_xxxxxxxxxxxxx"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="from_email" required>From Email</Label>
              <Input
                id="from_email"
                type="email"
                value={formData.from_email || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, from_email: e.target.value }))}
                placeholder="noreply@example.com"
              />
            </div>
          </>
        )}

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} isLoading={isSaving} disabled={isSaving}>
            Save Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

