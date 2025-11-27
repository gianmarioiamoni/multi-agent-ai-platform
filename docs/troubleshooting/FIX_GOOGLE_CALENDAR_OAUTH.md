# Fix: Google Calendar OAuth "Accesso Bloccato"

## 🔴 Problema

Quando provi a collegare Google Calendar, vedi:
```
Accesso bloccato: l'app Multi Agent AI Platform non ha completato 
la procedura di verifica di Google
```

## 🎯 Causa

L'app Google OAuth è in modalità **"Testing"** e:
1. L'utente demo (`multiagentdemouser@gmail.com`) non è nella lista dei **Test Users**
2. Mancano gli **scope** necessari per Google Calendar API

---

## ✅ Soluzione Passo-Passo

### Step 1: Aggiungere Utente Demo alla Lista Test Users

1. Vai su [Google Cloud Console](https://console.cloud.google.com/)
2. Seleziona il progetto: **Multi-Agent AI Platform**
3. Vai a: **APIs & Services** → **OAuth consent screen**
4. Scrolla fino alla sezione **"Test users"**
5. Clicca **"+ ADD USERS"**
6. Aggiungi l'email dell'utente demo:
   ```
   multiagentdemouser@gmail.com
   ```
7. Clicca **"ADD"**
8. Salva le modifiche

### Step 2: Verificare/Aggiungere Scopes per Google Calendar

Gli scope attuali potrebbero essere solo:
- `email`
- `profile`
- `openid`

**Ma servono anche scope per Calendar API:**

1. Nella stessa pagina **OAuth consent screen**
2. Vai alla sezione **"Scopes"**
3. Clicca **"ADD OR REMOVE SCOPES"**
4. Verifica che ci siano questi scope:
   - ✅ `email` (https://www.googleapis.com/auth/userinfo.email)
   - ✅ `profile` (https://www.googleapis.com/auth/userinfo.profile)
   - ✅ `openid` (openid)
   - ✅ **`https://www.googleapis.com/auth/calendar`** (Calendar access)
   - ✅ **`https://www.googleapis.com/auth/calendar.events`** (Calendar events)

5. Se mancano, aggiungi:
   - Cerca: `calendar`
   - Seleziona:
     - `.../auth/calendar` (Full Calendar access)
     - `.../auth/calendar.events` (Events access)
6. Clicca **"UPDATE"**
7. Clicca **"SAVE AND CONTINUE"**

### Step 3: Abilitare Google Calendar API

1. Vai a: **APIs & Services** → **Library**
2. Cerca: `Google Calendar API`
3. Clicca su **"Google Calendar API"**
4. Clicca **"ENABLE"**
5. Attendi qualche secondo

### Step 4: Verificare Redirect URI

Il redirect URI per Google Calendar deve essere:

```
http://localhost:3000/auth/callback/google-calendar
```

**Verifica in Google Cloud:**

1. Vai a: **APIs & Services** → **Credentials**
2. Clicca sul tuo OAuth 2.0 Client ID
3. Verifica che in **"Authorized redirect URIs"** ci sia:
   ```
   http://localhost:3000/auth/callback/google-calendar
   ```
4. Se manca, aggiungilo e salva

### Step 5: Testa di Nuovo

1. Vai su `/app/integrations`
2. Clicca **"Connect"** su Google Calendar
3. Dovresti vedere:
   - **Messaggio di avvertimento**: "App non verificata" (normale in Testing)
   - Opzione: **"Advanced"** → **"Go to Multi-Agent AI Platform (unsafe)"**
4. Clicca su **"Advanced"**
5. Clicca su **"Go to Multi-Agent AI Platform (unsafe)"**
6. Autorizza l'accesso a Calendar
7. ✅ Dovrebbe funzionare!

---

## 📋 Checklist Completa

Prima di testare, verifica:

- [ ] Utente demo (`multiagentdemouser@gmail.com`) aggiunto come Test User
- [ ] Google Calendar API abilitata
- [ ] Scope Calendar aggiunti:
  - [ ] `https://www.googleapis.com/auth/calendar`
  - [ ] `https://www.googleapis.com/auth/calendar.events`
- [ ] Redirect URI corretto: `http://localhost:3000/auth/callback/google-calendar`
- [ ] OAuth consent screen salvato

---

## 🔍 Verifica Configurazione

### Controlla Scope Attuali

1. Vai a **OAuth consent screen**
2. Sezione **"Scopes"**
3. Dovresti vedere:
   ```
   email
   profile
   openid
   https://www.googleapis.com/auth/calendar
   https://www.googleapis.com/auth/calendar.events
   ```

### Controlla Test Users

1. Sezione **"Test users"**
2. Dovresti vedere:
   ```
   multiagentdemouser@gmail.com
   (e altri eventuali utenti test)
   ```

---

## 🚨 Se Continua a Non Funzionare

### Opzione 1: Pubblicare l'App (Sconsigliato per sviluppo)

⚠️ **Non raccomandato per sviluppo locale**, ma se necessario:

1. Vai a **OAuth consent screen**
2. Scrolla in fondo
3. Clicca **"PUBLISH APP"**
4. Conferma la pubblicazione
5. ⚠️ Attenzione: Ci vorranno giorni/settimane per la verifica completa di Google

**Meglio usare Test Users per sviluppo!**

### Opzione 2: Verificare Codice

Controlla che il codice usi gli scope corretti:

```typescript
// src/lib/credentials/google-calendar.ts
// Dovrebbe includere:
const SCOPES = [
  'https://www.googleapis.com/auth/calendar',
  'https://www.googleapis.com/auth/calendar.events',
];
```

### Opzione 3: Verificare Variabili d'Ambiente

Controlla che `.env.local` contenga:

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/callback/google-calendar
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 📝 Note Importanti

### Modalità Testing vs Pubblicata

- **Testing Mode**: Solo utenti nella lista Test Users possono accedere
- **Published Mode**: Tutti possono accedere, ma richiede verifica Google (lunga)

**Per sviluppo, usa sempre Testing Mode + Test Users!**

### Scope Necessari

Per Google Calendar servono **almeno** questi scope:
- `https://www.googleapis.com/auth/calendar` - Accesso base al calendario
- `https://www.googleapis.com/auth/calendar.events` - Accesso agli eventi

**Non bastano solo email, profile, openid!**

### Redirect URI

⚠️ **Importante**: Il redirect URI per Calendar è **diverso** da quello per login:
- Login: `/auth/callback` (gestito da Supabase)
- Calendar: `/auth/callback/google-calendar` (gestito dall'app)

**Entrambi devono essere in Authorized redirect URIs!**

---

## ✅ Dopo la Configurazione

Una volta configurato correttamente:

1. ✅ Utente demo può connettere Google Calendar
2. ✅ L'app può leggere eventi futuri
3. ✅ L'app può creare eventi
4. ✅ Workflow "Meeting Preparation Assistant" funziona

---

## 🎯 Quick Fix (Risoluzione Rapida)

**Se vuoi solo testare velocemente:**

1. ✅ Aggiungi `multiagentdemouser@gmail.com` come Test User
2. ✅ Aggiungi scope Calendar API
3. ✅ Abilita Google Calendar API
4. ✅ Salva tutto
5. ✅ Riprova la connessione

**Non serve pubblicare l'app per sviluppo!**

