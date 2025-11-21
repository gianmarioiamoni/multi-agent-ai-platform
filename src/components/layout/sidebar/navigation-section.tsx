/**
 * Navigation Section Component
 * Section of navigation items with title
 * Following SRP: Only handles section UI
 */

'use client';

import { usePathname } from 'next/navigation';
import { NavigationItem } from './navigation-item';
import type { NavSection } from '@/types/navigation.types';

interface NavigationSectionProps {
  section: NavSection;
  onItemClick: () => void;
}

export const NavigationSection = ({ section, onItemClick }: NavigationSectionProps) => {
  const pathname = usePathname();

  return (
    <div>
      <h3 className="px-3 mb-2 text-xs font-semibold text-[var(--color-muted-foreground)] uppercase tracking-wider">
        {section.title}
      </h3>
      <ul className="space-y-1">
        {section.items.map((item) => (
          <NavigationItem
            key={item.href}
            item={item}
            isActive={pathname === item.href}
            onClick={onItemClick}
          />
        ))}
      </ul>
    </div>
  );
};

