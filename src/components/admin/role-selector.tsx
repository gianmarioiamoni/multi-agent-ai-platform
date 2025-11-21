/**
 * Role Selector Component
 * Select dropdown for changing user role
 * Following SRP: Only handles role selection UI
 */

import type { Database } from '@/types/database.types';

type UserRole = Database['public']['Enums']['user_role'];

interface RoleSelectorProps {
  currentRole: UserRole;
  onRoleChange: (newRole: UserRole) => void;
  disabled?: boolean;
}

export const RoleSelector = ({ currentRole, onRoleChange, disabled = false }: RoleSelectorProps) => {
  return (
    <select
      value={currentRole}
      onChange={(e) => onRoleChange(e.target.value as UserRole)}
      disabled={disabled}
      className="px-3 py-1 text-sm border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-foreground)] hover:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <option value="user">User</option>
      <option value="admin">Admin</option>
    </select>
  );
};

