/**
 * Dashboard Sprint Progress Component
 * Displays current sprint progress and next steps
 * Following SRP: Only handles sprint progress rendering
 */

export const DashboardSprintProgress = () => {
  return (
    <div className="p-6 rounded-lg bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 border border-[var(--color-primary)]/20">
      <h3 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">
        🎯 Sprint 1 Progress
      </h3>
      <div className="space-y-2 text-[var(--color-foreground)]">
        <p>✅ Authentication and user management</p>
        <p>✅ Google OAuth integration</p>
        <p>✅ Base layout with navigation</p>
        <p className="text-[var(--color-accent)] font-semibold">⏭️ Next: Admin tools and middleware (Week 2)</p>
      </div>
    </div>
  );
};

