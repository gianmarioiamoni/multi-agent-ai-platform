/**
 * Account GDPR Section Component
 * GDPR-related features: data export, privacy rights
 * Following SRP: Only handles GDPR section composition
 */

'use client';

import { AccountDataExport } from './account-gdpr-section/account-data-export';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';

export const AccountGdprSection = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-2">
          Your Privacy Rights
        </h2>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Manage your personal data and exercise your rights under GDPR
        </p>
      </div>

      <AccountDataExport />

      <div className="p-4 rounded-lg bg-[var(--color-accent)] border border-[var(--color-border)]">
        <h3 className="font-semibold text-[var(--color-foreground)] mb-2">
          More Information
        </h3>
        <p className="text-sm text-[var(--color-muted-foreground)] mb-3">
          For more information about your privacy rights, data processing, and how to exercise
          other rights (rectification, erasure, restriction), please read our{' '}
          <Link
            href="/privacy"
            className="text-[var(--color-primary)] hover:underline inline-flex items-center gap-1"
          >
            Privacy Policy
            <ExternalLink className="h-3 w-3" />
          </Link>
          .
        </p>
        <p className="text-xs text-[var(--color-muted-foreground)]">
          You can also contact us directly to exercise your rights by emailing the address
          provided in the Privacy Policy.
        </p>
      </div>
    </div>
  );
};

