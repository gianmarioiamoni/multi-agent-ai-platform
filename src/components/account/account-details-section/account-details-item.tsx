/**
 * Account Details Item Component
 * Single detail item (label + value)
 * Following SRP: Only handles detail item rendering
 */

interface AccountDetailsItemProps {
  label: string;
  value: React.ReactNode;
  isLast?: boolean;
}

export const AccountDetailsItem = ({ label, value, isLast = false }: AccountDetailsItemProps) => {
  return (
    <div
      className={`flex items-start justify-between py-3 ${
        isLast ? '' : 'border-b border-[var(--color-border)]'
      }`}
    >
      <div>
        <dt className="text-sm font-semibold text-[var(--color-foreground)]">{label}</dt>
        <dd className="text-sm text-[var(--color-muted-foreground)] mt-1">{value}</dd>
      </div>
    </div>
  );
};

