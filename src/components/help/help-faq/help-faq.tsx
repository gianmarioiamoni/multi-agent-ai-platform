/**
 * Help FAQ Section
 * Frequently Asked Questions section
 * Following SRP: Only UI composition
 * SSR: Fully server-side rendered
 */

import { HelpFAQItem } from './help-faq-item';
import { faqItems } from '@/lib/help/constants';

export const HelpFAQ = () => {
  return (
    <section className="space-y-4">
      <h2 className="text-2xl font-semibold tracking-tight">Frequently Asked Questions</h2>
      <div className="space-y-2">
        {faqItems.map((item, index) => (
          <HelpFAQItem key={index} item={item} index={index} />
        ))}
      </div>
    </section>
  );
};

