/**
 * Home Page
 * Landing page for unauthenticated users, redirects authenticated users to dashboard
 * Server Component
 */

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth/utils';
import { LandingPageClient } from '@/components/landing/landing-page-client';
import { getAppUrl } from '@/utils/url';

const siteUrl = getAppUrl();

export const metadata: Metadata = {
  title: 'Multi-Agent AI Platform - Automate Your Business Workflows',
  description:
    'Create intelligent workflows with multiple AI agents. Automate your business processes, streamline operations, and boost productivity with our powerful multi-agent AI platform.',
  keywords: [
    'AI automation',
    'multi-agent system',
    'workflow automation',
    'business AI',
    'intelligent agents',
    'AI platform',
    'automation software',
  ],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Multi-Agent AI Platform - Automate Your Business Workflows',
    description:
      'Create intelligent workflows with multiple AI agents. Automate your business processes and boost productivity.',
    url: siteUrl,
    siteName: 'Multi-Agent AI Platform',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Multi-Agent AI Platform',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Multi-Agent AI Platform - Automate Your Business Workflows',
    description:
      'Create intelligent workflows with multiple AI agents. Automate your business processes and boost productivity.',
    images: [`${siteUrl}/og-image.png`],
  },
};

export default async function Home() {
  const user = await getCurrentUser();

  // Redirect authenticated users to dashboard
  if (user) {
    redirect('/app/dashboard');
  }

  // Show landing page for unauthenticated users
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Multi-Agent AI Platform',
            applicationCategory: 'BusinessApplication',
            operatingSystem: 'Web',
            description:
              'Automate your business workflows with AI agents. Create intelligent workflows, manage multiple AI agents, and streamline your operations.',
            url: siteUrl,
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '150',
            },
            featureList: [
              'Multi-agent workflow automation',
              'AI-powered business processes',
              'Intelligent agent management',
              'Workflow orchestration',
              'API integrations',
            ],
          }),
        }}
      />
      <LandingPageClient />
    </>
  );
}
