/**
 * Login Page
 * User authentication page
 * Server Component by default
 */

import type { Metadata } from 'next';
import { SignInForm } from '@/components/auth/signin-form';
import { getOrGenerateCsrfToken } from '@/lib/security/csrf';

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://multiagent.ai';

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
  const csrfToken = await getOrGenerateCsrfToken();
  return <SignInForm csrfToken={csrfToken} />;
}

