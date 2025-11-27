/**
 * Web Search Tool Configuration Card Component
 * Main composition component for web search tool configuration
 * Following SRP: Only handles component composition
 */

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useWebSearchToolConfig } from '@/hooks/admin/use-web-search-tool-config';
import { WebSearchToolConfigHeader } from './web-search-tool-config-header';
import { WebSearchToolAPIKeyField } from './web-search-tool-api-key-field';
import { WebSearchToolMaxResultsField } from './web-search-tool-max-results-field';
import { WebSearchToolConfigActions } from './web-search-tool-config-actions';
import type { ToolConfigRow } from '@/types/tool-config.types';

interface WebSearchToolConfigCardProps {
  config: ToolConfigRow | null;
  onConfigUpdated: (config: ToolConfigRow) => void;
}

export const WebSearchToolConfigCard = ({
  config,
  onConfigUpdated,
}: WebSearchToolConfigCardProps) => {
  const { formData, isSaving, updateField, toggleEnabled, handleSave } = useWebSearchToolConfig({
    config,
    onConfigUpdated,
  });

  return (
    <Card>
      <WebSearchToolConfigHeader
        enabled={formData.enabled ?? true}
        onToggle={toggleEnabled}
      />

      <CardContent className="space-y-4">
        <WebSearchToolAPIKeyField
          apiKey={formData.api_key || ''}
          onApiKeyChange={(value) => updateField('api_key', value)}
        />

        <WebSearchToolMaxResultsField
          maxResults={formData.max_results || 5}
          onMaxResultsChange={(value) => updateField('max_results', value)}
        />

        <WebSearchToolConfigActions isSaving={isSaving} onSave={handleSave} />
      </CardContent>
    </Card>
  );
};

