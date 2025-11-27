/**
 * Email Tool Configuration Card Component
 * Main composition component for email tool configuration
 * Following SRP: Only handles component composition
 */

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { useEmailToolConfig } from '@/hooks/admin/use-email-tool-config';
import { EmailToolConfigHeader } from './email-tool-config-header';
import { EmailToolProviderSelector } from './email-tool-provider-selector';
import { EmailToolSMTPConfig } from './email-tool-smtp-config';
import { EmailToolAPIProviderConfig } from './email-tool-api-provider-config';
import { EmailToolConfigActions } from './email-tool-config-actions';
import type { ToolConfigRow } from '@/types/tool-config.types';

interface EmailToolConfigCardProps {
  config: ToolConfigRow | null;
  onConfigUpdated: (config: ToolConfigRow) => void;
}

export const EmailToolConfigCard = ({ config, onConfigUpdated }: EmailToolConfigCardProps) => {
  const {
    formData,
    isSaving,
    isProviderSMTP,
    updateField,
    toggleEnabled,
    setProvider,
    handleSave,
  } = useEmailToolConfig({ config, onConfigUpdated });

  return (
    <Card>
      <EmailToolConfigHeader enabled={formData.enabled ?? true} onToggle={toggleEnabled} />

      <CardContent className="space-y-4">
        <EmailToolProviderSelector
          provider={formData.provider || 'smtp'}
          onProviderChange={setProvider}
        />

        {isProviderSMTP ? (
          <EmailToolSMTPConfig formData={formData} onFieldChange={updateField} />
        ) : (
          <EmailToolAPIProviderConfig formData={formData} onFieldChange={updateField} />
        )}

        <EmailToolConfigActions isSaving={isSaving} onSave={handleSave} />
      </CardContent>
    </Card>
  );
};

