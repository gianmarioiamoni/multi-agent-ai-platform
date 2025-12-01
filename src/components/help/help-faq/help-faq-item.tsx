/**
 * Help FAQ Item
 * Single FAQ item component using native HTML details/summary
 * Following SRP: Only UI presentation
 * SSR: Fully server-side rendered (no client JS needed)
 */

import type { FAQItem } from '@/types/help.types';
import { Card } from '@/components/ui/card';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface HelpFAQItemProps {
  item: FAQItem;
}

export const HelpFAQItem = ({ item }: HelpFAQItemProps) => {
  return (
    <Card>
      <details className="group">
        <summary
          className={cn(
            'flex items-center justify-between p-6 cursor-pointer',
            'list-none transition-colors hover:bg-accent/50',
            '[&::-webkit-details-marker]:hidden',
            'select-none'
          )}
        >
          <h3 className="font-semibold text-left pr-4 flex-1">{item.question}</h3>
          <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-200 group-open:rotate-180" />
        </summary>
        <div className="px-6 pb-6 pt-0">
          <p className="text-sm text-muted-foreground whitespace-pre-line">{item.answer}</p>
        </div>
      </details>
    </Card>
  );
};

