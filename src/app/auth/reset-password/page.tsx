/**
 * Reset Password Page
 * Page for resetting user password via email link
 */

import type { Metadata } from 'next';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';
import { getAppUrl } from '@/utils/url';

const siteUrl = getAppUrl();

export const metadata: Metadata = {
  title: 'Reset Password - Multi-Agent AI Platform',
  description: 'Reset your password',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: `${siteUrl}/auth/reset-password`,
  },
};

// Force dynamic rendering to handle search params
export const dynamic = 'force-dynamic';

export default function ResetPasswordPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-md">
      <ResetPasswordForm />
    </div>
  );
}

