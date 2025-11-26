/**
 * Login Page
 * User authentication page
 * Server Component by default
 */

import type { Metadata } from 'next';
import { SignInForm } from '@/components/auth/signin-form';

export const metadata: Metadata = {
  title: 'Sign In - Multi-Agent AI Platform',
  description: 'Sign in to your account to manage AI agents and workflows',
};

// Disable static generation to avoid prerendering errors with useSearchParams
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return <SignInForm />;
}

