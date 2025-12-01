# Subscription System Redesign

## Overview
Completa riprogettazione del sistema di abbonamenti per gestire:
- Trial automatico alla registrazione
- Transizioni tra piani (immediato da trial, fine periodo tra piani pagati)
- Disabilitazione automatica alla scadenza
- Notifiche di scadenza e disabilitazione
- Disiscrizione con ritorno a trial se disponibile

## Requirements

### 1. Trial Automatico
- **Registrazione**: Trial assegnato automaticamente (30 giorni)
- **Utenti esistenti**: Trial inizia da OGGI (30 giorni)
- **Nessun bottone trial**: Non si può attivare manualmente
- **Limiti trial**: Applicati automaticamente

### 2. Sottoscrizione Piano Pagato
- **Da trial**: Attivazione IMMEDIATA del piano pagato
- **Da piano pagato**: Nuovo piano attivo alla fine del periodo già pagato
- **Bottoni abilitati**: Solo per piani pagati (basic, premium)

### 3. Disiscrizione
- **Da piano pagato**: 
  - Se ha giorni residui trial → torna a trial
  - Se non ha giorni residui → disabilitato alla fine del periodo pagato

### 4. Disabilitazione Automatica
- **Al termine trial**: Utente disabilitato automaticamente
- **Notifiche**:
  - 2 giorni prima della scadenza
  - Alla scadenza
  - Quando viene disabilitato

## Database Schema Changes

### Nuovi Campi in `profiles`:
- `trial_days_remaining`: INTEGER - Giorni residui del trial (salvati quando si passa a piano pagato)
- `next_plan`: TEXT - Piano che sarà attivato alla fine del periodo corrente (per cambio piano)
- `plan_switch_at`: TIMESTAMPTZ - Data in cui avverrà il cambio piano
- `subscription_cancelled_at`: TIMESTAMPTZ - Data in cui è stata richiesta la disiscrizione

## Logic Flow

### Sottoscrizione Piano Pagato da Trial
1. Utente è su trial
2. Clicca "Choose Plan" su basic/premium
3. Piano attivato IMMEDIATAMENTE
4. Salvare giorni residui trial in `trial_days_remaining`
5. Impostare scadenza in base a billing cycle

### Sottoscrizione Piano Pagato da Piano Pagato
1. Utente è su piano pagato
2. Clicca "Choose Plan" su altro piano pagato
3. Piano attuale continua fino alla scadenza
4. Salvare `next_plan` e `plan_switch_at` = `subscription_expires_at`
5. Alla scadenza: attivare `next_plan`

### Disiscrizione
1. Utente è su piano pagato
2. Clicca "Cancel Subscription"
3. Se `trial_days_remaining > 0`:
   - Alla scadenza: tornare a trial con giorni residui
4. Se `trial_days_remaining = 0`:
   - Alla scadenza: disabilitare utente

### Disabilitazione Automatica
1. Cron job o scheduled function controlla `subscription_expires_at`
2. Se scaduto e non c'è `next_plan`:
   - Disabilitare utente
   - Inviare notifica

## Notifications

### Types:
- `subscription_expiring_soon`: 2 giorni prima della scadenza
- `subscription_expired`: Alla scadenza
- `subscription_disabled`: Quando l'utente viene disabilitato
- `subscription_activated`: Quando un piano viene attivato
- `subscription_switching`: Quando viene programmato un cambio piano

## Implementation Steps

1. ✅ Create migration for new fields
2. ⏳ Update subscription actions logic
3. ⏳ Remove trial button, enable paid plan buttons
4. ⏳ Implement cancellation logic
5. ⏳ Implement automatic disabling
6. ⏳ Implement notification system
7. ⏳ Create scheduled job for expirations

