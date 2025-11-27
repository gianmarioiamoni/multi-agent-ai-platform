/**
 * Help Quick Info Item
 * Single quick info item component
 * Following SRP: Only UI presentation
 * SSR: Fully server-side rendered
 */

import type { QuickInfoItem } from '@/types/help.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, Rocket, Shield, Zap } from 'lucide-react';

interface HelpQuickInfoItemProps {
  item: QuickInfoItem;
}

const iconMap = {
  lightbulb: Lightbulb,
  rocket: Rocket,
  shield: Shield,
  zap: Zap,
};

export const HelpQuickInfoItem = ({ item }: HelpQuickInfoItemProps) => {
  const Icon = iconMap[item.icon];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5 text-primary" />
          {item.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{item.description}</p>
      </CardContent>
    </Card>
  );
};

