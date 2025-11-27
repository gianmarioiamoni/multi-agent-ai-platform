/**
 * OpenAI Tool Configuration Card Component
 * Main composition component for OpenAI tool configuration
 * Following SRP: Only handles component composition
 */

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useOpenAIToolConfig } from '@/hooks/admin/use-openai-tool-config';
import { OpenAIToolConfigHeader } from './openai-tool-config-header';
import { OpenAIToolAPIKeyField } from './openai-tool-api-key-field';
import { OpenAIToolDefaultModelSelector } from './openai-tool-default-model-selector';
import { OpenAIToolRateLimitsConfig } from './openai-tool-rate-limits-config';
import { OpenAIToolConfigActions } from './openai-tool-config-actions';
import type { ToolConfigRow } from '@/types/tool-config.types';

interface OpenAIToolConfigCardProps {
  config: ToolConfigRow | null;
  onConfigUpdated: (config: ToolConfigRow) => void;
}

export const OpenAIToolConfigCard = ({ config, onConfigUpdated }: OpenAIToolConfigCardProps) => {
  const { formData, isSaving, updateField, toggleEnabled, handleSave } = useOpenAIToolConfig({
    config,
    onConfigUpdated,
  });

  return (
    <Card>
      <OpenAIToolConfigHeader enabled={formData.enabled ?? true} onToggle={toggleEnabled} />

      <CardContent className="space-y-4">
        <OpenAIToolAPIKeyField
          apiKey={formData.api_key || ''}
          onApiKeyChange={(value) => updateField('api_key', value)}
        />

        <OpenAIToolDefaultModelSelector
          defaultModel={formData.default_model || 'gpt-4o-mini'}
          onModelChange={(value) => updateField('default_model', value)}
        />

        <OpenAIToolRateLimitsConfig
          rateLimitPerHour={formData.rate_limit_per_user_per_hour || 100}
          maxTokensPerRequest={formData.max_tokens_per_request || 4000}
          onRateLimitChange={(value) => updateField('rate_limit_per_user_per_hour', value)}
          onMaxTokensChange={(value) => updateField('max_tokens_per_request', value)}
        />

        <OpenAIToolConfigActions isSaving={isSaving} onSave={handleSave} />
      </CardContent>
    </Card>
  );
};

