/**
 * Login Page
 * User authentication page
 * Server Component by default
 */

import type { Metadata } from 'next';
import { SignInForm } from '@/components/auth/signin-form';
import { getOrGenerateCsrfToken } from '@/lib/security/csrf';

export const metadata: Metadata = {
  title: 'Sign In - Multi-Agent AI Platform',
  description: 'Sign in to your account to manage AI agents and workflows',
};

// Disable static generation to avoid prerendering errors with useSearchParams
export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  const csrfToken = await getOrGenerateCsrfToken();
  return <SignInForm csrfToken={csrfToken} />;
}

