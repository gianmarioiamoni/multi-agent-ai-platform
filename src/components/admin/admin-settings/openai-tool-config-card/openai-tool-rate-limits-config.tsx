/**
 * OpenAI Tool Rate Limits Config Component
 * Input fields for rate limits and max tokens
 * Following SRP: Only handles rate limits configuration UI
 */

'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface OpenAIToolRateLimitsConfigProps {
  rateLimitPerHour: number;
  maxTokensPerRequest: number;
  onRateLimitChange: (value: number) => void;
  onMaxTokensChange: (value: number) => void;
}

export const OpenAIToolRateLimitsConfig = ({
  rateLimitPerHour,
  maxTokensPerRequest,
  onRateLimitChange,
  onMaxTokensChange,
}: OpenAIToolRateLimitsConfigProps) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="rate_limit">Rate Limit (per user/hour)</Label>
        <Input
          id="rate_limit"
          type="number"
          value={rateLimitPerHour}
          onChange={(e) => onRateLimitChange(parseInt(e.target.value, 10))}
          min={1}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="max_tokens">Max Tokens per Request</Label>
        <Input
          id="max_tokens"
          type="number"
          value={maxTokensPerRequest}
          onChange={(e) => onMaxTokensChange(parseInt(e.target.value, 10))}
          min={1}
          max={16000}
        />
      </div>
    </div>
  );
};

