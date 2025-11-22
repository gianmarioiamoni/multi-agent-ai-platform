/**
 * Account Profile Section Component
 * Profile form section with header
 * Following SRP: Only handles profile section rendering
 */

import { ProfileForm } from '@/components/profile/profile-form';

interface AccountProfileSectionProps {
  initialName: string;
}

export const AccountProfileSection = ({ initialName }: AccountProfileSectionProps) => {
  return (
    <div className="p-6 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)]">
      <h2 className="text-xl font-semibold text-[var(--color-foreground)] mb-6">
        Profile Information
      </h2>
      <ProfileForm initialName={initialName} />
    </div>
  );
};

