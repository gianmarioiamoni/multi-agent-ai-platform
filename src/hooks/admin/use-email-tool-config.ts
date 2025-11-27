/**
 * Email Tool Configuration Hook
 * Handles email tool configuration form logic and state
 * Following SRP: Only manages email tool configuration logic
 */

'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/contexts/toast-context';
import { upsertToolConfig } from '@/lib/admin/tool-config-actions';
import type { ToolConfigRow, EmailToolConfig } from '@/types/tool-config.types';

interface UseEmailToolConfigProps {
  config: ToolConfigRow | null;
  onConfigUpdated: (config: ToolConfigRow) => void;
}

interface UseEmailToolConfigReturn {
  formData: Partial<EmailToolConfig>;
  isSaving: boolean;
  isProviderSMTP: boolean;
  updateField: <K extends keyof EmailToolConfig>(field: K, value: EmailToolConfig[K]) => void;
  toggleEnabled: () => void;
  setProvider: (provider: EmailToolConfig['provider']) => void;
  handleSave: () => Promise<void>;
}

/**
 * Hook for managing email tool configuration
 */
export function useEmailToolConfig({
  config,
  onConfigUpdated,
}: UseEmailToolConfigProps): UseEmailToolConfigReturn {
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

  // Update form data when config changes
  useEffect(() => {
    const updatedConfig = (config?.config || {}) as Partial<EmailToolConfig>;
    setFormData({
      provider: updatedConfig.provider || 'smtp',
      enabled: config?.enabled ?? true,
      smtp_host: updatedConfig.smtp_host || '',
      smtp_port: updatedConfig.smtp_port || 587,
      smtp_user: updatedConfig.smtp_user || '',
      smtp_password: updatedConfig.smtp_password || '',
      smtp_from_email: updatedConfig.smtp_from_email || '',
      api_key: updatedConfig.api_key || '',
      from_email: updatedConfig.from_email || '',
    });
  }, [config]);

  const updateField = <K extends keyof EmailToolConfig>(
    field: K,
    value: EmailToolConfig[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEnabled = () => {
    setFormData((prev) => ({ ...prev, enabled: !prev.enabled }));
  };

  const setProvider = (provider: EmailToolConfig['provider']) => {
    setFormData((prev) => ({ ...prev, provider }));
  };

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

  return {
    formData,
    isSaving,
    isProviderSMTP,
    updateField,
    toggleEnabled,
    setProvider,
    handleSave,
  };
}

