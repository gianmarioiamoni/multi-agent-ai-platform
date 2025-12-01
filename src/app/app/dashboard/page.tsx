/**
 * Dashboard Page
 * Main dashboard for authenticated users
 * Server Component
 */

import type { Metadata } from 'next';
import { getCurrentUserProfile } from '@/lib/auth/utils';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardStatsGrid } from '@/components/dashboard/dashboard-stats-grid';
import { DashboardQuickActions } from '@/components/dashboard/dashboard-quick-actions';
import { DashboardGettingStarted } from '@/components/dashboard/dashboard-getting-started';

// Force dynamic rendering since this page uses cookies (auth) to fetch user-specific data
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Manage your AI agents and workflows',
};

export default async function DashboardPage() {
  const profile = await getCurrentUserProfile();

  return (
    <div className="space-y-8">
      <DashboardHeader userName={profile?.name || null} />
      <DashboardStatsGrid />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardQuickActions />
        <DashboardGettingStarted />
      </div>
    </div>
  );
}

