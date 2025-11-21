/**
 * Admin Panel Page
 * Administration dashboard with user management
 */

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUserProfile } from '@/lib/auth/utils';
import { getAllUsers, getPlatformStats } from '@/lib/admin/actions';
import { UsersTable } from '@/components/admin/users-table';

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
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-[var(--color-foreground)]">
            Admin Panel
          </h1>
          <p className="text-[var(--color-muted-foreground)] mt-2">
            Platform administration and user management
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

        {/* Users Table */}
        <div className="rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
          <div className="p-6 border-b border-[var(--color-border)]">
            <h2 className="text-xl font-semibold text-[var(--color-foreground)]">
              User Management
            </h2>
            <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
              Manage user roles and permissions
            </p>
          </div>
          <div className="p-6">
            <UsersTable users={users} currentUserId={profile.userId} />
          </div>
        </div>

        {/* System Info */}
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
      </div>
    </div>
  );
}

