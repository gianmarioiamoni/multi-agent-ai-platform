/**
 * Admin Users Section Component
 * Users table section with header
 * Following SRP: Only handles users section rendering
 */

import { UsersTable } from '../users-table';
import type { Profile } from '@/types/database.types';

interface AdminUsersSectionProps {
  users: Profile[];
  currentUserId: string;
}

export const AdminUsersSection = ({ users, currentUserId }: AdminUsersSectionProps) => {
  return (
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
        <UsersTable users={users} currentUserId={currentUserId} />
      </div>
    </div>
  );
};

