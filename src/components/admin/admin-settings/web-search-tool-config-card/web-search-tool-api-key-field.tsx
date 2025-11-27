/**
 * Web Search Tool API Key Field Component
 * Input field for Tavily API key
 * Following SRP: Only handles API key field UI
 */

'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WebSearchToolAPIKeyFieldProps {
  apiKey: string;
  onApiKeyChange: (value: string) => void;
}

export const WebSearchToolAPIKeyField = ({
  apiKey,
  onApiKeyChange,
}: WebSearchToolAPIKeyFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="tavily_api_key" required>Tavily API Key</Label>
      <Input
        id="tavily_api_key"
        type="password"
        value={apiKey}
        onChange={(e) => onApiKeyChange(e.target.value)}
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
  );
};

