/**
 * Not Found Page for Workflow Run
 * Shown when a workflow run is not found
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="p-12 text-center max-w-md">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-[var(--color-foreground)] mb-2">
          Workflow Run Not Found
        </h1>
        <p className="text-[var(--color-muted-foreground)] mb-6">
          The workflow run you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
        </p>
        <Link href="/app/runs">
          <Button variant="primary">Back to Runs</Button>
        </Link>
      </Card>
    </div>
  );
}

