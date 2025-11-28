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

  // Safety check: Verify subscription status at login (backup to cron job)
  // This ensures users with expired subscriptions are immediately disabled
  if (!profile.isDemo && profile.role !== 'admin') {
    const { checkSubscriptionStatus, disableExpiredUser } = await import('@/lib/subscription/login-check');
    const status = await checkSubscriptionStatus(user.id);

    // Disable user if subscription expired (safety net - cron should handle this, but check here too)
    if (status.shouldDisable) {
      await disableExpiredUser(user.id);
      // Redirect to login with error message
      redirect('/auth/login?error=' + encodeURIComponent('Your subscription has expired. Please subscribe to continue using the platform.'));
    }
  }

  return <AppLayoutClient user={profile} isDemo={profile.isDemo}>{children}</AppLayoutClient>;
}

