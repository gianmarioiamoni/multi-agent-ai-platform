/**
 * Breadcrumb Item Component
 * Single breadcrumb link item
 * Client Component (for navigation)
 */

'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/utils/breadcrumbs-utils';

interface BreadcrumbItemProps {
  item: BreadcrumbItemType;
  showSeparator?: boolean;
}

export const BreadcrumbItem = ({ item, showSeparator = true }: BreadcrumbItemProps) => {
  const isActive = item.isActive ?? false;

  const content = (
    <>
      {isActive ? (
        <span
          className={cn(
            'text-xs font-medium',
            'text-[var(--color-muted-foreground)]'
          )}
        >
          {item.label}
        </span>
      ) : (
        <Link
          href={item.href}
          className={cn(
            'text-xs font-medium',
            'text-[var(--color-foreground)]',
            'hover:text-[var(--color-primary)]',
            'transition-colors',
            'truncate max-w-[200px]'
          )}
        >
          {item.label}
        </Link>
      )}
      {showSeparator && !isActive ? <ChevronRight className="w-3 h-3 text-[var(--color-muted-foreground)] mx-1 flex-shrink-0" /> : null}
    </>
  );

  return (
    <li className="flex items-center gap-1 min-w-0">
      {content}
    </li>
  );
};

