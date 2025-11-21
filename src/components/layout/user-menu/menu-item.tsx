/**
 * Menu Item Component
 * Single dropdown menu item with icon and link
 * Following SRP: Only handles menu item UI
 */

import Link from 'next/link';
import type { ReactNode } from 'react';

interface MenuItemProps {
  href: string;
  icon: ReactNode;
  label: string;
  onClick: () => void;
  variant?: 'default' | 'primary';
}

export const MenuItem = ({ 
  href, 
  icon, 
  label, 
  onClick, 
  variant = 'default' 
}: MenuItemProps) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-2 text-sm hover:bg-[var(--color-accent)]/10 transition-colors ${
        variant === 'primary' ? 'text-[var(--color-primary)]' : ''
      }`}
    >
      {icon}
      {label}
    </Link>
  );
};

