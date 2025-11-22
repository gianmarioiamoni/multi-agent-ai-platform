/**
 * Admin Stats Grid Component
 * Displays platform statistics in a grid
 * Following SRP: Only handles stats grid rendering
 */

interface StatsData {
  totalUsers: number;
  roleStats: {
    admin: number;
    user: number;
  };
  recentUsers: number;
}

interface AdminStatsGridProps {
  stats: StatsData;
}

export const AdminStatsGrid = ({ stats }: AdminStatsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Users */}
      <div className="p-6 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-[var(--color-muted-foreground)] uppercase">
            Total Users
          </h3>
          <span className="text-2xl">👥</span>
        </div>
        <p className="text-3xl font-bold text-[var(--color-foreground)]">
          {stats.totalUsers}
        </p>
      </div>

      {/* Admins */}
      <div className="p-6 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-[var(--color-muted-foreground)] uppercase">
            Admins
          </h3>
          <span className="text-2xl">👑</span>
        </div>
        <p className="text-3xl font-bold text-[var(--color-foreground)]">
          {stats.roleStats.admin}
        </p>
      </div>

      {/* New Users (7 days) */}
      <div className="p-6 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-[var(--color-muted-foreground)] uppercase">
            New (7 days)
          </h3>
          <span className="text-2xl">📈</span>
        </div>
        <p className="text-3xl font-bold text-[var(--color-foreground)]">
          {stats.recentUsers}
        </p>
      </div>
    </div>
  );
};

