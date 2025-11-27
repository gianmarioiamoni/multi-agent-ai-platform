/**
 * My Account Page
 * User profile and account settings
 */

import type { Metadata } from 'next';
import { getCurrentUserProfile } from '@/lib/auth/utils';
import { AccountHeader } from '@/components/account/account-header';
import { AccountProfileSection } from '@/components/account/account-profile-section';
import { AccountDetailsSection } from '@/components/account/account-details-section';
import { AccountSecuritySection } from '@/components/account/account-security-section';
import { AccountGdprSection } from '@/components/account/account-gdpr-section';
import { DemoRestrictionsNotice } from '@/components/demo/demo-restrictions-notice';

export const metadata: Metadata = {
  title: 'My Account',
  description: 'Manage your account',
};

export default async function AccountPage() {
  const profile = await getCurrentUserProfile();

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
      {profile.isDemo && <DemoRestrictionsNotice />}
      <AccountSecuritySection isDemo={profile.isDemo} />
      <AccountGdprSection />
    </div>
  );
}

