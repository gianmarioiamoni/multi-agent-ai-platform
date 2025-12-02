/**
 * Help Center Page
 * Main page for help center with FAQ and resources
 * Following SRP: Server Component that composes UI components
 * SSR: Fully server-side rendered
 */

import type { Metadata } from 'next';
import { HelpCenterHeader } from '@/components/help/help-center-header';
import { HelpCenterContent } from '@/components/help/help-center-content';

import { getAppUrl } from '@/utils/url';

const siteUrl = getAppUrl();

export const metadata: Metadata = {
  title: 'Help Center - Multi-Agent AI Platform',
  description:
    'Find answers to common questions and learn how to get the most out of the Multi-Agent AI Platform. Get help with workflows, agents, and integrations.',
  keywords: [
    'help',
    'support',
    'FAQ',
    'documentation',
    'tutorial',
    'guide',
    'AI platform help',
    'workflow help',
  ],
  alternates: {
    canonical: `${siteUrl}/help`,
  },
  openGraph: {
    title: 'Help Center - Multi-Agent AI Platform',
    description:
      'Find answers to common questions and learn how to get the most out of the Multi-Agent AI Platform.',
    url: `${siteUrl}/help`,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Help Center - Multi-Agent AI Platform',
    description: 'Find answers to common questions and learn how to get the most out of the platform.',
  },
};

export default function HelpCenterPage() {
  return (
    <div className="container mx-auto max-w-4xl space-y-6">
      <HelpCenterHeader />
      <HelpCenterContent />
    </div>
  );
}

