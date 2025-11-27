/**
 * Cookie Preferences Layout
 * Metadata for cookie preferences page
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cookie Preferences',
  description: 'Manage your cookie preferences and consent settings',
};

export default function CookiePreferencesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

