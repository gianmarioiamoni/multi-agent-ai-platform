/**
 * Settings Page
 * Application settings and preferences
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Application settings',
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-[var(--color-foreground)]">Settings</h1>
        <p className="text-[var(--color-muted-foreground)] mt-2">
          Configure your application preferences
        </p>
      </div>

      <div className="p-12 rounded-lg bg-[var(--color-card)] border border-[var(--color-border)] text-center">
        <div className="text-6xl mb-4">⚙️</div>
        <h2 className="text-2xl font-semibold text-[var(--color-foreground)] mb-2">
          Settings Coming Soon
        </h2>
        <p className="text-[var(--color-muted-foreground)]">
          Sprint 1, Week 2: Global configuration for admin
        </p>
      </div>
    </div>
  );
}

