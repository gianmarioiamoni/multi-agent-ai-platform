/**
 * Contact Page
 * Contact form page
 * Server Component - fetches user data if authenticated
 */

import type { Metadata } from 'next';
import { getCurrentUserProfile, getCurrentUser } from '@/lib/auth/utils';
import { ContactForm } from '@/components/contact/contact-form';
import { ContactPageHeader } from '@/components/contact/contact-page-header';

// Force dynamic rendering since this page uses cookies (auth) to fetch user-specific data
export const dynamic = 'force-dynamic';

import { getAppUrl } from '@/utils/url';

const siteUrl = getAppUrl();

export const metadata: Metadata = {
  title: 'Contact Us - Multi-Agent AI Platform',
  description:
    'Get in touch with us for support, inquiries, or feedback. We&apos;re here to help you get the most out of our AI platform.',
  keywords: ['contact', 'support', 'help', 'inquiry', 'feedback'],
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: 'Contact Us - Multi-Agent AI Platform',
    description: 'Get in touch with us for support, inquiries, or feedback.',
    url: `${siteUrl}/contact`,
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Contact Us - Multi-Agent AI Platform',
    description: 'Get in touch with us for support, inquiries, or feedback.',
  },
};

export default async function ContactPage() {
  // Get user profile and auth user if authenticated (for pre-filling email/name)
  const profile = await getCurrentUserProfile();
  const user = await getCurrentUser();

  return (
    <div className="container mx-auto max-w-3xl">
      <ContactPageHeader />
      
      <div className="mt-6">
        <ContactForm
          defaultEmail={user?.email || undefined}
          defaultName={profile?.name || undefined}
        />
      </div>

      <div className="mt-8 p-6 bg-[var(--color-muted)]/30 rounded-lg border border-[var(--color-border)]">
        <h3 className="font-semibold mb-2">Need immediate assistance?</h3>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          For urgent matters, please reach out to us directly at{' '}
          <a
            href={`mailto:${process.env.ADMIN_EMAIL || 'support@multiagent.ai'}`}
            className="text-[var(--color-primary)] hover:underline"
          >
            {process.env.ADMIN_EMAIL || 'support@multiagent.ai'}
          </a>
        </p>
      </div>
    </div>
  );
}

