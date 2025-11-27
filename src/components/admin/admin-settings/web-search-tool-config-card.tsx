/**
 * Web Search Tool Configuration Card Component
 * Form for configuring web search tool settings (Tavily)
 * Following SRP: Only handles web search tool configuration UI
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/contexts/toast-context';
import { upsertToolConfig } from '@/lib/admin/tool-config-actions';
import type { ToolConfigRow, WebSearchToolConfig } from '@/types/tool-config.types';

interface WebSearchToolConfigCardProps {
  config: ToolConfigRow | null;
  onConfigUpdated: (config: ToolConfigRow) => void;
}

export const WebSearchToolConfigCard = ({
  config,
  onConfigUpdated,
}: WebSearchToolConfigCardProps) => {
  const { addToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const currentConfig = (config?.config || {}) as Partial<WebSearchToolConfig>;
  const [formData, setFormData] = useState<Partial<WebSearchToolConfig>>({
    provider: currentConfig.provider || 'tavily',
    enabled: config?.enabled ?? true,
    api_key: currentConfig.api_key || '',
    max_results: currentConfig.max_results || 5,
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { data, error } = await upsertToolConfig({
        tool_id: 'web_search',
        config: formData as WebSearchToolConfig,
        enabled: formData.enabled ?? true,
      });

      if (error || !data) {
        addToast('error', 'Error', error || 'Failed to save web search configuration');
        return;
      }

      onConfigUpdated(data);
      addToast('success', 'Success', 'Web search configuration saved successfully');
    } catch (error) {
      console.error('Error saving web search config:', error);
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
            <CardTitle>Web Search Tool</CardTitle>
            <CardDescription>
              Configure web search provider. Currently supports Tavily API.
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
          <Label htmlFor="tavily_api_key" required>Tavily API Key</Label>
          <Input
            id="tavily_api_key"
            type="password"
            value={formData.api_key || ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, api_key: e.target.value }))}
            placeholder="tvly-xxxxxxxxxxxxx"
          />
          <p className="text-xs text-[var(--color-muted-foreground)]">
            Get your API key from{' '}
            <a
              href="https://tavily.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-primary)] hover:underline"
            >
              tavily.com
            </a>
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_results">Max Results</Label>
          <Input
            id="max_results"
            type="number"
            value={formData.max_results || 5}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, max_results: parseInt(e.target.value, 10) }))
            }
            min={1}
            max={20}
          />
          <p className="text-xs text-[var(--color-muted-foreground)]">
            Maximum number of search results to return (1-20)
          </p>
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

