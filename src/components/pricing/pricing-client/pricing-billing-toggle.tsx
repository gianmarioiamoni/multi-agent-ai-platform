/**
 * Pricing Billing Toggle
 * Toggle between monthly and yearly billing
 * Following SRP: Only UI for billing cycle selection
 * Client Component for interactivity
 */

'use client';

import { cn } from '@/utils/cn';

interface PricingBillingToggleProps {
  billingCycle: 'monthly' | 'yearly';
  onBillingCycleChange: (cycle: 'monthly' | 'yearly') => void;
}

export const PricingBillingToggle = ({
  billingCycle,
  onBillingCycleChange,
}: PricingBillingToggleProps) => {
  return (
    <div className="flex items-center justify-center gap-4 mb-12">
      <span className={cn('text-sm', billingCycle === 'monthly' && 'font-semibold')}>
        Monthly
      </span>
      <button
        type="button"
        onClick={() =>
          onBillingCycleChange(billingCycle === 'monthly' ? 'yearly' : 'monthly')
        }
        className={cn(
          'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
          billingCycle === 'yearly' ? 'bg-primary' : 'bg-muted'
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
            billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </button>
      <div className="flex flex-col items-start">
        <span className={cn('text-sm', billingCycle === 'yearly' && 'font-semibold')}>
          Yearly
        </span>
        <span className="text-xs text-green-600 font-medium">Save up to 17%</span>
      </div>
    </div>
  );
};

