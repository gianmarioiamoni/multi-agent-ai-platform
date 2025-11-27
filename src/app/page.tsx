/**
 * Home Page
 * Landing page for unauthenticated users, redirects authenticated users to dashboard
 * Server Component
 */

import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/utils';
import { LandingPageClient } from '@/components/landing/landing-page-client';

export default async function Home() {
  const user = await getCurrentUser();

  // Redirect authenticated users to dashboard
  if (user) {
    redirect('/app/dashboard');
  }

  // Show landing page for unauthenticated users
  return <LandingPageClient />;
}
