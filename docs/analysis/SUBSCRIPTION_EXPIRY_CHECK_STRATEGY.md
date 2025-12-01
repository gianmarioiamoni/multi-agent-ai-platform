# Subscription Expiry Check Strategy - Analysis

## Due Approcci a Confronto

### 1. Controllo al Login (Alternative to Cron)

**Come funziona:**
- Controllo scadenze quando l'utente fa login
- Verifica stato subscription, disabilita se necessario
- Invia notifiche se scaduto

**Vantaggi:**
- ✅ Più semplice: niente cron job da configurare
- ✅ Sfrutta flusso autenticazione esistente
- ✅ Funziona subito senza setup esterno
- ✅ Costo zero (no cron service)

**Svantaggi:**
- ❌ Notifiche "2 giorni prima" non possono essere inviate al momento giusto
- ❌ Utente disabilitato solo quando fa login (potrebbe essere settimane dopo)
- ❌ Utenti sempre connessi non vengono controllati
- ❌ Dati inconsistenti: utente appare attivo anche se scaduto (fino al prossimo login)
- ❌ Le notifiche email devono essere inviate anche se utente non fa login

### 2. Cron Job (Current Implementation)

**Come funziona:**
- Job schedulato che gira giornalmente
- Controlla tutti gli utenti con scadenze prossime
- Invia notifiche e disabilita automaticamente

**Vantaggi:**
- ✅ Notifiche puntuali (2 giorni prima, alla scadenza)
- ✅ Disabilitazione automatica immediata alla scadenza
- ✅ Funziona per tutti gli utenti, anche quelli non attivi
- ✅ Dati sempre consistenti
- ✅ Professionale e affidabile

**Svantaggi:**
- ⚠️ Richiede configurazione cron (Vercel Cron, external service)
- ⚠️ Più complesso da gestire
- ⚠️ Costo potenziale (alcuni servizi cron sono a pagamento)

## Analisi Token Authentication

### Supabase Session Expiration
- **Default session duration**: 1 ora (3600 secondi)
- **Refresh token duration**: 1 settimana
- **Max session duration**: Configurabile, default 1 settimana

**Implicazioni:**
- Un utente deve rifare login almeno ogni settimana (max)
- Tuttavia, con refresh token automatici, l'utente può rimanere "sempre connesso" per settimane se usa l'app regolarmente
- Non possiamo contare sul fatto che un utente faccia login regolarmente

## Soluzione Ibrida (Consigliata)

### Approccio Combinato

1. **Cron Job (Primario)**
   - Esegue controlli giornalieri
   - Invia notifiche proattive (2 giorni prima)
   - Disabilita utenti alla scadenza
   - Gestisce transizioni piani

2. **Controllo al Login (Safety Check)**
   - Verifica stato subscription quando l'utente fa login
   - Disabilita immediatamente se scaduto (fallback)
   - Evita accesso a utenti scaduti anche se cron non ha ancora girato

### Implementazione Ibrida

```typescript
// Al login, dopo autenticazione:
1. Verifica subscription_expires_at
2. Se scaduto e non disabilitato → disabilita immediatamente
3. Se scaduto e disabilitato → mostra messaggio
4. Se in scadenza → mostra banner di avviso
```

**Vantaggi Soluzione Ibrida:**
- ✅ Notifiche puntuali (cron)
- ✅ Disabilitazione immediata alla scadenza (cron)
- ✅ Safety check al login (fallback per casi edge)
- ✅ Migliore UX: banner avvisi in-app quando necessario
- ✅ Resiliente: funziona anche se cron ha problemi temporanei

## Raccomandazione

**Usare entrambe le soluzioni:**

1. **Cron Job** come soluzione primaria
   - Gestisce tutto in modo automatico
   - Notifiche proattive
   - Disabilitazione puntuale

2. **Check al Login** come safety net
   - Verifica rapida quando l'utente accede
   - Disabilita se scaduto (backup)
   - Mostra avvisi in-app

Questo approccio garantisce:
- Affidabilità (doppio controllo)
- UX migliore (avvisi in-app + email)
- Resilienza (funziona anche se cron ha problemi)

## Implementazione Proposta

### Modifiche Necessarie

1. **Mantenere cron job** (già implementato)
2. **Aggiungere check al login** in:
   - `src/app/auth/callback/route.ts` (OAuth callback)
   - `src/lib/auth/actions.ts` (email/password login)
   - `src/app/app/layout.tsx` (verifica ad ogni richiesta autenticata)

3. **Aggiungere banner in-app** per avvisi subscription

Questo è il miglior compromesso tra semplicità e robustezza.

