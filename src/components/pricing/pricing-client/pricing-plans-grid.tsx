/**
 * Pricing Plans Grid
 * Grid of pricing plan cards
 * Following SRP: Only composition
 * SSR: Fully server-side rendered
 */

import { PricingPlanCard } from './pricing-plan-card';
import { SUBSCRIPTION_PLANS } from '@/lib/subscription/constants';
import type { SubscriptionPlan } from '@/types/subscription.types';

interface PricingPlansGridProps {
  billingCycle: 'monthly' | 'yearly';
  currentPlan?: SubscriptionPlan | null;
  nextPlan?: SubscriptionPlan | null;
}

export const PricingPlansGrid = ({
  billingCycle,
  currentPlan,
  nextPlan,
}: PricingPlansGridProps) => {
  return (
    <div className="grid gap-8 md:grid-cols-3 mt-8">
      {SUBSCRIPTION_PLANS.map((plan) => (
        <PricingPlanCard
          key={plan.id}
          plan={plan}
          billingCycle={billingCycle}
          isCurrentPlan={currentPlan === plan.id}
          hasNextPlan={nextPlan === plan.id}
        />
      ))}
    </div>
  );
};

