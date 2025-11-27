/**
 * Account Details Section Component
 * Main composition component for account details
 * Following SRP: Only handles component composition
 */

'use client';

import { useAccountDetails } from '@/hooks/account/use-account-details';
import { AccountDetailsHeader } from './account-details-section/account-details-header';
import { AccountDetailsItem } from './account-details-section/account-details-item';
import { AccountDetailsRoleBadge } from './account-details-section/account-details-role-badge';

interface AccountDetailsSectionProps {
  userId: string;
  role: string;
  createdAt: string;
}

export const AccountDetailsSection = ({
  userId,
  role,
  createdAt,
}: AccountDetailsSectionProps) => {
  const { roleColor, formattedDate } = useAccountDetails({ role, createdAt });

  return (
    <div className="p-6 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
      <AccountDetailsHeader title="Account Details" />

      <dl className="space-y-4">
        <AccountDetailsItem
          label="User ID"
          value={<span className="font-mono">{userId}</span>}
        />

        <AccountDetailsItem
          label="Role"
          value={<AccountDetailsRoleBadge role={role} roleColor={roleColor} />}
        />

        <AccountDetailsItem label="Member Since" value={formattedDate} isLast />
      </dl>
    </div>
  );
};

