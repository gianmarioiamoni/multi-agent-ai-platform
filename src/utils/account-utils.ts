/**
 * Account Utilities
 * Pure utility functions for account-related formatting
 * These functions can be used in both Server and Client Components
 */

interface FormatAccountDetailsParams {
  role: string;
  createdAt: string;
}

interface FormattedAccountDetails {
  roleColor: string;
  formattedDate: string;
}

/**
 * Format account details (role color and date)
 * Pure function - no hooks, no side effects
 */
export function formatAccountDetails({
  role,
  createdAt,
}: FormatAccountDetailsParams): FormattedAccountDetails {
  const roleColor =
    role === 'admin'
      ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
      : 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]';

  const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return {
    roleColor,
    formattedDate,
  };
}

