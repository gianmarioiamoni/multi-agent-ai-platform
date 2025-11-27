/**
 * Help Quick Info Section
 * Essential information section for help center
 * Following SRP: Only UI composition
 * SSR: Fully server-side rendered
 */

import { HelpQuickInfoItem } from './help-quick-info-item';
import { quickInfoItems } from '@/lib/help/constants';

export const HelpQuickInfo = () => {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Essential Information</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {quickInfoItems.map((item, index) => (
          <HelpQuickInfoItem key={index} item={item} />
        ))}
      </div>
    </section>
  );
};

