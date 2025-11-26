/**
 * Sidebar Footer Component
 * Footer with sprint/project status
 * Following SRP: Only handles footer UI
 */

export const SidebarFooter = () => {
  return (
    <div className="p-4 border-t border-[var(--color-border)]">
      <div className="px-3 py-2 rounded-lg bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20">
        <p className="text-xs font-semibold text-[var(--color-primary)] mb-1">
          🤖 Multi-Agent Platform
        </p>
        <p className="text-xs text-[var(--color-muted-foreground)]">
          Automate your workflows with AI
        </p>
      </div>
    </div>
  );
};

