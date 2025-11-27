/**
 * OpenAI Tool Configuration Card Component
 * Form for configuring OpenAI settings
 * Following SRP: Only handles OpenAI tool configuration UI
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/contexts/toast-context';
import { upsertToolConfig } from '@/lib/admin/tool-config-actions';
import { AVAILABLE_MODELS } from '@/types/agent.types';
import type { ToolConfigRow, OpenAIToolConfig } from '@/types/tool-config.types';

interface OpenAIToolConfigCardProps {
  config: ToolConfigRow | null;
  onConfigUpdated: (config: ToolConfigRow) => void;
}

export const OpenAIToolConfigCard = ({ config, onConfigUpdated }: OpenAIToolConfigCardProps) => {
  const { addToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const currentConfig = (config?.config || {}) as Partial<OpenAIToolConfig>;
  const [formData, setFormData] = useState<Partial<OpenAIToolConfig>>({
    enabled: config?.enabled ?? true,
    api_key: currentConfig.api_key || '',
    default_model: currentConfig.default_model || 'gpt-4o-mini',
    rate_limit_per_user_per_hour: currentConfig.rate_limit_per_user_per_hour || 100,
    max_tokens_per_request: currentConfig.max_tokens_per_request || 4000,
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data, error } = await upsertToolConfig({
        tool_id: 'openai',
        config: formData as OpenAIToolConfig,
        enabled: formData.enabled ?? true,
      });

      if (error || !data) {
        addToast('error', 'Error', error || 'Failed to save OpenAI configuration');
        return;
      }

      onConfigUpdated(data);
      addToast('success', 'Success', 'OpenAI configuration saved successfully');
    } catch (error) {
      console.error('Error saving OpenAI config:', error);
      addToast('error', 'Error', 'An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>OpenAI Configuration</CardTitle>
            <CardDescription>
              Configure OpenAI API settings and rate limits for all users.
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
        <div className="space-y-2">
          <Label htmlFor="openai_api_key" required>OpenAI API Key</Label>
          <Input
            id="openai_api_key"
            type="password"
            value={formData.api_key || ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, api_key: e.target.value }))}
            placeholder="sk-xxxxxxxxxxxxx"
          />
          <p className="text-xs text-[var(--color-muted-foreground)]">
            Get your API key from{' '}
            <a
              href="https://platform.openai.com/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-primary)] hover:underline"
            >
              platform.openai.com
            </a>
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="default_model">Default Model</Label>
          <select
            id="default_model"
            value={formData.default_model || 'gpt-4o-mini'}
            onChange={(e) => setFormData((prev) => ({ ...prev, default_model: e.target.value }))}
            className="flex h-10 w-full rounded-md border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm"
          >
            {AVAILABLE_MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name} - {model.description}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="rate_limit">Rate Limit (per user/hour)</Label>
            <Input
              id="rate_limit"
              type="number"
              value={formData.rate_limit_per_user_per_hour || 100}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  rate_limit_per_user_per_hour: parseInt(e.target.value, 10),
                }))
              }
              min={1}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max_tokens">Max Tokens per Request</Label>
            <Input
              id="max_tokens"
              type="number"
              value={formData.max_tokens_per_request || 4000}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  max_tokens_per_request: parseInt(e.target.value, 10),
                }))
              }
              min={1}
              max={16000}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} isLoading={isSaving} disabled={isSaving}>
            Save Configuration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

