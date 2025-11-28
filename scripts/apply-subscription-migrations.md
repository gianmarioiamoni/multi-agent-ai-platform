# Guida: Applicare Migration Subscription

## Passo 1: Verifica stato attuale

Esegui questa query nel SQL Editor di Supabase:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name IN (
    'subscription_plan',
    'subscription_expires_at', 
    'trial_used',
    'trial_days_remaining',
    'next_plan',
    'plan_switch_at',
    'subscription_cancelled_at'
  )
ORDER BY column_name;
```

## Passo 2: Esegui le migration necessarie

### Se NON hai ancora le colonne base (subscription_plan, subscription_expires_at, trial_used):

1. **Vai su Supabase Dashboard** → SQL Editor
2. **Copia e incolla** il contenuto di `supabase/migrations/010_add_subscription_fields.sql`
3. **Esegui** la query
4. **Verifica** che non ci siano errori

### Poi esegui la migration 011:

1. **Copia e incolla** il contenuto di `supabase/migrations/011_subscription_system_redesign.sql`
2. **Esegui** la query
3. **Verifica** che non ci siano errori

### Se hai già le colonne base (subscription_plan, subscription_expires_at, trial_used):

1. **Vai su Supabase Dashboard** → SQL Editor
2. **Copia e incolla** il contenuto di `supabase/migrations/011_subscription_system_redesign.sql`
3. **Esegui** la query
4. **Verifica** che non ci siano errori

## Passo 3: Verifica finale

Esegui questa query per verificare che tutte le colonne siano state create:

```sql
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name IN (
    'subscription_plan',
    'subscription_expires_at',
    'trial_used',
    'trial_days_remaining',
    'next_plan',
    'plan_switch_at',
    'subscription_cancelled_at'
  )
ORDER BY column_name;
```

**Dovresti vedere 7 colonne.**

## Passo 4: Verifica dati inizializzati

Verifica che gli utenti esistenti abbiano il trial assegnato:

```sql
SELECT 
  id,
  role,
  subscription_plan,
  subscription_expires_at,
  trial_used,
  trial_days_remaining,
  created_at
FROM profiles
WHERE role = 'user' 
  AND is_demo = false
LIMIT 5;
```

**Gli utenti dovrebbero avere:**
- `subscription_plan = 'trial'`
- `subscription_expires_at` = data futura (30 giorni da oggi)
- `trial_used = false`
- `trial_days_remaining` = numero di giorni rimanenti

## ⚠️ Note importanti

1. Le migration usano `IF NOT EXISTS` quindi sono idempotenti (puoi eseguirle più volte)
2. La migration 010 inizializza il trial per gli utenti esistenti **da OGGI** (non dalla data di creazione)
3. La migration 011 calcola automaticamente i `trial_days_remaining` per gli utenti su trial
4. Se ci sono errori, controlla i log in Supabase Dashboard → Logs

## ✅ Completato

Una volta eseguite le migration:
- Gli utenti esistenti avranno il trial assegnato
- Nuovi utenti otterranno automaticamente il trial alla registrazione
- Il sistema sarà pronto per gestire sottoscrizioni e disiscrizioni

