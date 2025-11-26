# Settings Persistence - Come funzionano le impostazioni utente

## ✅ Sì, le settings sono memorizzate e ricaricate correttamente!

## Flusso Completo

### 1. **Creazione Nuovo Utente**

Quando un utente si registra:
- Il trigger `handle_new_user()` crea automaticamente un profilo nella tabella `profiles`
- Il campo `settings` viene inizializzato a `'{}'::jsonb` (oggetto JSON vuoto)
- Questo è il default del database

```sql
-- Da supabase/migrations/001_initial_schema.sql
settings JSONB DEFAULT '{}'::jsonb
```

### 2. **Primo Uso delle Settings**

Quando l'utente usa funzionalità che dipendono dalle settings (timezone, default model, ecc.):

- Le funzioni server-side (`getUserTimezone()`, `getDefaultModel()`, ecc.) chiamano `getUserSettingsFromProfile()`
- Questa funzione legge le settings dal database (che sono `{}` per nuovi utenti)
- Fa un **merge** con `DEFAULT_SETTINGS` per fornire valori predefiniti

```typescript
// src/lib/settings/utils.ts
export async function getUserSettingsFromProfile(): Promise<UserSettings> {
  const profile = await getCurrentUserProfile();
  
  if (!profile || !profile.settings) {
    return DEFAULT_SETTINGS;
  }

  const userSettings = profile.settings as Partial<UserSettings>;

  // Deep merge with defaults
  return {
    ...DEFAULT_SETTINGS,
    ...userSettings,
    // ...
  };
}
```

**Risultato**: Anche se le settings sono vuote, l'utente ottiene i valori predefiniti.

### 3. **Salvataggio delle Settings**

Quando l'utente modifica le settings nella pagina Settings:

- Il componente usa `useSettings()` hook
- Quando salva, chiama `updateUserSettings()` server action
- Le settings vengono salvate nel database nella tabella `profiles`, campo `settings`

```typescript
// src/lib/settings/actions.ts
export async function updateUserSettings(
  settings: Partial<UserSettings>
): Promise<ActionResult> {
  // ...
  const { error } = await supabase
    .from('profiles')
    .update({ settings: updatedSettings })
    .eq('user_id', profile.userId);
  // ...
}
```

**Risultato**: Le settings personalizzate dell'utente vengono salvate nel database.

### 4. **Ricarica ad Ogni Accesso/Login**

Le settings vengono caricate in modo diverso a seconda del contesto:

#### A) **Funzioni Server-Side** (timezone, default model, notifiche)
- Vengono caricate **sempre** dal database ogni volta che vengono chiamate
- Non c'è cache, quindi riflettono sempre lo stato più recente
- Esempi:
  - `getUserTimezone()` - usata nel calendar tool
  - `getDefaultModel()` - usata nel form creazione agent
  - `hasNotificationEnabled()` - usata nelle notifiche

#### B) **Pagina Settings (Client-Side)**
- Carica le settings quando la pagina viene montata tramite `useSettings()` hook
- Le settings vengono caricate dal database tramite `getUserSettings()` server action
- Se l'utente fa logout/login, le settings vengono ricaricate quando visita la pagina Settings

### 5. **Persistenza**

✅ **Le settings sono persistenti**:
- Salvate nel database (tabella `profiles`, campo `settings`)
- Persistono tra sessioni, logout/login
- Persistono tra riavvii del server
- Sono associate all'utente tramite `user_id`

## Esempio Pratico

### Scenario: Utente cambia timezone

1. **Utente va su Settings**
   - Vede timezone corrente: "Europe/Rome" (default)
   
2. **Utente cambia timezone in "America/New_York"**
   - Clicca "Save Timezone"
   - `updateUserSettings({ timezone: "America/New_York" })` viene chiamato
   - Il database viene aggiornato: `profiles.settings = { timezone: "America/New_York", ... }`

3. **Utente fa logout e login**
   - Le settings rimangono nel database

4. **Utente crea un evento nel calendario**
   - Il calendar tool chiama `getUserTimezone()`
   - Legge dal database: `"America/New_York"`
   - L'evento viene creato con il timezone corretto ✅

5. **Utente torna su Settings**
   - Vede ancora "America/New_York" ✅

## Verifica

Puoi verificare che le settings siano salvate nel database:

```sql
SELECT 
  user_id,
  name,
  settings
FROM profiles
WHERE user_id = 'YOUR_USER_ID';
```

Dovresti vedere qualcosa come:
```json
{
  "timezone": "America/New_York",
  "notifications": {
    "email": true,
    "inApp": true,
    "workflowRuns": true,
    "agentRuns": false
  },
  "preferences": {
    "defaultModel": "gpt-4o",
    "autoSave": true
  }
}
```

## Conclusione

✅ **Le settings sono completamente funzionali e persistenti:**
- ✅ Salvate nel database
- ✅ Caricate ad ogni accesso (server-side sempre, client-side quando si visita Settings)
- ✅ Persistono tra sessioni
- ✅ Merge intelligente con defaults per nuovi utenti

