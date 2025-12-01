/**
 * Navigation Item Component
 * Single navigation menu item
 * Following SRP: Only handles single nav item UI
 */

import Link from 'next/link';
import { cn } from '@/utils/cn';
import { iconMap } from '@/components/icons';
import type { NavItem } from '@/types/navigation.types';

interface NavigationItemProps {
  item: NavItem;
  isActive: boolean;
  onClick: () => void;
}

export const NavigationItem = ({ item, isActive, onClick }: NavigationItemProps) => {
  const Icon = item.icon ? iconMap[item.icon] : null;

  return (
    <li>
      <Link
        href={item.href}
        onClick={onClick}
        className={cn(
          'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all',
          isActive
            ? 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] shadow-sm'
            : 'text-[var(--color-foreground)] hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)]'
        )}
      >
        {Icon ? <Icon /> : null}
        <span className="flex-1">{item.label}</span>
        {item.badge ? <span className={cn(
            'px-2 py-0.5 text-xs font-semibold rounded-full',
            isActive
              ? 'bg-white/20 text-white'
              : 'bg-[var(--color-accent)]/10 text-[var(--color-accent)]'
          )}>
            {item.badge}
          </span> : null}
      </Link>
    </li>
  );
};

