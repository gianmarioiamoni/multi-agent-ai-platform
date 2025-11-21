/**
 * Sidebar Footer Component
 * Footer with sprint/project status
 * Following SRP: Only handles footer UI
 */

export const SidebarFooter = () => {
  return (
    <div className="p-4 border-t border-[var(--color-border)]">
      <div className="px-3 py-2 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20">
        <p className="text-xs font-semibold text-[var(--color-accent)] mb-1">
          🚀 Sprint 1 Active
        </p>
        <p className="text-xs text-[var(--color-muted-foreground)]">
          Building core features
        </p>
      </div>
    </div>
  );
};

