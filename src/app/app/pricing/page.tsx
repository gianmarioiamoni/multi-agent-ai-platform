/**
 * Pricing Page
 * Display subscription plans and pricing
 * Following SRP: Server Component that composes UI components
 * SSR: Fully server-side rendered with client interaction for billing toggle
 */

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUserProfile } from '@/lib/auth/utils';
import { PricingHeader } from '@/components/pricing/pricing-header';
import { PricingClient } from '@/components/pricing/pricing-client';

// Force dynamic rendering since this page uses cookies (auth) to fetch user-specific data
export const dynamic = 'force-dynamic';

import { getAppUrl } from '@/utils/url';

const siteUrl = getAppUrl();

export const metadata: Metadata = {
  title: 'Pricing Plans - Multi-Agent AI Platform',
  description:
    'Choose the subscription plan that fits your needs. Start with a free 30-day trial. Flexible pricing for individuals and businesses.',
  keywords: [
    'AI platform pricing',
    'automation software pricing',
    'workflow automation plans',
    'AI agent subscription',
    'business automation pricing',
  ],
  alternates: {
    canonical: `${siteUrl}/pricing`,
  },
  openGraph: {
    title: 'Pricing Plans - Multi-Agent AI Platform',
    description:
      'Choose the subscription plan that fits your needs. Start with a free 30-day trial.',
    url: `${siteUrl}/pricing`,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Pricing Plans - Multi-Agent AI Platform',
    description: 'Choose the subscription plan that fits your needs. Start with a free 30-day trial.',
  },
};

export default async function PricingPage() {
  const profile = await getCurrentUserProfile();

  // Admin users have unlimited access and should not access pricing page
  if (!profile || profile.role === 'admin') {
    redirect('/app/dashboard');
  }

  const currentPlan = profile.subscriptionPlan || null;
  const nextPlan = profile.nextPlan || null;

  return (
    <div className="container mx-auto max-w-6xl space-y-6 py-8">
      <PricingHeader />
      <PricingClient
        currentPlan={currentPlan}
        nextPlan={nextPlan}
      />
    </div>
  );
}

