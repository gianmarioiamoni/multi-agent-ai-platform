# Stripe Webhook Setup Guide

## Overview
Il webhook Stripe gestisce gli eventi di pagamento e attiva/disattiva le subscription nel database.

## Endpoint Webhook

**URL**: `/api/stripe/webhook`

## Eventi Gestiti

Il webhook gestisce i seguenti eventi Stripe:

1. **`checkout.session.completed`**
   - Quando l'utente completa il pagamento
   - Attiva la subscription nel database
   - Aggiorna `subscription_plan`, `subscription_expires_at`, `stripe_customer_id`, `stripe_subscription_id`

2. **`customer.subscription.updated`**
   - Quando la subscription viene aggiornata (cambio piano, rinnovo, etc.)
   - Aggiorna i dettagli della subscription nel database

3. **`customer.subscription.deleted`**
   - Quando la subscription viene cancellata
   - Marca la subscription come cancellata
   - Gestisce il ritorno al trial se ci sono giorni rimanenti

4. **`invoice.payment_succeeded`**
   - Quando un pagamento subscription viene processato con successo
   - Aggiorna la data di scadenza

5. **`invoice.payment_failed`**
   - Quando un pagamento fallisce
   - Logga l'errore (Stripe ritenta automaticamente)

## Configurazione

### 1. Environment Variable

Aggiungi al `.env.local`:

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 2. Setup in Stripe Dashboard

#### Per Test (Locale)

1. Installa Stripe CLI:
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. Accedi a Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks al server locale:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. Copia il webhook secret mostrato (inizia con `whsec_`) e aggiungilo a `.env.local`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

#### Per Produzione

1. Vai su Stripe Dashboard → **Developers** → **Webhooks**
2. Clicca **Add endpoint**
3. Inserisci URL: `https://your-domain.com/api/stripe/webhook`
4. Seleziona gli eventi da ascoltare:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copia il **Signing secret** (inizia con `whsec_`) e aggiungilo alle variabili ambiente di produzione

### 3. Verifica Funzionamento

Dopo aver configurato, puoi testare il webhook:

1. **Crea una subscription di test** nella pagina pricing
2. **Completa il pagamento** con una carta di test
3. **Controlla i logs** per vedere se il webhook è stato ricevuto
4. **Verifica il database** che la subscription sia stata attivata

## Test con Stripe CLI

Puoi simulare eventi webhook localmente:

```bash
# Simula checkout completato
stripe trigger checkout.session.completed

# Simula subscription aggiornata
stripe trigger customer.subscription.updated

# Simula subscription cancellata
stripe trigger customer.subscription.deleted
```

## Troubleshooting

### Webhook non ricevuto

- Verifica che l'URL del webhook sia corretto
- Controlla che `STRIPE_WEBHOOK_SECRET` sia impostato correttamente
- Controlla i logs di Stripe Dashboard → Webhooks → View logs

### Verifica firma fallita

- Assicurati che `STRIPE_WEBHOOK_SECRET` corrisponda al secret di Stripe
- Verifica che il body della richiesta non sia stato modificato
- Controlla i logs per dettagli sull'errore

### Subscription non attivata dopo pagamento

- Controlla i logs del webhook per errori
- Verifica che i metadata (`user_id`, `plan`) siano presenti nella checkout session
- Controlla che il database sia accessibile

### Eventi duplicati

- Stripe può inviare lo stesso evento più volte
- Il webhook è idempotente - processare lo stesso evento più volte è sicuro
- Se necessario, puoi aggiungere deduplicazione basata su `event.id`

## Security

- Il webhook verifica sempre la firma Stripe prima di processare eventi
- Solo richieste valide da Stripe vengono processate
- Tutti gli errori sono loggati per monitoring

## Monitoring

Monitora i webhook su:
- **Stripe Dashboard** → Webhooks → View logs
- **Application logs** (tutti gli eventi sono loggati)
- **Database** per verificare che le subscription siano aggiornate correttamente

