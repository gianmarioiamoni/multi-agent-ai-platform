/**
 * Admin Layout
 * Uses the same layout structure as the app routes (sidebar + navbar)
 */

import { redirect } from 'next/navigation';
import { getCurrentUser, getCurrentUserProfile } from '@/lib/auth/utils';
import { AppLayoutClient } from '@/components/layout/app-layout-client';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Require authentication
  const user = await getCurrentUser();
  if (!user) {
    redirect('/auth/login');
  }

  // Get user profile and check admin role
  const profile = await getCurrentUserProfile();
  if (!profile || profile.role !== 'admin') {
    redirect('/app/dashboard');
  }

  return (
    <AppLayoutClient user={profile} isDemo={profile.isDemo}>
      {children}
    </AppLayoutClient>
  );
}

