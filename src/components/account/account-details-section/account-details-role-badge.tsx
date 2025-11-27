/**
 * Account Details Role Badge Component
 * Role badge with color coding
 * Following SRP: Only handles role badge rendering
 */

interface AccountDetailsRoleBadgeProps {
  role: string;
  roleColor: string;
}

export const AccountDetailsRoleBadge = ({ role, roleColor }: AccountDetailsRoleBadgeProps) => {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${roleColor}`}
    >
      {role}
    </span>
  );
};

