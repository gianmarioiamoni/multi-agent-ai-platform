/**
 * Admin Panel Page
 * Administration dashboard with user management
 */

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUserProfile } from '@/lib/auth/utils';
import { getAllUsers, getPlatformStats } from '@/lib/admin/actions';
import { AdminHeader } from '@/components/admin/admin-panel/admin-header';
import { AdminStatsGrid } from '@/components/admin/admin-panel/admin-stats-grid';
import { AdminUsersSection } from '@/components/admin/admin-panel/admin-users-section';
import { AdminSystemInfo } from '@/components/admin/admin-panel/admin-system-info';

export const metadata: Metadata = {
  title: 'Admin Panel',
  description: 'Administration dashboard',
};

export default async function AdminPage() {
  const profile = await getCurrentUserProfile();
  
  if (!profile || profile.role !== 'admin') {
    redirect('/app/dashboard');
  }

  const [users, stats] = await Promise.all([
    getAllUsers(),
    getPlatformStats(),
  ]);

  return (
    <div className="min-h-screen p-8 bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto space-y-8">
        <AdminHeader />
        <AdminStatsGrid stats={stats} />
        <AdminUsersSection users={users} currentUserId={profile.userId} />
        <AdminSystemInfo />
      </div>
    </div>
  );
}

