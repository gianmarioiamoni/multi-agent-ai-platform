/**
 * Centralized Navigation Configuration
 * Main navigation menu structure for the application
 * Following SRP: Only data configuration, icons separated
 */

import type { NavSection } from '@/types/navigation.types';

export const navigationSections: NavSection[] = [
  {
    title: 'Main',
    items: [
      {
        label: 'Dashboard',
        href: '/app/dashboard',
        icon: 'dashboard',
      },
    ],
  },
  {
    title: 'AI Agents',
    items: [
      {
        label: 'Agents',
        href: '/app/agents',
        icon: 'agents',
        badge: 'Soon',
      },
      {
        label: 'Workflows',
        href: '/app/workflows',
        icon: 'workflows',
        badge: 'Soon',
      },
      {
        label: 'Runs',
        href: '/app/runs',
        icon: 'runs',
        badge: 'Soon',
      },
    ],
  },
  {
    title: 'Tools',
    items: [
      {
        label: 'Integrations',
        href: '/app/integrations',
        icon: 'integrations',
        badge: 'Soon',
      },
    ],
  },
  {
    title: 'Admin',
    items: [
      {
        label: 'Admin Panel',
        href: '/admin',
        icon: 'admin',
        adminOnly: true,
      },
    ],
  },
];

