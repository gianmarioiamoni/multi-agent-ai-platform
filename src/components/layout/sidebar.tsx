/**
 * Sidebar Component
 * Main navigation sidebar with menu items
 * Following SRP: Only handles sidebar composition
 */

'use client';

import { cn } from '@/utils/cn';
import { useFilteredNavigation } from '@/hooks/navigation/use-filtered-navigation';
import { MobileOverlay } from './sidebar/mobile-overlay';
import { SidebarHeader } from './sidebar/sidebar-header';
import { NavigationSection } from './sidebar/navigation-section';
import { SidebarFooter } from './sidebar/sidebar-footer';
import type { UserRole } from '@/lib/auth/utils';

interface SidebarProps {
  userRole: UserRole;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ userRole, isOpen, onClose }: SidebarProps) => {
  const filteredSections = useFilteredNavigation(userRole);

  return (
    <>
      <MobileOverlay isVisible={isOpen} onClose={onClose} />

      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-screen w-64 bg-[var(--color-card)] border-r border-[var(--color-border)]',
          'flex flex-col',
          'transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <SidebarHeader onClose={onClose} />

        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {filteredSections.map((section) => (
            <NavigationSection
              key={section.title}
              section={section}
              onItemClick={onClose}
            />
          ))}
        </nav>

        <SidebarFooter />
      </aside>
    </>
  );
};

