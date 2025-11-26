/**
 * Account Security Section Component
 * Security settings: password change and account deletion
 * Following SRP: Only handles security section composition
 */

'use client';

import { AccountPasswordForm } from './account-security/account-password-form';
import { AccountDeletionSection } from './account-security/account-deletion-section';

interface AccountSecuritySectionProps {
  isDemo: boolean;
}

export const AccountSecuritySection = ({ isDemo }: AccountSecuritySectionProps) => {
  return (
    <div className="p-6 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">
          Security Settings
        </h2>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Manage your password and account settings
        </p>
      </div>

      {/* Password Change Section */}
      <div className="border-t border-[var(--color-border)] pt-6">
        <AccountPasswordForm isDemo={isDemo} />
      </div>

      {/* Account Deletion Section */}
      <div className="border-t border-[var(--color-border)] pt-6">
        <AccountDeletionSection isDemo={isDemo} />
      </div>
    </div>
  );
};

