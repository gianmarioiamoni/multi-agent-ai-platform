/**
 * Users Table Component
 * Displays list of all users with role management
 * Following SRP: Only handles user table UI
 */

'use client';

import { useState } from 'react';
import { updateUserRole } from '@/lib/admin/actions';
import { useToast } from '@/contexts/toast-context';
import type { Database } from '@/types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type UserRole = Database['public']['Enums']['user_role'];

interface UsersTableProps {
  users: Profile[];
  currentUserId: string;
}

export const UsersTable = ({ users, currentUserId }: UsersTableProps) => {
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const { success, error: showError } = useToast();

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    setIsUpdating(userId);

    try {
      const result = await updateUserRole(userId, newRole);

      if (result.success) {
        success('Role updated', 'User role has been updated successfully');
      } else {
        showError('Update failed', result.error || 'Unknown error');
      }
    } catch (err) {
      showError('Update failed', 'An unexpected error occurred');
    } finally {
      setIsUpdating(null);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-foreground)]">
              Name
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-foreground)]">
              User ID
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-foreground)]">
              Role
            </th>
            <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-foreground)]">
              Joined
            </th>
            <th className="text-right py-3 px-4 text-sm font-semibold text-[var(--color-foreground)]">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isCurrentUser = user.user_id === currentUserId;
            const isUpdatingThis = isUpdating === user.user_id;

            return (
              <tr
                key={user.user_id}
                className="border-b border-[var(--color-border)] hover:bg-[var(--color-accent)]/5 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent)] flex items-center justify-center text-white text-sm font-semibold">
                      {user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
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
                <td className="py-3 px-4">
                  <code className="text-xs text-[var(--color-muted-foreground)] font-mono">
                    {user.user_id.slice(0, 8)}...
                  </code>
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      user.role === 'admin'
                        ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                        : 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-[var(--color-muted-foreground)]">
                  {formatDate(user.created_at)}
                </td>
                <td className="py-3 px-4 text-right">
                  {isCurrentUser ? (
                    <span className="text-xs text-[var(--color-muted-foreground)]">
                      Cannot modify
                    </span>
                  ) : (
                    <select
                      value={user.role}
                      onChange={(e) =>
                        handleRoleChange(user.user_id, e.target.value as UserRole)
                      }
                      disabled={isUpdatingThis}
                      className="px-3 py-1 text-sm border border-[var(--color-border)] rounded-lg bg-[var(--color-background)] text-[var(--color-foreground)] hover:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-[var(--color-ring)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {users.length === 0 && (
        <div className="text-center py-12 text-[var(--color-muted-foreground)]">
          No users found
        </div>
      )}
    </div>
  );
};

