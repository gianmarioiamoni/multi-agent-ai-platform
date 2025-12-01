/**
 * Pricing Plan Card Button
 * Button for subscribing to paid plans or showing status
 * Following SRP: Handles button logic and interaction
 * Client Component for interactivity
 */

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/contexts/toast-context';
import type { SubscriptionPlanInfo } from '@/types/subscription.types';

interface PricingPlanCardButtonProps {
  plan: SubscriptionPlanInfo;
  billingCycle: 'monthly' | 'yearly';
  isCurrentPlan: boolean;
  hasNextPlan?: boolean; // True if this plan is scheduled to be activated
}

export const PricingPlanCardButton = ({
  plan,
  billingCycle,
  isCurrentPlan,
  hasNextPlan,
}: PricingPlanCardButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { error: showError } = useToast();

  // Trial plan: no button, just informational text
  if (plan.id === 'trial') {
    return (
      <div className="w-full text-center text-sm text-muted-foreground py-2">
        Automatically assigned on signup
      </div>
    );
  }

  // Paid plans: show subscribe button
  const handleSubscribe = async () => {
    if (isCurrentPlan || isLoading) return;

    setIsLoading(true);
    try {
      // For paid plans, redirect to Stripe Checkout
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan: plan.id as 'basic' | 'premium',
          billingCycle,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showError(data.error || 'Failed to create checkout session');
        setIsLoading(false);
        return;
      }

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        showError('Invalid response from checkout server');
        setIsLoading(false);
      }
    } catch (error) {
      showError('An unexpected error occurred. Please try again.');
      setIsLoading(false);
    }
  };

  const price = billingCycle === 'monthly' ? plan.pricing.monthly : plan.pricing.yearly;

  return (
    <Button
      className="w-full"
      variant={plan.popular ? 'primary' : 'outline'}
      disabled={isCurrentPlan || isLoading}
      isLoading={isLoading}
      onClick={handleSubscribe}
    >
      {isCurrentPlan
        ? 'Current Plan'
        : hasNextPlan
          ? 'Subscribe Now' // Allow immediate payment even if scheduled
          : isLoading
            ? 'Processing...'
            : `Subscribe - ${price === 0 ? 'Free' : price === 9.9 ? '€9.90' : '€19.90'}/${billingCycle === 'monthly' ? 'mo' : 'yr'}`}
    </Button>
  );
};
