/**
 * Terms of Service Page
 * Terms and conditions for using the platform
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAppUrl } from '@/utils/url';

const siteUrl = getAppUrl();

export const metadata: Metadata = {
  title: 'Terms of Service - Multi-Agent AI Platform',
  description:
    'Terms of Service for Multi-Agent AI Platform. Read our terms and conditions for using our AI automation platform.',
  keywords: ['terms of service', 'terms and conditions', 'user agreement', 'legal terms'],
  alternates: {
    canonical: `${siteUrl}/terms`,
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'Terms of Service - Multi-Agent AI Platform',
    description: 'Terms of Service for Multi-Agent AI Platform.',
    url: `${siteUrl}/terms`,
    type: 'website',
  },
};

export default function TermsPage() {
  const adminEmail = process.env.ADMIN_EMAIL || 'legal@multiagent.ai';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-4xl">
      <div className="space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-foreground)] mb-2">
            Terms of Service
          </h1>
          <p className="text-[var(--color-muted-foreground)]">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--color-foreground)]">
            <p>
              By accessing or using Multi-Agent AI Platform (&quot;the Service&quot;), you agree to be bound by these Terms of Service
              (&quot;Terms&quot;). If you disagree with any part of these terms, you may not access the Service.
            </p>
            <p>
              These Terms apply to all users of the Service, including without limitation users who are browsers, vendors, customers,
              merchants, and/or contributors of content.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Description of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--color-foreground)]">
            <p>
              Multi-Agent AI Platform is a cloud-based service that enables users to create, manage, and orchestrate multiple AI agents
              to automate business workflows. The Service includes:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li>AI agent creation and configuration</li>
              <li>Workflow automation and orchestration</li>
              <li>Integration with third-party services (email, calendar, databases)</li>
              <li>Analytics and reporting features</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. User Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--color-foreground)]">
            <div>
              <h3 className="font-semibold mb-2">3.1 Account Creation</h3>
              <p>
                To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and
                complete information during the registration process.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3.2 Account Security</h3>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur
                under your account. You agree to notify us immediately of any unauthorized use of your account.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3.3 Account Termination</h3>
              <p>
                We reserve the right to suspend or terminate your account at any time for violation of these Terms or for any other
                reason we deem necessary.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Subscription Plans and Payment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--color-foreground)]">
            <div>
              <h3 className="font-semibold mb-2">4.1 Subscription Plans</h3>
              <p>
                The Service is offered under various subscription plans, including a trial plan and paid plans. Details of each plan,
                including features and pricing, are available on our pricing page.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">4.2 Payment Terms</h3>
              <p>
                Paid subscriptions are billed in advance on a recurring basis. By subscribing to a paid plan, you authorize us to charge
                your payment method for the subscription fee.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">4.3 Cancellation and Refunds</h3>
              <p>
                You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period.
                Refunds are provided in accordance with our refund policy, which may vary by plan.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Acceptable Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--color-foreground)]">
            <p>You agree not to use the Service to:</p>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Transmit any harmful, offensive, or illegal content</li>
              <li>Attempt to gain unauthorized access to the Service or other accounts</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Use the Service for any fraudulent or malicious purpose</li>
              <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Intellectual Property</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--color-foreground)]">
            <div>
              <h3 className="font-semibold mb-2">6.1 Service Ownership</h3>
              <p>
                The Service and its original content, features, and functionality are owned by Multi-Agent AI Platform and are protected
                by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">6.2 User Content</h3>
              <p>
                You retain ownership of any content you create, upload, or submit through the Service. By using the Service, you grant
                us a license to use, store, and process your content solely for the purpose of providing the Service.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Third-Party Services</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--color-foreground)]">
            <p>
              The Service may integrate with third-party services (such as email providers, calendar services, and databases). Your use
              of these third-party services is subject to their respective terms of service and privacy policies. We are not responsible
              for the actions or policies of third-party service providers.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--color-foreground)]">
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
              EITHER EXPRESS OR IMPLIED. WE DISCLAIM ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY,
              FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
            </p>
            <p>
              IN NO EVENT SHALL WE BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT
              LIMITED TO LOSS OF PROFITS, DATA, OR USE, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Indemnification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--color-foreground)]">
            <p>
              You agree to indemnify, defend, and hold harmless Multi-Agent AI Platform and its officers, directors, employees, and agents
              from and against any claims, liabilities, damages, losses, and expenses, including reasonable attorneys&apos; fees, arising out
              of or in any way connected with your use of the Service or violation of these Terms.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--color-foreground)]">
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new
              Terms on this page and updating the &quot;Last updated&quot; date. Your continued use of the Service after such changes constitutes
              your acceptance of the new Terms.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>11. Governing Law</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--color-foreground)]">
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Multi-Agent AI
              Platform operates, without regard to its conflict of law provisions.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>12. Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--color-foreground)]">
            <p>
              If you have any questions about these Terms of Service, please contact us:
            </p>
            <div className="mt-4 space-y-1">
              <p>
                <strong>Email:</strong>{' '}
                <a href={`mailto:${adminEmail}`} className="text-[var(--color-primary)] hover:underline">
                  {adminEmail}
                </a>
              </p>
              <p>
                <strong>Privacy Policy:</strong>{' '}
                <Link href="/privacy" className="text-[var(--color-primary)] hover:underline">
                  View Privacy Policy
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

