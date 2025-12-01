/**
 * Integrations Page
 * Manage external service integrations
 * Following SRP: Only handles page layout and data fetching
 */

import type { Metadata } from 'next';
import { IntegrationsClient } from '@/components/integrations/integrations-client';

// Force dynamic rendering since this page uses cookies (auth) to fetch user-specific data
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Integrations',
  description: 'Manage external service integrations',
};

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-[var(--color-foreground)]">Integrations</h1>
        <p className="text-[var(--color-muted-foreground)] mt-2">
          Connect external services and tools to enable advanced agent capabilities
        </p>
      </div>

      <IntegrationsClient />
    </div>
  );
}
