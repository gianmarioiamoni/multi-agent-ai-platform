/**
 * OpenAI Tool Configuration Hook
 * Handles OpenAI tool configuration form logic and state
 * Following SRP: Only manages OpenAI tool configuration logic
 */

'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/contexts/toast-context';
import { upsertToolConfig } from '@/lib/admin/tool-config-actions';
import type { ToolConfigRow, OpenAIToolConfig } from '@/types/tool-config.types';

interface UseOpenAIToolConfigProps {
  config: ToolConfigRow | null;
  onConfigUpdated: (config: ToolConfigRow) => void;
}

interface UseOpenAIToolConfigReturn {
  formData: Partial<OpenAIToolConfig>;
  isSaving: boolean;
  updateField: <K extends keyof OpenAIToolConfig>(field: K, value: OpenAIToolConfig[K]) => void;
  toggleEnabled: () => void;
  handleSave: () => Promise<void>;
}

/**
 * Hook for managing OpenAI tool configuration
 */
export function useOpenAIToolConfig({
  config,
  onConfigUpdated,
}: UseOpenAIToolConfigProps): UseOpenAIToolConfigReturn {
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

  // Update form data when config changes
  useEffect(() => {
    const updatedConfig = (config?.config || {}) as Partial<OpenAIToolConfig>;
    setFormData({
      enabled: config?.enabled ?? true,
      api_key: updatedConfig.api_key || '',
      default_model: updatedConfig.default_model || 'gpt-4o-mini',
      rate_limit_per_user_per_hour: updatedConfig.rate_limit_per_user_per_hour || 100,
      max_tokens_per_request: updatedConfig.max_tokens_per_request || 4000,
    });
  }, [config]);

  const updateField = <K extends keyof OpenAIToolConfig>(
    field: K,
    value: OpenAIToolConfig[K]
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

  return {
    formData,
    isSaving,
    updateField,
    toggleEnabled,
    handleSave,
  };
}

