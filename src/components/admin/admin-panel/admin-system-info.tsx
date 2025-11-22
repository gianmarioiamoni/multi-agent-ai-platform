/**
 * Admin System Info Component
 * Displays system status and information
 * Following SRP: Only handles system info rendering
 */

export const AdminSystemInfo = () => {
  return (
    <div className="p-6 rounded-lg bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-accent)]/10 border border-[var(--color-primary)]/20">
      <h3 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">
        ℹ️ System Information
      </h3>
      <div className="space-y-1 text-sm text-[var(--color-foreground)]">
        <p>✅ Authentication system active</p>
        <p>✅ Role-based access control enabled</p>
        <p>✅ User management operational</p>
        <p className="text-[var(--color-accent)] font-semibold mt-2">
          ⏭️ Next: Agents & Workflows (Sprint 2)
        </p>
      </div>
    </div>
  );
};

