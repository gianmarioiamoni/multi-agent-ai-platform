/**
 * Web Search Tool Max Results Field Component
 * Input field for maximum search results
 * Following SRP: Only handles max results field UI
 */

'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WebSearchToolMaxResultsFieldProps {
  maxResults: number;
  onMaxResultsChange: (value: number) => void;
}

export const WebSearchToolMaxResultsField = ({
  maxResults,
  onMaxResultsChange,
}: WebSearchToolMaxResultsFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="max_results">Max Results</Label>
      <Input
        id="max_results"
        type="number"
        value={maxResults}
        onChange={(e) => onMaxResultsChange(parseInt(e.target.value, 10))}
        min={1}
        max={20}
      />
      <p className="text-xs text-[var(--color-muted-foreground)]">
        Maximum number of search results to return (1-20)
      </p>
    </div>
  );
};

