/**
 * Stripe Webhook Handler
 * Receives and processes Stripe webhook events
 * Following SRP: Only handles webhook request/response, delegates to handlers
 */

import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';
import { getStripeClient } from '@/lib/stripe/client';
import { logError, logInfo } from '@/lib/logging/logger';
import {
  handleCheckoutSessionCompleted,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted,
  handleInvoicePaymentSucceeded,
  handleInvoicePaymentFailed,
} from '@/lib/stripe/webhook-handlers';
import type Stripe from 'stripe';

// Force Node.js runtime for webhook processing
export const runtime = 'nodejs';

/**
 * Get raw body for webhook signature verification
 * In Next.js App Router, we need to read the body as text and convert to Buffer
 */
async function getRawBody(request: NextRequest): Promise<Buffer> {
  try {
    // Read body as text and convert to Buffer for Stripe signature verification
    const text = await request.text();
    return Buffer.from(text, 'utf-8');
  } catch (error) {
    throw new Error(
      `Failed to read request body: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    logError(
      'subscription',
      'Stripe webhook secret not configured',
      new Error('STRIPE_WEBHOOK_SECRET is not set')
    );
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  try {
    // Get raw body for signature verification
    const rawBody = await getRawBody(request);
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      logError(
        'subscription',
        'Stripe webhook signature missing',
        new Error('stripe-signature header not found')
      );
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    const stripe = getStripeClient();
    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logError(
        'subscription',
        'Stripe webhook signature verification failed',
        error,
        {
          signature: signature.substring(0, 20) + '...', // Log only first 20 chars for security
        }
      );
      return NextResponse.json(
        { error: 'Invalid webhook signature' },
        { status: 400 }
      );
    }

    // Log received event
    logInfo('subscription', 'Stripe webhook event received', {
      type: event.type,
      id: event.id,
    });

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(
          event.data.object as Stripe.Checkout.Session
        );
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(
          event.data.object as Stripe.Subscription
        );
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        // Log unhandled events for monitoring
        logInfo('subscription', 'Unhandled Stripe webhook event type', {
          type: event.type,
          id: event.id,
        });
    }

    // Return success response
    return NextResponse.json({ received: true });
  } catch (error) {
    logError(
      'subscription',
      'Error processing Stripe webhook',
      error instanceof Error ? error : new Error(String(error))
    );

    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

