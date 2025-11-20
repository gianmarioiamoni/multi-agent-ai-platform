# Supabase Setup Guide

Questa guida ti aiuterà a configurare Supabase per il progetto Multi-Agent AI Platform.

## Step 1: Creare un Progetto Supabase

1. Vai su [https://supabase.com](https://supabase.com)
2. Fai login o crea un account
3. Clicca su "New Project"
4. Compila i campi:
   - **Name**: `multi-agent-ai-platform`
   - **Database Password**: Scegli una password sicura (salvala!)
   - **Region**: Scegli la regione più vicina
   - **Pricing Plan**: Free tier va bene per lo sviluppo
5. Clicca su "Create new project"
6. Attendi qualche minuto che il progetto venga inizializzato

## Step 2: Ottenere le Credenziali

1. Nel tuo progetto Supabase, vai su **Settings** → **API**
2. Troverai:
   - **Project URL**: copia questo valore
   - **anon/public key**: copia questo valore
   - **service_role key**: copia questo valore (⚠️ IMPORTANTE: tieni questo valore segreto!)

## Step 3: Configurare le Variabili d'Ambiente

1. Apri il file `.env.local` nella root del progetto
2. Sostituisci i placeholder con i valori reali:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 4: Eseguire la Migration del Database

### Opzione A: Tramite Dashboard Supabase (Consigliato per iniziare)

1. Nel tuo progetto Supabase, vai su **SQL Editor**
2. Clicca su "New query"
3. Copia tutto il contenuto del file `supabase/migrations/001_initial_schema.sql`
4. Incollalo nell'editor SQL
5. Clicca su "Run" per eseguire la migration
6. Verifica che non ci siano errori

### Opzione B: Tramite Supabase CLI (Per progetti più avanzati)

```bash
# Installa Supabase CLI (se non l'hai già fatto)
npm install -g supabase

# Inizializza Supabase nel progetto
supabase init

# Collega il progetto locale a quello remoto
supabase link --project-ref your-project-ref

# Esegui le migrations
supabase db push
```

## Step 5: Configurare Google OAuth (Opzionale per Sprint 1)

1. Nel tuo progetto Supabase, vai su **Authentication** → **Providers**
2. Trova **Google** nell'elenco dei provider
3. Abilita il toggle "Enable"
4. Vai su [Google Cloud Console](https://console.cloud.google.com/)
5. Crea un nuovo progetto o seleziona uno esistente
6. Vai su **APIs & Services** → **Credentials**
7. Clicca su "Create Credentials" → "OAuth 2.0 Client ID"
8. Configura:
   - **Application type**: Web application
   - **Name**: Multi-Agent AI Platform
   - **Authorized redirect URIs**: 
     - `https://your-project.supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback` (per sviluppo locale)
9. Copia **Client ID** e **Client Secret**
10. Torna su Supabase e incolla i valori
11. Salva le modifiche

## Step 6: Verificare l'Installazione

1. Riavvia il server di sviluppo Next.js:
   ```bash
   pnpm dev
   ```

2. Verifica che non ci siano errori di connessione a Supabase nei log

## Step 7: Creare l'Utente Admin (Eseguiremo questo script nel prossimo step)

Lo script `bootstrap:admin` verrà creato nello Sprint 1, Settimana 2.
Per ora, puoi creare manualmente un utente admin:

1. Vai su **Authentication** → **Users** nel dashboard Supabase
2. Clicca su "Add user" → "Create new user"
3. Compila:
   - **Email**: `admin@platform.local` (o l'email che preferisci)
   - **Password**: scegli una password sicura
4. Dopo aver creato l'utente, vai su **SQL Editor**
5. Esegui questa query per impostarlo come admin:

```sql
UPDATE profiles 
SET role = 'admin'
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'admin@platform.local'
);
```

## Struttura del Database Creata

La migration ha creato:

- **Tabella `profiles`**: Profili utente con ruoli (user/admin)
- **RLS Policies**: Sicurezza a livello di riga
- **Triggers**: Auto-creazione profilo alla registrazione
- **Indexes**: Per performance ottimali

## Prossimi Passi

Dopo aver completato questo setup:
1. ✅ Supabase è configurato
2. ⏭️ Implementare le pagine di autenticazione (signup/login)
3. ⏭️ Creare il layout base dell'applicazione
4. ⏭️ Implementare il middleware per proteggere le route

## Troubleshooting

### Errore: "Invalid API credentials"
- Verifica che le variabili d'ambiente nel file `.env.local` siano corrette
- Assicurati di aver copiato le chiavi complete (sono molto lunghe)
- Riavvia il server di sviluppo

### Errore: "relation 'profiles' does not exist"
- La migration non è stata eseguita correttamente
- Vai su SQL Editor e riesegui il contenuto di `001_initial_schema.sql`

### Google OAuth non funziona
- Verifica che gli URL di redirect siano corretti
- Assicurati che il progetto Google Cloud abbia gli OAuth consent screen configurati
- Controlla che il dominio sia autorizzato nelle impostazioni

## Risorse Utili

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Guide](https://supabase.com/docs/guides/auth)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)

