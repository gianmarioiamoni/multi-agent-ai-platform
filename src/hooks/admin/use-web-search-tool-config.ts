/**
 * Web Search Tool Configuration Hook
 * Handles web search tool configuration form logic and state
 * Following SRP: Only manages web search tool configuration logic
 */

'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/contexts/toast-context';
import { upsertToolConfig } from '@/lib/admin/tool-config-actions';
import type { ToolConfigRow, WebSearchToolConfig } from '@/types/tool-config.types';

interface UseWebSearchToolConfigProps {
  config: ToolConfigRow | null;
  onConfigUpdated: (config: ToolConfigRow) => void;
}

interface UseWebSearchToolConfigReturn {
  formData: Partial<WebSearchToolConfig>;
  isSaving: boolean;
  updateField: <K extends keyof WebSearchToolConfig>(field: K, value: WebSearchToolConfig[K]) => void;
  toggleEnabled: () => void;
  handleSave: () => Promise<void>;
}

/**
 * Hook for managing web search tool configuration
 */
export function useWebSearchToolConfig({
  config,
  onConfigUpdated,
}: UseWebSearchToolConfigProps): UseWebSearchToolConfigReturn {
  const { addToast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const currentConfig = (config?.config || {}) as Partial<WebSearchToolConfig>;
  const [formData, setFormData] = useState<Partial<WebSearchToolConfig>>({
    provider: currentConfig.provider || 'tavily',
    enabled: config?.enabled ?? true,
    api_key: currentConfig.api_key || '',
    max_results: currentConfig.max_results || 5,
  });

  // Update form data when config changes
  useEffect(() => {
    const updatedConfig = (config?.config || {}) as Partial<WebSearchToolConfig>;
    setFormData({
      provider: updatedConfig.provider || 'tavily',
      enabled: config?.enabled ?? true,
      api_key: updatedConfig.api_key || '',
      max_results: updatedConfig.max_results || 5,
    });
  }, [config]);

  const updateField = <K extends keyof WebSearchToolConfig>(
    field: K,
    value: WebSearchToolConfig[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEnabled = () => {
    setFormData((prev) => ({ ...prev, enabled: !prev.enabled }));
  };

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

  return {
    formData,
    isSaving,
    updateField,
    toggleEnabled,
    handleSave,
  };
}

