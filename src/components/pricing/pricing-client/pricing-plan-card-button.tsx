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
import { subscribeToPlan } from '@/lib/subscription/actions';
import { useRouter } from 'next/navigation';
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
  const { success: showSuccess, error: showError } = useToast();
  const router = useRouter();

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
      const result = await subscribeToPlan(plan.id as 'basic' | 'premium', billingCycle);

      if (result.success) {
        if (isCurrentPlan) {
          showSuccess(`You are already on the ${plan.name} plan.`);
        } else {
          showSuccess(`Successfully subscribed to ${plan.name} plan!`);
        }
        router.refresh(); // Refresh to show updated plan
      } else {
        showError(result.error || 'Failed to subscribe to plan');
      }
    } catch (error) {
      showError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const price = billingCycle === 'monthly' ? plan.pricing.monthly : plan.pricing.yearly;

  return (
    <Button
      className="w-full"
      variant={plan.popular ? 'primary' : 'outline'}
      disabled={isCurrentPlan || isLoading || hasNextPlan}
      isLoading={isLoading}
      onClick={handleSubscribe}
    >
      {isCurrentPlan
        ? 'Current Plan'
        : hasNextPlan
          ? 'Scheduled'
          : isLoading
            ? 'Processing...'
            : `Subscribe - ${price === 0 ? 'Free' : price === 9.9 ? '€9.90' : '€19.90'}/${billingCycle === 'monthly' ? 'mo' : 'yr'}`}
    </Button>
  );
};
