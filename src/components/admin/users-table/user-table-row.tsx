/**
 * User Table Row Component
 * Single row in users table
 * Following SRP: Only handles row display
 */

import { formatDate } from '@/utils/format';
import { UserAvatar } from '@/components/ui/user-avatar';
import { UserRoleBadge } from './user-role-badge';
import { RoleSelector } from './role-selector';
import { DemoFlagToggle } from './demo-flag-toggle';
import type { Profile, UserRole } from '@/types/database.types';

interface UserTableRowProps {
  user: Profile;
  isCurrentUser: boolean;
  isUpdating: boolean;
  isDemoUpdating: boolean;
  onRoleChange: (userId: string, newRole: UserRole) => void;
  onDemoFlagChange: (userId: string, isDemo: boolean) => void;
}

export const UserTableRow = ({
  user,
  isCurrentUser,
  isUpdating,
  isDemoUpdating,
  onRoleChange,
  onDemoFlagChange,
}: UserTableRowProps) => {
  const isDemo = user.is_demo === true;

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

      {/* Demo Flag */}
      <td className="py-3 px-4">
        {isCurrentUser ? (
          <span className="text-xs text-[var(--color-muted-foreground)]">
            N/A
          </span>
        ) : (
          <DemoFlagToggle
            isDemo={isDemo}
            disabled={isDemoUpdating}
            onToggle={() => onDemoFlagChange(user.user_id, !isDemo)}
          />
        )}
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

