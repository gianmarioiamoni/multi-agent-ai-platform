/**
 * Sign Up Page
 * User registration page
 * Server Component by default
 */

import type { Metadata } from 'next';
import { SignUpForm } from '@/components/auth/signup-form';

export const metadata: Metadata = {
  title: 'Sign Up - Multi-Agent AI Platform',
  description: 'Create your account to start automating workflows with AI agents',
};

export default function SignUpPage() {
  return <SignUpForm />;
}

