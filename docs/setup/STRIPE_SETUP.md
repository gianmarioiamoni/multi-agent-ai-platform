# Stripe Setup Guide

## Overview
This guide will help you set up Stripe payment integration for subscription plans.

## Step 1: Install Stripe SDK

```bash
npm install stripe @stripe/stripe-js
```

Or with pnpm:
```bash
pnpm add stripe @stripe/stripe-js
```

## Step 2: Create Stripe Account and Get API Keys

1. Go to [https://stripe.com](https://stripe.com)
2. Create an account or sign in
3. **IMPORTANT**: Assicurati di essere in **Test mode** (toggle in alto a destra nel dashboard)
4. Go to **Developers** → **API keys**
5. Copy your **Publishable key** (inizia con `pk_test_` per test mode)
6. Copy your **Secret key** (inizia con `sk_test_` per test mode)
   - ⚠️ Keep this secret! Never commit it to git.

**⚠️ Per i test, usa SEMPRE le chiavi di Test Mode standard** (`sk_test_...` e `pk_test_...`).
Non serve creare chiavi con limitazioni - le chiavi di test sono già sicure e non addebitano carte reali.

Per maggiori dettagli, vedi `docs/STRIPE_TEST_MODE.md`.

## Step 3: Create Products and Prices in Stripe

### Option A: Via Stripe Dashboard (Recommended for MVP)

1. Go to **Products** → **Add product**
2. Create products for each plan:

#### Basic Plan
- **Name**: Basic Plan
- **Description**: Great for small teams and personal projects
- **Pricing**:
  - Monthly: €9.90/month (recurring)
  - Yearly: €99.00/year (recurring, saves ~17%)

#### Premium Plan
- **Name**: Premium Plan
- **Description**: For power users and teams
- **Pricing**:
  - Monthly: €19.90/month (recurring)
  - Yearly: €199.00/year (recurring, saves ~17%)

3. For each price, copy the **Price ID** (starts with `price_`)

### Option B: Via API (Script)

You can use the script `scripts/setup-stripe-products.ts` (to be created) to automatically create products and prices.

## Step 4: Configure Environment Variables

Add to `.env.local`:

```env
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Stripe Price IDs (from Step 3)
STRIPE_PRICE_BASIC_MONTHLY=price_...
STRIPE_PRICE_BASIC_YEARLY=price_...
STRIPE_PRICE_PREMIUM_MONTHLY=price_...
STRIPE_PRICE_PREMIUM_YEARLY=price_...

# Stripe Webhook Secret (get from Step 5)
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Step 5: Set Up Webhook Endpoint

### For Local Development (Using Stripe CLI)

1. Install Stripe CLI:
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Or download from https://stripe.com/docs/stripe-cli
   ```

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
   
   This will show a webhook secret (starts with `whsec_`). Add it to `.env.local` as `STRIPE_WEBHOOK_SECRET`.

### For Production

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter URL: `https://your-domain.com/api/stripe/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** (starts with `whsec_`) and add to environment variables

## Step 6: Apply Database Migration

Run the migration to add Stripe fields to the database:

```sql
-- Execute supabase/migrations/013_add_stripe_fields.sql in Supabase Dashboard
```

Or via Supabase CLI:
```bash
supabase db push
```

## Step 7: Update Database Types

After applying the migration, regenerate TypeScript types:

```bash
npx supabase gen types typescript --project-id your-project-id > src/types/database.types.ts
```

Or manually update `src/types/database.types.ts` to include the new Stripe fields (already done in codebase).

## Step 8: Test the Integration

1. **Test Checkout**:
   - Go to `/app/pricing`
   - Click "Subscribe" on a plan
   - Complete test payment with Stripe test card: `4242 4242 4242 4242`
   - Use any future expiry date and any CVC

2. **Test Webhook**:
   - Complete a test checkout
   - Verify webhook is received and database is updated
   - Check Stripe Dashboard → Webhooks → View logs

## Production Checklist

- [ ] Switch to production Stripe keys (replace `pk_test_` with `pk_live_`, etc.)
- [ ] Create production products/prices in Stripe Dashboard
- [ ] Set up production webhook endpoint
- [ ] Update environment variables in production (Vercel, etc.)
- [ ] Test with real payment (small amount)
- [ ] Monitor webhook logs in Stripe Dashboard

## Troubleshooting

### Webhook not received
- Check webhook URL is correct
- Verify webhook secret is set correctly
- Check Stripe Dashboard → Webhooks → View logs for errors

### Payment succeeds but subscription not activated
- Check webhook handler logs
- Verify database migration is applied
- Check Stripe webhook logs for errors

### "Price ID not found" error
- Verify all `STRIPE_PRICE_*` environment variables are set
- Check Price IDs match those in Stripe Dashboard

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)

