# Stripe Integration Plan

## Overview
Implementare Stripe per gestire i pagamenti dei piani subscription.

## Componenti da Implementare

### 1. Setup Stripe
- Installare Stripe SDK
- Configurare variabili ambiente (API keys)
- Creare prodotti/piani in Stripe Dashboard o via API

### 2. Database
- Aggiungere `stripe_customer_id` a `profiles`
- Aggiungere `stripe_subscription_id` a `profiles`
- Aggiungere `stripe_price_id` per tracciare il prezzo selezionato

### 3. Stripe Checkout
- API route per creare checkout session
- Redirect a Stripe Checkout
- Gestire success/cancel URLs

### 4. Webhook Handler
- API route per gestire eventi Stripe
- Eventi principali:
  - `checkout.session.completed` - Pagamento completato
  - `customer.subscription.updated` - Subscription aggiornata
  - `customer.subscription.deleted` - Subscription cancellata
  - `invoice.payment_succeeded` - Pagamento fattura riuscito
  - `invoice.payment_failed` - Pagamento fallito

### 5. Subscription Management
- Modificare `subscribeToPlan` per usare Stripe Checkout
- Gestire cancellazione subscription
- Gestire aggiornamento subscription (change plan)
- Sincronizzazione stato con Stripe

### 6. UI Updates
- Aggiornare button "Subscribe" per aprire Stripe Checkout
- Mostrare stato subscription da Stripe
- Gestire cancellazione subscription
- Gestire retry pagamenti falliti

## Flusso Utente

1. **Utente clicca "Subscribe"** → Apre Stripe Checkout
2. **Utente completa pagamento** → Stripe webhook notifica l'app
3. **App aggiorna database** → Subscription attiva
4. **Utente vede piano attivo** → Dashboard aggiornata

## Flusso Tecnico

### Subscribe Flow
```
User clicks Subscribe
  ↓
Create Stripe Checkout Session (API route)
  ↓
Redirect to Stripe Checkout
  ↓
User completes payment
  ↓
Stripe webhook: checkout.session.completed
  ↓
Update database: subscription_plan, subscription_expires_at, stripe_customer_id, stripe_subscription_id
  ↓
User redirected to success page
```

### Cancel Flow
```
User cancels subscription (UI)
  ↓
Call Stripe API to cancel subscription
  ↓
Stripe webhook: customer.subscription.deleted
  ↓
Update database: subscription_cancelled_at, next_plan = null
  ↓
Cron job handles return to trial or disable
```

## File Structure

```
src/
  lib/
    stripe/
      client.ts          # Stripe client initialization
      checkout.ts        # Create checkout session
      subscriptions.ts   # Manage subscriptions (cancel, update)
      webhooks.ts        # Webhook handler
  app/
    api/
      stripe/
        checkout/
          route.ts       # Create checkout session
        webhook/
          route.ts       # Handle Stripe webhooks
      subscriptions/
        cancel/
          route.ts       # Cancel subscription
```

## Migration Database

```sql
ALTER TABLE profiles
  ADD COLUMN stripe_customer_id TEXT,
  ADD COLUMN stripe_subscription_id TEXT,
  ADD COLUMN stripe_price_id TEXT;

CREATE INDEX idx_profiles_stripe_customer_id ON profiles(stripe_customer_id);
CREATE INDEX idx_profiles_stripe_subscription_id ON profiles(stripe_subscription_id);
```

## Environment Variables

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

## Stripe Products/Prices Setup

Creare in Stripe Dashboard:
- **Basic Monthly**: €9.90/month
- **Basic Yearly**: €99/year (€8.25/month)
- **Premium Monthly**: €19.90/month
- **Premium Yearly**: €199/year (€16.58/month)

Oppure via API durante setup.

