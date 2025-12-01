/**
 * Admin Settings Page
 * Configuration page for global tool settings
 * Only accessible by admin users
 */

import type { Metadata } from 'next';
import { getCurrentUserProfile } from '@/lib/auth/utils';
import { getToolConfigs } from '@/lib/admin/tool-config-actions';
import { AdminSettingsClient } from '@/components/admin/admin-settings/admin-settings-client';

export const metadata: Metadata = {
  title: 'Admin Settings - Tool Configuration',
  description: 'Configure global tool settings for the platform',
};

export default async function AdminSettingsPage() {
  const profile = await getCurrentUserProfile();

  if (!profile || profile.role !== 'admin') {
    return null; // Layout will handle redirect
  }

  const { data: toolConfigs, error } = await getToolConfigs();

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Tool Configuration</h1>
        <p className="text-muted-foreground mt-1">
          Configure global settings for platform tools. These settings apply to all users.
        </p>
      </div>

      {error ? <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200">
          <p className="font-medium">Error loading configurations</p>
          <p className="text-sm mt-1">{error}</p>
        </div> : null}

      <AdminSettingsClient initialConfigs={toolConfigs || []} />
    </div>
  );
}

