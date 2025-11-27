/**
 * Admin Settings Client Component
 * Manages state and renders tool configuration cards
 * Following SRP: Only handles client-side state management
 */

'use client';

import { useState } from 'react';
import type { ToolConfigRow } from '@/types/tool-config.types';

// Tool configuration card components
import { EmailToolConfigCard } from './email-tool-config-card/email-tool-config-card';
import { WebSearchToolConfigCard } from './web-search-tool-config-card';
import { OpenAIToolConfigCard } from './openai-tool-config-card';

interface AdminSettingsClientProps {
  initialConfigs: ToolConfigRow[];
}

export const AdminSettingsClient = ({ initialConfigs }: AdminSettingsClientProps) => {
  const [configs, setConfigs] = useState<ToolConfigRow[]>(initialConfigs);

  const updateConfig = (updatedConfig: ToolConfigRow) => {
    setConfigs((prev) => {
      const existingIndex = prev.findIndex((c) => c.tool_id === updatedConfig.tool_id);
      if (existingIndex >= 0) {
        const newConfigs = [...prev];
        newConfigs[existingIndex] = updatedConfig;
        return newConfigs;
      }
      return [...prev, updatedConfig];
    });
  };

  const getConfig = (toolId: string): ToolConfigRow | null => {
    return configs.find((c) => c.tool_id === toolId) || null;
  };

  return (
    <div className="space-y-6">
      <EmailToolConfigCard
        config={getConfig('email')}
        onConfigUpdated={updateConfig}
      />
      <WebSearchToolConfigCard
        config={getConfig('web_search')}
        onConfigUpdated={updateConfig}
      />
      <OpenAIToolConfigCard
        config={getConfig('openai')}
        onConfigUpdated={updateConfig}
      />
    </div>
  );
};

