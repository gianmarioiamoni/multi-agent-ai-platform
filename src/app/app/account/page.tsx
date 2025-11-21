/**
 * My Account Page
 * User profile and account settings
 */

import type { Metadata } from 'next';
import { getCurrentUserProfile } from '@/lib/auth/utils';
import { ProfileForm } from '@/components/profile/profile-form';

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
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-[var(--color-foreground)]">
          My Account
        </h1>
        <p className="text-[var(--color-muted-foreground)] mt-2">
          Manage your profile and preferences
        </p>
      </div>

      {/* Profile Section */}
      <div className="p-6 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
        <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-6">
          Profile Information
        </h2>
        <ProfileForm initialName={profile.name || ''} />
      </div>

      {/* Account Details */}
      <div className="p-6 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
        <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-4">
          Account Details
        </h2>
        <dl className="space-y-4">
          <div className="flex items-start justify-between py-3 border-b border-[var(--color-border)]">
            <div>
              <dt className="text-sm font-semibold text-[var(--color-foreground)]">
                User ID
              </dt>
              <dd className="text-sm text-[var(--color-muted-foreground)] mt-1 font-mono">
                {profile.userId}
              </dd>
            </div>
          </div>

          <div className="flex items-start justify-between py-3 border-b border-[var(--color-border)]">
            <div>
              <dt className="text-sm font-semibold text-[var(--color-foreground)]">
                Role
              </dt>
              <dd className="mt-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    profile.role === 'admin'
                      ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                      : 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
                  }`}
                >
                  {profile.role}
                </span>
              </dd>
            </div>
          </div>

          <div className="flex items-start justify-between py-3">
            <div>
              <dt className="text-sm font-semibold text-[var(--color-foreground)]">
                Member Since
              </dt>
              <dd className="text-sm text-[var(--color-muted-foreground)] mt-1">
                {new Date(profile.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </dd>
            </div>
          </div>
        </dl>
      </div>

      {/* Security Notice */}
      <div className="p-6 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-[var(--color-accent)] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div>
            <h3 className="text-sm font-semibold text-[var(--color-foreground)] mb-1">
              Security & Privacy
            </h3>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Your account is secured with Supabase authentication. Email and password management features coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

