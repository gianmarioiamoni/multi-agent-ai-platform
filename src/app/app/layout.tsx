/**
 * App Layout
 * Main layout for authenticated app routes
 * Includes Navbar, Sidebar, and content area
 */

import { redirect } from 'next/navigation';
import { getCurrentUser, getCurrentUserProfile } from '@/lib/auth/utils';
import { AppLayoutClient } from '@/components/layout/app-layout-client';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Require authentication
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  // Get user profile (includes isDemo flag)
  const profile = await getCurrentUserProfile();
  if (!profile) {
    // This should not happen if auth is working correctly
    console.error('User authenticated but no profile found');
    redirect('/auth/login');
  }

  return <AppLayoutClient user={profile} isDemo={profile.isDemo}>{children}</AppLayoutClient>;
}

