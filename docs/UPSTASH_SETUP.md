# Upstash Redis Setup Guide

Questa guida ti aiuterà a configurare Upstash Redis per il rate limiting del progetto.

## Perché Upstash Redis?

- ✅ **Serverless-native**: Perfetto per Next.js e Vercel
- ✅ **Velocità**: Latenza sub-millisecondo
- ✅ **Scalabilità**: Gestisce milioni di richieste/secondo
- ✅ **Tier gratuito**: 10K richieste/giorno gratis
- ✅ **Algoritmi avanzati**: Sliding window per rate limiting fluido

## Step 1: Creare un Account Upstash

1. Vai su [https://upstash.com](https://upstash.com)
2. Clicca su "Sign Up" e crea un account (puoi usare GitHub/Google)
3. Completa la registrazione

## Step 2: Creare un Database Redis

1. Nel dashboard Upstash, clicca su **"Create Database"**
2. Configura il database:
   - **Name**: `multi-agent-ai-platform-rate-limiting`
   - **Type**: Redis
   - **Region**: Scegli la regione più vicina alla tua applicazione
   - **Tier**: Free (per iniziare, puoi upgrade dopo)
3. Clicca su **"Create"**

## Step 3: Ottenere le Credenziali

1. Dopo la creazione, clicca sul database appena creato
2. Vai alla tab **"REST API"** (o **"Details"**)
3. Troverai:
   - **UPSTASH_REDIS_REST_URL**: URL del database
   - **UPSTASH_REDIS_REST_TOKEN**: Token di autenticazione

⚠️ **IMPORTANTE**: Copia entrambi i valori e tienili al sicuro!

## Step 4: Configurare le Variabili d'Ambiente

Aggiungi le seguenti variabili al tuo `.env.local`:

```env
# Upstash Redis (per rate limiting)
UPSTASH_REDIS_REST_URL=https://your-database-name.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

**Esempio**:
```env
UPSTASH_REDIS_REST_URL=https://bold-lion-12345.upstash.io
UPSTASH_REDIS_REST_TOKEN=AXxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Step 5: Verificare la Configurazione

Il rate limiting funzionerà automaticamente una volta configurato. Se le variabili non sono configurate, il sistema userà un fallback che permette tutte le richieste (con un warning nel log).

Per testare:

1. Avvia l'applicazione: `pnpm dev`
2. Verifica nei log del server che non ci siano errori di connessione
3. Prova a fare più richieste rapide (oltre il limite) per testare il rate limiting

## Configurazione Rate Limits

I rate limits predefiniti sono:

- **Agent Execution**: 10 richieste per minuto
- **Workflow Execution**: 5 richieste per 5 minuti

Puoi modificarli in `src/lib/rate-limiting/rate-limiter.ts`.

## Monitoraggio

Nel dashboard Upstash puoi:
- Vedere il numero di richieste
- Monitorare l'utilizzo
- Vedere le metriche di performance
- Gestire il database

## Costi

### Tier Gratuito
- ✅ 10,000 richieste/giorno
- ✅ Database persistente
- ✅ Supporto community

### Tier A Pagamento (oltre il free tier)
- 💰 ~$0.20 per 1M richieste
- Nessun costo fisso mensile
- Pay-as-you-go

## Troubleshooting

### Errore: "Rate limiting disabled: Upstash Redis not configured"

**Causa**: Le variabili d'ambiente non sono configurate.

**Soluzione**: 
1. Verifica che `.env.local` contenga `UPSTASH_REDIS_REST_URL` e `UPSTASH_REDIS_REST_TOKEN`
2. Riavvia il server di sviluppo

### Errore: "Invalid token" o "Connection refused"

**Causa**: Credenziali errate o database non raggiungibile.

**Soluzione**:
1. Verifica che le credenziali nel dashboard Upstash siano corrette
2. Controlla che il database sia attivo
3. Verifica la regione del database (deve essere raggiungibile)

### Rate limiting non funziona

**Causa**: Possibile problema di configurazione o fallback attivo.

**Soluzione**:
1. Controlla i log del server per errori
2. Verifica che le variabili d'ambiente siano caricate correttamente
3. Controlla il dashboard Upstash per vedere se le richieste arrivano

## Documentazione Aggiuntiva

- [Upstash Documentation](https://docs.upstash.com/)
- [@upstash/ratelimit Documentation](https://docs.upstash.com/ratelimit)
- [@upstash/redis Documentation](https://docs.upstash.com/redis)

