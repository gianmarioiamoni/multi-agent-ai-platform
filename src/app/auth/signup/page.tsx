/**
 * Sign Up Page
 * User registration page
 * Server Component by default
 */

import type { Metadata } from 'next';
import { SignUpForm } from '@/components/auth/signup-form';
import { getOrGenerateCsrfToken } from '@/lib/security/csrf';
import { getAppUrl } from '@/utils/url';

const siteUrl = getAppUrl();

export const metadata: Metadata = {
  title: 'Sign Up - Multi-Agent AI Platform',
  description: 'Create your account to start automating workflows with AI agents',
  robots: {
    index: false,
    follow: false,
  },
  alternates: {
    canonical: `${siteUrl}/auth/signup`,
  },
};

export default async function SignUpPage() {
  const csrfToken = await getOrGenerateCsrfToken();
  return <SignUpForm csrfToken={csrfToken} />;
}

