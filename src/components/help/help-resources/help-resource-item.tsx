/**
 * Help Resource Item
 * Single resource link component
 * Following SRP: Only UI presentation
 * SSR: Fully server-side rendered
 */

import type { HelpResource } from '@/types/help.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Mail, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { getButtonStyles } from '@/utils/button-styles';

interface HelpResourceItemProps {
  resource: HelpResource;
}

const iconMap = {
  book: Book,
  mail: Mail,
  external: ExternalLink,
};

export const HelpResourceItem = ({ resource }: HelpResourceItemProps) => {
  const Icon = iconMap[resource.icon];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5 text-primary" />
          {resource.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{resource.description}</p>
        <Link
          href={resource.href}
          target={resource.external ? '_blank' : undefined}
          className={cn(getButtonStyles('outline', 'md'), 'w-full')}
        >
          {resource.title}
          {resource.external ? <ExternalLink className="ml-2 h-4 w-4" /> : null}
        </Link>
      </CardContent>
    </Card>
  );
};

