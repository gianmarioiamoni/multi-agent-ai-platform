/**
 * Sign Up Page
 * User registration page
 * Server Component by default
 */

import type { Metadata } from 'next';
import { SignUpForm } from '@/components/auth/signup-form';
import { getCsrfToken } from '@/lib/security/csrf';
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
  // Only read existing token, don't generate in Server Component
  // Token will be generated client-side via Server Action if needed
  const csrfToken = await getCsrfToken();
  return <SignUpForm csrfToken={csrfToken || ''} />;
}

