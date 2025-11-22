/**
 * Account Details Section Component
 * Displays user account information (ID, role, member since)
 * Following SRP: Only handles account details rendering
 */

interface AccountDetailsSectionProps {
  userId: string;
  role: string;
  createdAt: string;
}

export const AccountDetailsSection = ({ userId, role, createdAt }: AccountDetailsSectionProps) => {
  const roleColor = role === 'admin'
    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
    : 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]';

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="p-6 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
      <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-4">
        Account Details
      </h2>
      <dl className="space-y-4">
        {/* User ID */}
        <div className="flex items-start justify-between py-3 border-b border-[var(--color-border)]">
          <div>
            <dt className="text-sm font-semibold text-[var(--color-foreground)]">
              User ID
            </dt>
            <dd className="text-sm text-[var(--color-muted-foreground)] mt-1 font-mono">
              {userId}
            </dd>
          </div>
        </div>

        {/* Role */}
        <div className="flex items-start justify-between py-3 border-b border-[var(--color-border)]">
          <div>
            <dt className="text-sm font-semibold text-[var(--color-foreground)]">
              Role
            </dt>
            <dd className="mt-1">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${roleColor}`}
              >
                {role}
              </span>
            </dd>
          </div>
        </div>

        {/* Member Since */}
        <div className="flex items-start justify-between py-3">
          <div>
            <dt className="text-sm font-semibold text-[var(--color-foreground)]">
              Member Since
            </dt>
            <dd className="text-sm text-[var(--color-muted-foreground)] mt-1">
              {formattedDate}
            </dd>
          </div>
        </div>
      </dl>
    </div>
  );
};

