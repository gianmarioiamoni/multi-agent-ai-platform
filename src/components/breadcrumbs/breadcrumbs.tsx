/**
 * Breadcrumbs Component
 * Main breadcrumb navigation component
 * Client Component (minimal) - reads pathname, uses pure utility functions
 * Can receive custom labels from Server Components
 */

'use client';

import { usePathname } from 'next/navigation';
import { generateBreadcrumbs } from '@/utils/breadcrumbs-utils';
import { useBreadcrumbs } from '@/contexts/breadcrumbs-context';
import { BreadcrumbItem } from './breadcrumb-item';

export const Breadcrumbs = () => {
  const pathname = usePathname();
  const { customLabels } = useBreadcrumbs();
  const items = generateBreadcrumbs(pathname, customLabels);

  // Don't show breadcrumbs if only home
  if (items.length <= 1) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-2 -mt-2 opacity-70">
      <ol className="flex items-center gap-1 flex-wrap">
        {items.map((item, index) => (
          <BreadcrumbItem
            key={`${item.href}-${index}`}
            item={item}
            showSeparator={index < items.length - 1}
          />
        ))}
      </ol>
    </nav>
  );
};

