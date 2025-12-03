/**
 * My Account Page
 * User profile and account settings
 */

import type { Metadata } from 'next';
import { getCurrentUserProfile } from '@/lib/auth/utils';
import { getCsrfToken } from '@/lib/security/csrf';
import { AccountHeader } from '@/components/account/account-header';
import { AccountProfileSection } from '@/components/account/account-profile-section';
import { AccountDetailsSection } from '@/components/account/account-details-section';
import { AccountSubscriptionSection } from '@/components/account/account-subscription-section';
import { AccountSecuritySection } from '@/components/account/account-security-section';
import { AccountGdprSection } from '@/components/account/account-gdpr-section';
import { DemoRestrictionsNotice } from '@/components/demo/demo-restrictions-notice';

// Force dynamic rendering since this page uses cookies (auth) to fetch user-specific data
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'My Account',
  description: 'Manage your account',
};

export default async function AccountPage() {
  const profile = await getCurrentUserProfile();
  // Only read existing token, don't generate in Server Component
  // Token will be generated client-side via Server Action if needed
  const csrfToken = await getCsrfToken();

  if (!profile) {
    return null;
  }

  return (
    <div className="space-y-8">
      <AccountHeader />
      <AccountProfileSection initialName={profile.name || ''} />
      <AccountDetailsSection 
        userId={profile.userId}
        role={profile.role}
        createdAt={profile.createdAt}
      />
      <AccountSubscriptionSection
        isDemo={profile.isDemo}
        subscriptionPlan={profile.subscriptionPlan}
        subscriptionExpiresAt={profile.subscriptionExpiresAt}
        nextPlan={profile.nextPlan}
        planSwitchAt={profile.planSwitchAt}
      />
      {profile.isDemo ? <DemoRestrictionsNotice /> : null}
      <AccountSecuritySection isDemo={profile.isDemo} csrfToken={csrfToken || ''} />
      <AccountGdprSection />
    </div>
  );
}

