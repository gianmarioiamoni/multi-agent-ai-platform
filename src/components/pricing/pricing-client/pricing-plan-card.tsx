/**
 * Pricing Plan Card
 * Individual plan card component
 * Following SRP: Only UI presentation
 * SSR: Fully server-side rendered
 */

import type { SubscriptionPlanInfo } from '@/types/subscription.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatPrice, calculateYearlySavings } from '@/lib/subscription/constants';
import { Check } from 'lucide-react';
import { cn } from '@/utils/cn';
import { PricingPlanCardButton } from './pricing-plan-card-button';

interface PricingPlanCardProps {
  plan: SubscriptionPlanInfo;
  billingCycle: 'monthly' | 'yearly';
  isCurrentPlan?: boolean;
  hasNextPlan?: boolean;
}

export const PricingPlanCard = ({
  plan,
  billingCycle,
  isCurrentPlan = false,
  hasNextPlan = false,
}: PricingPlanCardProps) => {
  const price = billingCycle === 'monthly' ? plan.pricing.monthly : plan.pricing.yearly;
  const savings = calculateYearlySavings(plan.pricing.monthly, plan.pricing.yearly);
  const showSavings = billingCycle === 'yearly' && price > 0 && savings > 0;

  return (
    <Card
      className={cn(
        'relative flex flex-col',
        plan.popular && 'border-primary shadow-lg scale-105',
        isCurrentPlan && 'border-green-500'
      )}
    >
      {plan.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}

      {isCurrentPlan && (
        <div className="absolute -top-4 right-4">
          <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Current Plan
          </span>
        </div>
      )}

      {hasNextPlan && !isCurrentPlan && (
        <div className="absolute -top-4 right-4">
          <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
            Scheduled
          </span>
        </div>
      )}

      <CardHeader className="text-center pb-8">
        <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
        <p className="text-muted-foreground text-sm">{plan.description}</p>
      </CardHeader>

      <CardContent className="flex-1 space-y-6">
        {/* Pricing */}
        <div className="text-center">
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-4xl font-bold">{formatPrice(price, plan.pricing.currency)}</span>
            {price > 0 && (
              <span className="text-muted-foreground">
                /{billingCycle === 'monthly' ? 'month' : 'year'}
              </span>
            )}
          </div>
          {showSavings && (
            <p className="text-sm text-green-600 mt-2 font-medium">Save {savings}% annually</p>
          )}
        </div>

        {/* Features */}
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        {/* Scheduled Plan Change Info */}
        {hasNextPlan && !isCurrentPlan && (
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              <span className="font-semibold">Scheduled:</span> This plan will be activated at the end of your current billing period.
            </p>
          </div>
        )}

        {/* CTA Button */}
        <PricingPlanCardButton
          plan={plan}
          billingCycle={billingCycle}
          isCurrentPlan={isCurrentPlan}
          hasNextPlan={hasNextPlan}
        />
      </CardContent>
    </Card>
  );
};

