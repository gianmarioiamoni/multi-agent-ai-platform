/**
 * Users Table Component
 * Displays list of all users with role management
 * Following SRP: Only handles table composition
 */

'use client';

import { useUserRoleManagement } from '@/hooks/admin/use-user-role-management';
import { UsersTableHeader } from './users-table/users-table-header';
import { UserTableRow } from './users-table/user-table-row';
import type { Database } from '@/types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface UsersTableProps {
  users: Profile[];
  currentUserId: string;
}

export const UsersTable = ({ users, currentUserId }: UsersTableProps) => {
  const { isUpdating, updateRole } = useUserRoleManagement();

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--color-muted-foreground)]">
        No users found
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <UsersTableHeader />
        <tbody>
          {users.map((user) => (
            <UserTableRow
              key={user.user_id}
              user={user}
              isCurrentUser={user.user_id === currentUserId}
              isUpdating={isUpdating === user.user_id}
              onRoleChange={updateRole}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

