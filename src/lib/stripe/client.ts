/**
 * Stripe Client Initialization
 * Server-side Stripe client for API operations
 * Following SRP: Only handles Stripe client creation
 */

import Stripe from 'stripe';

let stripeInstance: Stripe | null = null;

/**
 * Get or create Stripe client instance
 * Singleton pattern for reusing client instance
 */
export function getStripeClient(): Stripe {
  if (stripeInstance) {
    return stripeInstance;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error(
      'STRIPE_SECRET_KEY is not set. Please configure it in your environment variables.'
    );
  }

  stripeInstance = new Stripe(secretKey, {
    apiVersion: '2025-11-17.clover', // Use latest stable version
    typescript: true,
  });

  return stripeInstance;
}

/**
 * Verify Stripe configuration
 */
export function isStripeConfigured(): boolean {
  return !!process.env.STRIPE_SECRET_KEY && !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
}

