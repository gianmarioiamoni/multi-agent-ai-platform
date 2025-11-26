/**
 * Dashboard Stats Grid Component
 * Displays dashboard statistics in a grid
 * Following SRP: Only handles stats grid rendering
 */

import { getDashboardStats } from '@/lib/dashboard/actions';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
}

const StatCard = ({ label, value, icon }: StatCardProps) => {
  return (
    <div className="p-6 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <span className="text-3xl">{icon}</span>
        <span className="text-xs font-semibold text-[var(--color-muted-foreground)] uppercase">
          {label}
        </span>
      </div>
      <div className="text-3xl font-bold text-[var(--color-foreground)]">
        {value}
      </div>
    </div>
  );
};

export const DashboardStatsGrid = async () => {
  const { data: stats, error } = await getDashboardStats();

  if (error || !stats) {
    // Fallback to zero values on error
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Active Agents" value="0" icon="🤖" />
        <StatCard label="Workflows" value="0" icon="⚡" />
        <StatCard label="Runs Today" value="0" icon="📊" />
        <StatCard label="Success Rate" value="0%" icon="✅" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard label="Active Agents" value={stats.activeAgents} icon="🤖" />
      <StatCard label="Workflows" value={stats.totalWorkflows} icon="⚡" />
      <StatCard label="Runs Today" value={stats.runsToday} icon="📊" />
      <StatCard label="Success Rate" value={`${stats.successRate}%`} icon="✅" />
    </div>
  );
};

