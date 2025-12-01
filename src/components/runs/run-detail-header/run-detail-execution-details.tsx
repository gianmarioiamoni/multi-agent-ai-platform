/**
 * Run Detail Execution Details Component
 * Card with execution details (grid, input, output, error)
 * Following SRP: Only handles execution details card rendering
 */

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RunDetailExecutionGrid } from './run-detail-execution-grid';
import { RunDetailExecutionInput } from './run-detail-execution-input';
import { RunDetailExecutionOutput } from './run-detail-execution-output';
import { RunDetailExecutionError } from './run-detail-execution-error';

interface RunDetailExecutionDetailsProps {
  startedAt: string;
  finishedAt: string;
  duration: string;
  input: string | null;
  output: string | null;
  error: string | null;
}

export const RunDetailExecutionDetails = ({
  startedAt,
  finishedAt,
  duration,
  input,
  output,
  error,
}: RunDetailExecutionDetailsProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Execution Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <RunDetailExecutionGrid
          startedAt={startedAt}
          finishedAt={finishedAt}
          duration={duration}
        />

        {input ? <RunDetailExecutionInput input={input} /> : null}

        {output ? <RunDetailExecutionOutput output={output} /> : null}

        {error ? <RunDetailExecutionError error={error} /> : null}
      </CardContent>
    </Card>
  );
};

