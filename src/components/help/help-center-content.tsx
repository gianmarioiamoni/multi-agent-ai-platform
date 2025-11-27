/**
 * Help Center Content
 * Main composition component for help center sections
 * Following SRP: Only composition, no logic
 * SSR: Fully server-side rendered
 */

import { HelpQuickInfo } from './help-quick-info/help-quick-info';
import { HelpFAQ } from './help-faq/help-faq';
import { HelpResources } from './help-resources/help-resources';

export const HelpCenterContent = () => {
  return (
    <div className="space-y-8">
      <HelpQuickInfo />
      <HelpFAQ />
      <HelpResources />
    </div>
  );
};

