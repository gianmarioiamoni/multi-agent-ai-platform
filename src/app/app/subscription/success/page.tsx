/**
 * Subscription Success Page
 * Page shown after successful Stripe checkout
 * Following SRP: Only handles success page UI
 * SSR: Server Component
 */

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Force dynamic rendering since this page uses search params
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Subscription Successful',
  description: 'Your subscription has been successfully activated',
};

interface SubscriptionSuccessPageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SubscriptionSuccessPage({
  searchParams,
}: SubscriptionSuccessPageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  // If no session ID, redirect to pricing (might be a direct access)
  if (!sessionId) {
    redirect('/app/pricing');
  }

  return (
    <div className="container mx-auto max-w-2xl py-16 px-4">
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-4">
            <CheckCircle className="h-16 w-16 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Subscription Successful!</h1>
          <p className="text-muted-foreground text-lg">
            Thank you for subscribing. Your plan has been activated and you now have full access to
            all features.
          </p>
        </div>

        <div className="pt-8 space-y-4">
          <Link href="/app/dashboard">
            <Button size="lg" className="w-full sm:w-auto">
              Go to Dashboard
            </Button>
          </Link>
          <div>
            <Link href="/app/account">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Account
              </Button>
            </Link>
          </div>
        </div>

        <div className="pt-8 text-sm text-muted-foreground">
          <p>
            Need help?{' '}
            <Link href="/app/contact" className="text-primary hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

