/**
 * Dashboard Quick Actions Component
 * Displays quick action buttons
 * Following SRP: Only handles quick actions rendering
 */

interface QuickAction {
  label: string;
  href: string;
  soon: boolean;
}

const QUICK_ACTIONS: QuickAction[] = [
  { label: 'Create New Agent', href: '#', soon: true },
  { label: 'Build Workflow', href: '#', soon: true },
  { label: 'View Integrations', href: '#', soon: true },
];

export const DashboardQuickActions = () => {
  return (
    <div className="p-6 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
      <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-4">
        🚀 Quick Actions
      </h2>
      <div className="space-y-3">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action.label}
            className="w-full px-4 py-3 text-left rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-accent)]/10 hover:border-[var(--color-accent)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={action.soon}
          >
            <span className="text-[var(--color-foreground)]">{action.label}</span>
            {action.soon && (
              <span className="ml-2 text-xs text-[var(--color-muted-foreground)]">
                (Coming Soon)
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

