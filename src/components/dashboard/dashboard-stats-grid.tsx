/**
 * Dashboard Stats Grid Component
 * Displays dashboard statistics in a grid
 * Following SRP: Only handles stats grid rendering
 */

interface StatCardData {
  label: string;
  value: string;
  icon: string;
}

const STATS_DATA: StatCardData[] = [
  { label: 'Active Agents', value: '0', icon: '🤖' },
  { label: 'Workflows', value: '0', icon: '⚡' },
  { label: 'Runs Today', value: '0', icon: '📊' },
  { label: 'Success Rate', value: '0%', icon: '✅' },
];

export const DashboardStatsGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {STATS_DATA.map((stat) => (
        <div
          key={stat.label}
          className="p-6 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl">{stat.icon}</span>
            <span className="text-xs font-semibold text-[var(--color-muted-foreground)] uppercase">
              {stat.label}
            </span>
          </div>
          <div className="text-3xl font-bold text-[var(--color-foreground)]">
            {stat.value}
          </div>
        </div>
      ))}
    </div>
  );
};

