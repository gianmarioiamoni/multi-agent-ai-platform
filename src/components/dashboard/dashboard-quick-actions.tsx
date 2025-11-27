/**
 * Dashboard Quick Actions Component
 * Displays quick action buttons
 * Following SRP: Only handles quick actions rendering
 * Server Component - static content with Links only
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface QuickAction {
  label: string;
  href: string;
  icon: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  { label: 'Create New Agent', href: '/app/agents/create', icon: '🤖' },
  { label: 'Build Workflow', href: '/app/workflows/create', icon: '⚡' },
  { label: 'View Integrations', href: '/app/integrations', icon: '🔗' },
];

export const DashboardQuickActions = () => {
  return (
    <div className="p-6 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
      <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-4">
        🚀 Quick Actions
      </h2>
      <div className="space-y-3">
        {QUICK_ACTIONS.map((action) => (
          <Link key={action.label} href={action.href}>
            <Button
              variant="outline"
              className="w-full justify-start text-left h-auto py-3 px-4"
            >
              <span className="mr-2 text-lg">{action.icon}</span>
              <span>{action.label}</span>
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

