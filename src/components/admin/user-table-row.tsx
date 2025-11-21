/**
 * User Table Row Component
 * Single row in users table
 * Following SRP: Only handles row display
 */

import { formatDate } from '@/utils/format';
import { UserAvatar } from './user-avatar';
import { UserRoleBadge } from './user-role-badge';
import { RoleSelector } from './role-selector';
import type { Database } from '@/types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type UserRole = Database['public']['Enums']['user_role'];

interface UserTableRowProps {
  user: Profile;
  isCurrentUser: boolean;
  isUpdating: boolean;
  onRoleChange: (userId: string, newRole: UserRole) => void;
}

export const UserTableRow = ({
  user,
  isCurrentUser,
  isUpdating,
  onRoleChange,
}: UserTableRowProps) => {
  return (
    <tr className="border-b border-[var(--color-border)] hover:bg-[var(--color-accent)]/5 transition-colors">
      {/* Name & Avatar */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <UserAvatar name={user.name} />
          <span className="text-[var(--color-foreground)] font-medium">
            {user.name || 'Unnamed User'}
            {isCurrentUser && (
              <span className="ml-2 text-xs text-[var(--color-muted-foreground)]">
                (You)
              </span>
            )}
          </span>
        </div>
      </td>

      {/* User ID */}
      <td className="py-3 px-4">
        <code className="text-xs text-[var(--color-muted-foreground)] font-mono">
          {user.user_id.slice(0, 8)}...
        </code>
      </td>

      {/* Role Badge */}
      <td className="py-3 px-4">
        <UserRoleBadge role={user.role} />
      </td>

      {/* Join Date */}
      <td className="py-3 px-4 text-sm text-[var(--color-muted-foreground)]">
        {formatDate(user.created_at)}
      </td>

      {/* Actions */}
      <td className="py-3 px-4 text-right">
        {isCurrentUser ? (
          <span className="text-xs text-[var(--color-muted-foreground)]">
            Cannot modify
          </span>
        ) : (
          <RoleSelector
            currentRole={user.role}
            onRoleChange={(newRole) => onRoleChange(user.user_id, newRole)}
            disabled={isUpdating}
          />
        )}
      </td>
    </tr>
  );
};

