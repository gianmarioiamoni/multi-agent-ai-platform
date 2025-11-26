/**
 * Users Table Header Component
 * Table header with column titles
 * Following SRP: Only handles header display
 */

export const UsersTableHeader = () => {
  return (
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
          Demo
        </th>
        <th className="text-left py-3 px-4 text-sm font-semibold text-[var(--color-foreground)]">
          Joined
        </th>
        <th className="text-right py-3 px-4 text-sm font-semibold text-[var(--color-foreground)]">
          Actions
        </th>
      </tr>
    </thead>
  );
};

