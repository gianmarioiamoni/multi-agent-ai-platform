# Verifica Stato Migration Subscription

## Come verificare quali migration sono già state applicate

Esegui questa query nel SQL Editor di Supabase per verificare:

```sql
-- Verifica colonne esistenti nella tabella profiles
SELECT column_name, data_type, column_default
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

## Interpretazione risultati

### Scenario 1: Nessuna colonna subscription esiste
**Devi eseguire:**
1. ✅ `010_add_subscription_fields.sql`
2. ✅ `011_subscription_system_redesign.sql`

### Scenario 2: Esistono solo `subscription_plan`, `subscription_expires_at`, `trial_used`
**Devi eseguire solo:**
1. ✅ `011_subscription_system_redesign.sql`

### Scenario 3: Tutte le colonne esistono già
**Nessuna migration da eseguire** ✅

