/**
 * Workflow Not Found Page
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function WorkflowNotFound() {
  return (
    <div className="container mx-auto py-12">
      <Card className="p-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Workflow Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The workflow you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
        </p>
        <Link href="/app/workflows">
          <Button>Back to Workflows</Button>
        </Link>
      </Card>
    </div>
  );
}

