# Admin Bootstrap Setup

Guida per creare l'utente admin usando le credenziali da environment variables.

## 📋 Prerequisiti

1. Database Supabase configurato
2. Migration 001 (profiles table) applicata
3. `.env.local` con credenziali Supabase

---

## 🔧 Step 1: Configurare Variabili di Ambiente

Aggiungi queste variabili a `.env.local`:

```bash
# Admin Bootstrap Configuration
ADMIN_EMAIL=your-admin@example.com
ADMIN_PASSWORD=your-secure-password-min-8-chars
ADMIN_NAME=Admin User

# Nota: SUPABASE_SERVICE_ROLE_KEY deve già essere presente
# Lo trovi nella dashboard Supabase → Settings → API
```

### Dove Trovare le Chiavi Supabase

1. **NEXT_PUBLIC_SUPABASE_URL** (già configurato)
   - Dashboard → Settings → API → Project URL

2. **SUPABASE_SERVICE_ROLE_KEY** (necessario per bootstrap)
   - Dashboard → Settings → API → Service Role Key (secret)
   - ⚠️ **ATTENZIONE**: Questa chiave ha accesso completo al database!
   - Non committare mai nel repository
   - Usa solo lato server

### Esempio `.env.local` Completo

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Admin Bootstrap
ADMIN_EMAIL=admin@yourcompany.com
ADMIN_PASSWORD=SecurePassword123!
ADMIN_NAME=Super Admin

# Tavily API (for Web Search tool)
TAVILY_API_KEY=tvly-xxxxxxxxxxxxx
```

---

## 🚀 Step 2: Eseguire lo Script di Bootstrap

```bash
pnpm bootstrap:admin
```

### Output Atteso

```
🚀 Starting admin bootstrap process...

1️⃣ Validating configuration...
   ✅ Email: admin@yourcompany.com
   ✅ Name: Super Admin
   ✅ Password: ********************

2️⃣ Connecting to Supabase...
   ✅ Connected

3️⃣ Checking if admin user exists...
   ℹ️  User does not exist, creating...
   ✅ User created with ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx

4️⃣ Setting up admin profile...
   ✅ Admin profile configured

5️⃣ Verifying admin access...
   ✅ Admin access verified

✅ Admin bootstrap completed successfully!

Admin credentials:
   Email: admin@yourcompany.com
   Password: ********************
   Name: Super Admin

You can now log in with these credentials.
```

---

## ✅ Step 3: Verificare l'Admin

### Opzione A: Login Web

1. Vai su: `http://localhost:3000/auth/login`
2. Login con le credenziali admin
3. Vai su: `http://localhost:3000/admin`
4. ✅ Dovresti vedere l'Admin Panel

### Opzione B: Verifica Database

```sql
-- In Supabase SQL Editor
SELECT 
  p.user_id,
  p.name,
  p.role,
  u.email,
  p.created_at
FROM profiles p
JOIN auth.users u ON p.user_id = u.id
WHERE p.role = 'admin';

-- ✅ Dovresti vedere il tuo admin user
```

---

## 🔄 Eseguire Nuovamente lo Script

Lo script è **idempotente** - puoi eseguirlo più volte:

### Se l'utente esiste già e non è admin:
```
⚠️  User already exists with ID: xxx
ℹ️  User exists but is not admin, upgrading...
✅ Admin profile configured
```

### Se l'utente è già admin:
```
⚠️  User already exists with ID: xxx
✅ User is already an admin
✅ Admin bootstrap completed successfully!
```

---

## 🛠️ Funzionalità dello Script

### Validazioni

✅ **Email format** - Deve essere una email valida  
✅ **Password strength** - Minimo 8 caratteri  
✅ **Environment variables** - Tutte richieste presenti  
✅ **Supabase connection** - Service role key valida  

### Operazioni

1. **Check user existence** - Verifica se l'utente esiste già
2. **Create user** (se non esiste) - Con email auto-confermata
3. **Create/Update profile** - Con ruolo admin
4. **Verify access** - Conferma che il ruolo sia impostato correttamente

### Sicurezza

✅ **Service Role Key** - Usa chiave admin per bypassare RLS  
✅ **Auto-confirm email** - L'admin è subito attivo  
✅ **Password hashing** - Gestito automaticamente da Supabase  
✅ **Idempotente** - Sicuro eseguire più volte  

---

## 🐛 Troubleshooting

### Error: "Missing required environment variables"

```bash
Causa: ADMIN_EMAIL, ADMIN_PASSWORD, o ADMIN_NAME non configurati

Soluzione:
1. Verifica che .env.local contenga tutte e 3 le variabili
2. Verifica che non ci siano spazi extra
3. Riavvia il terminal se hai appena aggiunto le variabili
```

### Error: "Missing Supabase configuration"

```bash
Causa: NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY mancanti

Soluzione:
1. Vai su Supabase Dashboard → Settings → API
2. Copia Project URL → NEXT_PUBLIC_SUPABASE_URL
3. Copia Service Role Key → SUPABASE_SERVICE_ROLE_KEY
4. Aggiungi a .env.local
```

### Error: "Invalid ADMIN_EMAIL format"

```bash
Causa: Email non valida

Soluzione:
1. Verifica il formato: user@domain.com
2. Nessuno spazio prima/dopo l'email
```

### Error: "ADMIN_PASSWORD must be at least 8 characters"

```bash
Causa: Password troppo corta

Soluzione:
1. Usa una password di almeno 8 caratteri
2. Consigliato: Usa lettere, numeri, e simboli
```

### Error: "Failed to create user: User already registered"

```bash
Causa: L'email esiste già in Supabase Auth ma senza profile

Soluzione:
1. Lo script gestisce questo caso automaticamente
2. Se l'errore persiste, verifica manualmente:
   - Dashboard Supabase → Authentication → Users
   - Cerca l'email e nota l'ID
   - Verifica se ha un profile nella tabella profiles
```

### Error: "Failed to list users"

```bash
Causa: Service Role Key non valida o scaduta

Soluzione:
1. Verifica che SUPABASE_SERVICE_ROLE_KEY sia corretta
2. Ri-copia dalla Dashboard se necessario
3. Nota: È diversa dalla ANON_KEY!
```

---

## 🔒 Sicurezza Best Practices

### ⚠️ Service Role Key

```bash
# ❌ MAI fare questo:
git add .env.local
git commit -m "Add env"

# ✅ Invece:
# 1. .env.local è in .gitignore
# 2. Usa .env.example come template
# 3. Documenta quali variabili servono
```

### 🔐 Password Admin

```bash
# ❌ Password deboli:
ADMIN_PASSWORD=admin123
ADMIN_PASSWORD=password

# ✅ Password forti:
ADMIN_PASSWORD=MyS3cur3P@ssw0rd!
ADMIN_PASSWORD=Admin_2024_Secure!

# Best practice:
- Minimo 12+ caratteri
- Lettere maiuscole e minuscole
- Numeri
- Simboli speciali
- Non usare parole comuni
```

### 🔄 Rotation

```bash
# Per cambiare password admin:
1. Aggiorna ADMIN_PASSWORD in .env.local
2. Riesegui: pnpm bootstrap:admin
3. Lo script aggiornerà la password esistente
```

---

## 📋 Checklist Post-Bootstrap

Dopo aver eseguito lo script:

- [ ] Script completato con successo (✅ in output)
- [ ] Admin può fare login web
- [ ] Admin può accedere a `/admin`
- [ ] Admin vede "Admin Panel" page
- [ ] Admin può vedere tutti gli utenti (Users Table)
- [ ] Admin può gestire ruoli utenti
- [ ] Profile in database ha `role = 'admin'`

---

## 🎯 Prossimi Passi

Ora che hai un admin:

1. **Test Middleware**
   - Login con admin → Accedi a `/admin` ✅
   - Login con user normale → Redirect da `/admin` ✅

2. **Test Admin Panel**
   - Vedi lista utenti
   - Cambia ruolo utente (user ↔ admin)

3. **Crea Test Users**
   - Registra utenti normali via `/auth/signup`
   - Verifica che abbiano ruolo `user` di default

---

## 📚 Riferimenti

- **Script**: `scripts/bootstrap-admin.ts`
- **Command**: Definito in `package.json` → `bootstrap:admin`
- **Dependencies**: `tsx`, `dotenv`, `@supabase/supabase-js`
- **Database**: Tabella `profiles` (migration 001)
- **Auth**: Supabase Auth Admin API

---

**Admin bootstrap pronto!** 🚀

