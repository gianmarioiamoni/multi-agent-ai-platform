/**
 * OpenAI Tool API Key Field Component
 * Input field for OpenAI API key
 * Following SRP: Only handles API key field UI
 */

'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface OpenAIToolAPIKeyFieldProps {
  apiKey: string;
  onApiKeyChange: (value: string) => void;
}

export const OpenAIToolAPIKeyField = ({
  apiKey,
  onApiKeyChange,
}: OpenAIToolAPIKeyFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="openai_api_key" required>OpenAI API Key</Label>
      <Input
        id="openai_api_key"
        type="password"
        value={apiKey}
        onChange={(e) => onApiKeyChange(e.target.value)}
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
  );
};

