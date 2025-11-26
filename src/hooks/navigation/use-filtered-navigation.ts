/**
 * Filtered Navigation Hook
 * Filters navigation sections based on user role
 * Following SRP: Only handles navigation filtering logic
 */

import { useMemo } from 'react';
import { navigationSections } from '@/config/navigation';
import type { NavSection } from '@/types/navigation.types';
import type { UserRole } from '@/lib/auth/utils';

/**
 * Hook to filter navigation sections based on user role
 */
export function useFilteredNavigation(userRole: UserRole): NavSection[] {
  return useMemo(() => {
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
  }, [userRole]);
}

