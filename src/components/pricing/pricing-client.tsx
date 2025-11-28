/**
 * Pricing Client Component
 * Client wrapper for pricing page with billing cycle toggle
 * Following SRP: Only handles client-side state for billing cycle
 */

'use client';

import { useState } from 'react';
import { PricingBillingToggle } from './pricing-client/pricing-billing-toggle';
import { PricingPlansGrid } from './pricing-client/pricing-plans-grid';
import type { SubscriptionPlan } from '@/types/subscription.types';

interface PricingClientProps {
  currentPlan?: SubscriptionPlan | null;
  nextPlan?: SubscriptionPlan | null;
}

export const PricingClient = ({ currentPlan, nextPlan }: PricingClientProps) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <>
      <PricingBillingToggle billingCycle={billingCycle} onBillingCycleChange={setBillingCycle} />
      <PricingPlansGrid
        billingCycle={billingCycle}
        currentPlan={currentPlan}
        nextPlan={nextPlan}
      />
    </>
  );
};

