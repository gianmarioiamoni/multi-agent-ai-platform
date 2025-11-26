/**
 * Settings Page
 * Application settings and preferences
 */

import type { Metadata } from 'next';
import { SettingsClient } from '@/components/settings/settings-client';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Configure your application preferences and notifications',
};

export default function SettingsPage() {
  return <SettingsClient />;
}

