/**
 * Settings Page
 * Application settings and preferences
 */

import type { Metadata } from 'next';
import { SettingsClient } from '@/components/settings/settings-client';

// Force dynamic rendering since this page uses cookies (auth) to fetch user-specific data
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Configure your application preferences and notifications',
};

export default function SettingsPage() {
  return <SettingsClient />;
}

