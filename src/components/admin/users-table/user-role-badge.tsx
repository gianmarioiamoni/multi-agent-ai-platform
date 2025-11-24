/**
 * User Role Badge Component
 * Displays role badge with styling
 * Following SRP: Only handles role badge display
 */

import type { UserRole } from '@/types/database.types';

interface UserRoleBadgeProps {
  role: UserRole;
}

export const UserRoleBadge = ({ role }: UserRoleBadgeProps) => {
  const isAdmin = role === 'admin';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        isAdmin
          ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
          : 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
      }`}
    >
      {role}
    </span>
  );
};

