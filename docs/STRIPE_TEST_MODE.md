# Stripe Test Mode - Guida Completa

## ✅ Raccomandazione: Usa le Chiavi di Test Mode Standard

**Per i test, usa SEMPRE le chiavi di Test Mode standard** (`sk_test_...` e `pk_test_...`). Non serve creare chiavi con limitazioni.

## 🔑 Tipi di Chiavi Stripe

### 1. Test Mode Keys (Per Sviluppo/Test) ✅
- **Secret Key**: `sk_test_...`
- **Publishable Key**: `pk_test_...`
- **Caratteristiche**:
  - ✅ Non addebitano carte reali
  - ✅ Funzionano solo con dati di test
  - ✅ Dashboard separato (Test mode)
  - ✅ Infinite carte di test disponibili
  - ✅ Sicure da usare in sviluppo
  - ✅ Non hanno costi

### 2. Live Mode Keys (Per Produzione) 🚀
- **Secret Key**: `sk_live_...`
- **Publishable Key**: `pk_live_...`
- **Caratteristiche**:
  - ⚠️ Addebitano carte reali
  - ⚠️ Usa SOLO in produzione
  - ⚠️ Dashboard separato (Live mode)

### 3. Restricted Keys (Opzionali) 🔐
- Chiavi con permessi limitati
- Utili per operazioni specifiche
- **Non necessarie per i test**

## 📋 Setup per Test

### Step 1: Ottieni le Chiavi di Test Mode

1. Vai su [Stripe Dashboard](https://dashboard.stripe.com)
2. Assicurati di essere in **Test mode** (toggle in alto a destra)
3. Vai su **Developers** → **API keys**
4. Copia:
   - **Publishable key** (inizia con `pk_test_`)
   - **Secret key** (inizia con `sk_test_`) - Clicca "Reveal test key"

### Step 2: Configura le Variabili Ambiente

Nel file `.env.local`:

```env
# Stripe Test Mode Keys (per sviluppo/test)
STRIPE_SECRET_KEY=sk_test_51...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...

# Stripe Price IDs (creati in Test mode)
STRIPE_PRICE_BASIC_MONTHLY=price_test_...
STRIPE_PRICE_BASIC_YEARLY=price_test_...
STRIPE_PRICE_PREMIUM_MONTHLY=price_test_...
STRIPE_PRICE_PREMIUM_YEARLY=price_test_...

# Stripe Webhook Secret (per webhook locali)
STRIPE_WEBHOOK_SECRET=whsec_test_...
```

## 🧪 Carte di Test Stripe

Stripe fornisce carte di test gratuite per simulare pagamenti:

### Carte di Test Standard

| Numero Carta | Risultato |
|--------------|-----------|
| `4242 4242 4242 4242` | Pagamento riuscito |
| `4000 0000 0000 0002` | Carta rifiutata |
| `4000 0000 0000 9995` | Fondi insufficienti |
| `4000 0025 0000 3155` | Richiede autenticazione 3D Secure |

### Altri Dettagli
- **Data scadenza**: Qualsiasi data futura (es. `12/25`)
- **CVC**: Qualsiasi 3 cifre (es. `123`)
- **CAP**: Qualsiasi (es. `12345`)

### Carte di Test Avanzate

Per testare scenari specifici, vedi: https://stripe.com/docs/testing

## 🔄 Test Mode vs Live Mode

### Test Mode (Sviluppo)
- ✅ Usa sempre in sviluppo
- ✅ Non addebitano carte reali
- ✅ Puoi testare senza rischi
- ✅ Dashboard separato
- ✅ Dati di test isolati

### Live Mode (Produzione)
- ⚠️ Usa SOLO in produzione
- ⚠️ Addebitano carte reali
- ⚠️ Dati reali e pagamenti reali

## 🔐 Sicurezza delle Chiavi di Test

### Le Chiavi di Test sono Sicure?

**Sì**, ma con alcune precauzioni:

1. **Non committare mai le chiavi**:
   - Aggiungi `.env.local` al `.gitignore`
   - Non committare file con chiavi

2. **Chiavi di test vs produzione**:
   - Le chiavi di test non possono addebitare carte reali
   - Ma possono creare customers, subscriptions, etc. in test mode
   - Non esporre mai la secret key (neanche quella di test)

3. **Best practices**:
   - Usa chiavi di test in sviluppo
   - Usa chiavi live SOLO in produzione
   - Rotazione periodica (anche per test)

## 🛠️ Testing Workflow

### 1. Sviluppo Locale
```env
# .env.local (sviluppo)
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 2. Staging/Pre-Production
```env
# Usa ancora test mode, ma con prodotti di test più realistici
STRIPE_SECRET_KEY=sk_test_...
```

### 3. Produzione
```env
# Solo quando sei pronto per pagamenti reali
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

## 📊 Dashboard Separati

Stripe ha dashboard separati per test e live:

- **Test Mode Dashboard**: https://dashboard.stripe.com/test
- **Live Mode Dashboard**: https://dashboard.stripe.com

Puoi alternare con il toggle in alto a destra.

## ⚠️ Avvertenze

1. **Non mischiare chiavi test e live**:
   - ❌ Non usare `sk_test_...` con prodotti live
   - ❌ Non usare `sk_live_...` in sviluppo

2. **Webhook separati**:
   - I webhook di test e live sono separati
   - Configura webhook separati per test e produzione

3. **Prodotti separati**:
   - Crea prodotti/prices sia in test che live mode
   - I Price IDs saranno diversi (`price_test_...` vs `price_...`)

## 🎯 Raccomandazione Finale

**Per i test, usa SEMPRE le chiavi di Test Mode standard** (`sk_test_...`).

- ✅ Sono sicure
- ✅ Non addebitano carte reali
- ✅ Facili da usare
- ✅ Non servono chiavi con limitazioni

**Non serve creare chiavi con limitazioni per i test.** Le chiavi di test mode sono già progettate per essere sicure e non addebitare carte reali.

## 📚 Risorse

- [Stripe Testing Documentation](https://stripe.com/docs/testing)
- [Test Cards](https://stripe.com/docs/testing#cards)
- [Test Mode vs Live Mode](https://stripe.com/docs/keys)

