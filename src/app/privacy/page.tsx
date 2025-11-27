/**
 * Privacy Policy Page
 * GDPR-compliant privacy policy
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy and GDPR compliance information for Multi-Agent AI Platform',
};

export default function PrivacyPage() {
  const adminEmail = process.env.ADMIN_EMAIL || 'privacy@multiagent.ai';

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 max-w-4xl">
      <div className="space-y-8">
        <Link
          href="/app/dashboard"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-foreground)] mb-2">
            Privacy Policy
          </h1>
          <p className="text-[var(--color-muted-foreground)]">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Introduction</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--color-foreground)]">
            <p>
              Multi-Agent AI Platform (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
            </p>
            <p>
              By using our service, you agree to the collection and use of information in accordance with this policy.
              We comply with the General Data Protection Regulation (GDPR) and other applicable data protection laws.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--color-foreground)]">
            <div>
              <h3 className="font-semibold mb-2">2.1 Personal Information</h3>
              <p>
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                <li>Name and email address (for account creation)</li>
                <li>Profile information and preferences</li>
                <li>Workflow and agent configurations</li>
                <li>Communication preferences</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2.2 Automatically Collected Information</h3>
              <p>
                When you use our service, we automatically collect:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                <li>Usage data and analytics</li>
                <li>Log files and error reports</li>
                <li>Device and browser information</li>
                <li>IP address and location data (anonymized)</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--color-foreground)]">
            <p>We use the collected information for the following purposes:</p>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li>To provide, maintain, and improve our services</li>
              <li>To process and manage your account</li>
              <li>To communicate with you about your account and our services</li>
              <li>To analyze usage patterns and improve user experience</li>
              <li>To ensure security and prevent fraud</li>
              <li>To comply with legal obligations</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Legal Basis for Processing (GDPR)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--color-foreground)]">
            <p>
              Under GDPR, we process your personal data based on the following legal bases:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li><strong>Consent:</strong> When you explicitly consent to data processing</li>
              <li><strong>Contract:</strong> To fulfill our contractual obligations to you</li>
              <li><strong>Legal Obligation:</strong> To comply with applicable laws</li>
              <li><strong>Legitimate Interests:</strong> To improve our services and ensure security</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Cookies and Tracking Technologies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--color-foreground)]">
            <p>
              We use cookies and similar tracking technologies to track activity on our service and store certain information.
              You can control cookie preferences through your browser settings or our{' '}
              <Link href="/privacy/cookies" className="text-[var(--color-primary)] hover:underline">
                Cookie Preferences
              </Link>{' '}
              page.
            </p>
            <div>
              <h3 className="font-semibold mb-2">Types of Cookies We Use:</h3>
              <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
                <li><strong>Necessary Cookies:</strong> Essential for the website to function properly</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Data Sharing and Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--color-foreground)]">
            <p>
              We do not sell your personal information. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li>With service providers who assist in operating our platform</li>
              <li>When required by law or to protect our rights</li>
              <li>In connection with a business transfer or merger</li>
              <li>With your explicit consent</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Your Rights Under GDPR</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--color-foreground)]">
            <p>As a data subject, you have the following rights:</p>
            <ul className="list-disc list-inside ml-4 space-y-1 mt-2">
              <li><strong>Right to Access:</strong> Request a copy of your personal data</li>
              <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
              <li><strong>Right to Restrict Processing:</strong> Limit how we use your data</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a structured format</li>
              <li><strong>Right to Object:</strong> Object to processing based on legitimate interests</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, please contact us at{' '}
              <a href={`mailto:${adminEmail}`} className="text-[var(--color-primary)] hover:underline">
                {adminEmail}
              </a>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--color-foreground)]">
            <p>
              We retain your personal data only for as long as necessary to fulfill the purposes outlined in this Privacy Policy,
              unless a longer retention period is required or permitted by law.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Data Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--color-foreground)]">
            <p>
              We implement appropriate technical and organizational measures to protect your personal data against unauthorized access,
              alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. International Data Transfers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--color-foreground)]">
            <p>
              Your information may be transferred to and processed in countries other than your country of residence.
              We ensure appropriate safeguards are in place to protect your data in accordance with this Privacy Policy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>11. Children&apos;s Privacy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--color-foreground)]">
            <p>
              Our service is not intended for individuals under the age of 18. We do not knowingly collect personal information
              from children. If you believe we have collected information from a child, please contact us immediately.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>12. Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--color-foreground)]">
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>13. Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--color-foreground)]">
            <p>
              If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us:
            </p>
            <div className="mt-4 space-y-1">
              <p>
                <strong>Email:</strong>{' '}
                <a href={`mailto:${adminEmail}`} className="text-[var(--color-primary)] hover:underline">
                  {adminEmail}
                </a>
              </p>
              <p>
                <strong>Cookie Preferences:</strong>{' '}
                <Link href="/privacy/cookies" className="text-[var(--color-primary)] hover:underline">
                  Manage Cookie Preferences
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

