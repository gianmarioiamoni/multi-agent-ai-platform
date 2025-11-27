/**
 * Navigation Utilities
 * Pure utility functions for navigation filtering
 * These functions can be used in both Server and Client Components
 */

import { navigationSections } from '@/config/navigation';
import type { NavSection } from '@/types/navigation.types';
import type { UserRole } from '@/lib/auth/utils';

/**
 * Filter navigation sections based on user role
 * Pure function - can be used in Server Components
 */
export function filterNavigationSections(userRole: UserRole): NavSection[] {
  return navigationSections
    .map(section => ({
      ...section,
      items: section.items.filter(item => {
        // Filter admin-only items for non-admin users
        if (item.adminOnly && userRole !== 'admin') {
          return false;
        }
        return true;
      }),
    }))
    .filter(section => section.items.length > 0); // Remove empty sections
}

