/**
 * Help Resources Section
 * Links to additional resources (manual, contact form)
 * Following SRP: Only UI composition
 * SSR: Fully server-side rendered
 */

import { HelpResourceItem } from './help-resource-item';
import { helpResources } from '@/lib/help/constants';

export const HelpResources = () => {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Additional Resources</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {helpResources.map((resource, index) => (
          <HelpResourceItem key={index} resource={resource} />
        ))}
      </div>
    </section>
  );
};

