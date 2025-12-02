/**
 * Stripe Constants
 * Stripe-related constants and mappings
 * Following SRP: Only data constants
 */

import type { SubscriptionPlan, BillingCycle } from '@/types/subscription.types';
import { getAppUrl } from '@/utils/url';

/**
 * Mapping of our plan IDs to Stripe Price IDs
 * These should be configured in Stripe Dashboard and set as environment variables
 * Format: { planId_billingCycle: stripePriceId }
 * 
 * Example:
 * {
 *   'basic_monthly': 'price_1234567890',
 *   'basic_yearly': 'price_0987654321',
 *   'premium_monthly': 'price_1122334455',
 *   'premium_yearly': 'price_5544332211',
 * }
 */
export const STRIPE_PRICE_IDS: Record<string, string> = {
  basic_monthly: process.env.STRIPE_PRICE_BASIC_MONTHLY || '',
  basic_yearly: process.env.STRIPE_PRICE_BASIC_YEARLY || '',
  premium_monthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY || '',
  premium_yearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY || '',
};

/**
 * Get Stripe Price ID for a plan and billing cycle
 */
export function getStripePriceId(
  plan: SubscriptionPlan,
  billingCycle: BillingCycle
): string | null {
  if (plan === 'trial') {
    return null; // Trial doesn't have a Stripe price
  }

  const key = `${plan}_${billingCycle}`;
  const priceId = STRIPE_PRICE_IDS[key];

  if (!priceId) {
    console.error(`Stripe Price ID not found for ${plan} ${billingCycle}`);
    return null;
  }

  return priceId;
}

/**
 * Stripe Checkout success/cancel URLs
 */
export function getStripeCheckoutUrls(): {
  successUrl: string;
  cancelUrl: string;
} {
  const baseUrl = getAppUrl();

  return {
    successUrl: `${baseUrl}/app/subscription/success`,
    cancelUrl: `${baseUrl}/app/pricing`,
  };
}

/**
 * Verify all Stripe Price IDs are configured
 */
export function areStripePriceIdsConfigured(): boolean {
  return (
    !!STRIPE_PRICE_IDS.basic_monthly &&
    !!STRIPE_PRICE_IDS.basic_yearly &&
    !!STRIPE_PRICE_IDS.premium_monthly &&
    !!STRIPE_PRICE_IDS.premium_yearly
  );
}

