/**
 * Help Center Page
 * Main page for help center with FAQ and resources
 * Following SRP: Server Component that composes UI components
 * SSR: Fully server-side rendered
 */

import type { Metadata } from 'next';
import { HelpCenterHeader } from '@/components/help/help-center-header';
import { HelpCenterContent } from '@/components/help/help-center-content';

export const metadata: Metadata = {
  title: 'Help Center',
  description: 'Find answers to common questions and learn how to get the most out of the Multi-Agent AI Platform.',
};

export default function HelpCenterPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-6">
      <HelpCenterHeader />
      <HelpCenterContent />
    </div>
  );
}

