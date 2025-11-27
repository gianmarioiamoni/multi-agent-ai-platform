# Google Calendar Integration Setup Guide

Questa guida ti aiuterà a configurare l'integrazione con Google Calendar per il Calendar tool.

## Prerequisiti

1. Account Google con accesso a Google Cloud Console
2. Progetto Google Cloud configurato
3. Google Calendar API abilitata

## Setup Google Cloud Project

### 1. Crea un progetto Google Cloud

1. Vai su [Google Cloud Console](https://console.cloud.google.com/)
2. Clicca su "Select a project" → "New Project"
3. Inserisci un nome (es. "Multi-Agent AI Platform")
4. Clicca "Create"

### 2. Abilita Google Calendar API

1. Nel menu, vai su **APIs & Services** → **Library**
2. Cerca "Google Calendar API"
3. Clicca su "Google Calendar API"
4. Clicca "Enable"

### 3. Configura OAuth Consent Screen

1. Vai su **APIs & Services** → **OAuth consent screen**
2. Scegli **External** (per sviluppo/test) o **Internal** (per Workspace)
3. Compila i campi obbligatori:
   - **App name**: Multi-Agent AI Platform
   - **User support email**: la tua email
   - **Developer contact information**: la tua email
4. Clicca "Save and Continue"
5. **Scopes**: Aggiungi i seguenti:
   - `https://www.googleapis.com/auth/calendar.events`
   - `https://www.googleapis.com/auth/calendar.readonly`
6. Clicca "Save and Continue"
7. Aggiungi test users (se External) - aggiungi la tua email
8. Clicca "Save and Continue"

### 4. Crea OAuth 2.0 Credentials

⚠️ **IMPORTANTE**: Se hai già configurato Google OAuth per l'autenticazione (login/signup), puoi usare lo **STESSO** OAuth Client ID per Google Calendar. In questo caso, vai direttamente al punto 4.1 per aggiungere il nuovo redirect URI.

1. Vai su **APIs & Services** → **Credentials**
2. Clicca "Create Credentials" → "OAuth client ID" (oppure modifica quello esistente)
3. Scegli **Web application**
4. Configura:
   - **Name**: Multi-Agent AI Platform Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (per sviluppo)
     - `https://yourdomain.com` (per produzione)
   - **Authorized redirect URIs**:
     - `https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback` (per autenticazione Supabase - se già presente, NON rimuoverlo)
     - `http://localhost:3000/auth/callback` (per autenticazione locale - se già presente, NON rimuoverlo)
     - `http://localhost:3000/auth/callback/google-calendar` (per integrazione Google Calendar)
     - `https://yourdomain.com/auth/callback/google-calendar` (per produzione)
     
     ⚠️ **IMPORTANTE**: Aggiungi il nuovo URI `/auth/callback/google-calendar` senza rimuovere quelli esistenti per l'autenticazione!
5. Clicca "Create" (o "Save" se stai modificando)
6. **IMPORTANTE**: Copia il **Client ID** e **Client Secret** che appariranno (o usa quelli già esistenti)

## Configurazione Progetto

### 1. Aggiungi variabili ambiente

⚠️ **IMPORTANTE**: Se hai già configurato Google OAuth per l'autenticazione, hai già `GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` nel tuo `.env.local`. Non serve cambiarli, usa gli stessi valori!

Aggiungi al file `.env.local`:

```bash
# Google OAuth (se non già presenti)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# Google Calendar redirect URI (opzionale - il codice userà NEXT_PUBLIC_APP_URL/auth/callback/google-calendar se non specificato)
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback/google-calendar

# Encryption key per stored_credentials (genera con: openssl rand -base64 32)
CREDENTIALS_ENCRYPTION_KEY=your-32-character-encryption-key
```

**Nota**: La variabile `GOOGLE_REDIRECT_URI` è opzionale. Se non la specifichi, il codice userà automaticamente `${NEXT_PUBLIC_APP_URL}/auth/callback/google-calendar`. La variabile `GOOGLE_REDIRECT_URI` è usata SOLO per l'integrazione Google Calendar, NON per l'autenticazione Google (che usa gli URI di Supabase).

### 2. Genera Encryption Key

```bash
openssl rand -base64 32
```

Usa questo valore per `CREDENTIALS_ENCRYPTION_KEY`.

## Funzionalità Disponibili

Dopo la configurazione, gli agenti potranno:

1. **Listare eventi futuri**: `listUpcomingEvents(startDate, endDate, maxResults)`
2. **Creare eventi**: `createEvent(title, start, end, attendees, description)`

## Security Notes

- ✅ I token OAuth sono salvati **cifrati** nel database
- ✅ Ogni utente può collegare solo il proprio account Google
- ✅ RLS policies garantiscono che solo l'utente proprietario possa accedere alle proprie credenziali
- ✅ I token scadono automaticamente e vengono rinnovati quando necessario

## Troubleshooting

### Problema: "redirect_uri_mismatch"
**Soluzione**: 
1. In Google Cloud Console, vai su **APIs & Services** → **Credentials**
2. Clicca sul tuo OAuth 2.0 Client ID
3. Verifica che in **Authorized redirect URIs** siano presenti **TUTTI** questi URI:
   - `https://YOUR_SUPABASE_PROJECT.supabase.co/auth/v1/callback` (per autenticazione - NON rimuovere!)
   - `http://localhost:3000/auth/callback` (per autenticazione locale - NON rimuovere!)
   - `http://localhost:3000/auth/callback/google-calendar` (per integrazione Calendar - **Aggiungi questo**)
4. Se manca `/auth/callback/google-calendar`, aggiungilo e salva
5. **IMPORTANTE**: NON rimuovere gli URI esistenti per l'autenticazione, aggiungi solo quello nuovo per Calendar!

**Nota**: Puoi avere più URI di redirect configurati contemporaneamente nello stesso OAuth Client ID. L'autenticazione Google e l'integrazione Calendar possono usare lo stesso Client ID con URI diversi.

### Problema: "access_denied"
**Soluzione**: 
- Verifica che l'utente sia aggiunto come "Test User" nello OAuth consent screen
- Verifica che gli scopes richiesti siano corretti

### Problema: Token non salvati
**Verifica**:
- Che `CREDENTIALS_ENCRYPTION_KEY` sia configurato
- Che la migrazione `005_stored_credentials.sql` sia applicata
- Console del browser/server per errori

---

**Setup completato!** Ora puoi procedere con la connessione di Google Calendar nella pagina Integrations.

