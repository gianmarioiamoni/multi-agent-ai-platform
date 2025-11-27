/**
 * Account Details Hook
 * Handles account details formatting logic
 * Following SRP: Only manages account details formatting
 */

'use client';

interface UseAccountDetailsProps {
  role: string;
  createdAt: string;
}

interface UseAccountDetailsReturn {
  roleColor: string;
  formattedDate: string;
}

/**
 * Hook for formatting account details
 */
export function useAccountDetails({
  role,
  createdAt,
}: UseAccountDetailsProps): UseAccountDetailsReturn {
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

