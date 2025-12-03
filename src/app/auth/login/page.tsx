/**
 * Login Page
 * User authentication page
 * Server Component by default
 */

import type { Metadata } from 'next';
import { SignInForm } from '@/components/auth/signin-form';
import { getCsrfToken } from '@/lib/security/csrf';
import { getAppUrl } from '@/utils/url';

const siteUrl = getAppUrl();

export const metadata: Metadata = {
  title: 'Sign In - Multi-Agent AI Platform',
  description: 'Sign in to your account to manage AI agents and workflows',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: `${siteUrl}/auth/login`,
  },
};

// Disable static generation to avoid prerendering errors with useSearchParams
export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  // Only read existing token, don't generate in Server Component
  // Token will be generated client-side via Server Action if needed
  const csrfToken = await getCsrfToken();
  return <SignInForm csrfToken={csrfToken || ''} />;
}

