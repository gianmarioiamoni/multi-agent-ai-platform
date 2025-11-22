# Quick Start - Apply Migration 003

## Opzione 1: Supabase Dashboard (Consigliato)

1. **Vai su Supabase Dashboard**
   ```
   https://supabase.com/dashboard
   ```

2. **Seleziona il tuo progetto**

3. **Vai a SQL Editor**
   - Menu laterale → SQL Editor
   - Click "New Query"

4. **Copia e incolla il contenuto della migration**
   ```
   File: supabase/migrations/003_agents_and_workflows.sql
   ```

5. **Esegui la query**
   - Click "Run" o Ctrl+Enter
   - Attendi conferma di successo

6. **Verifica**
   ```sql
   -- In SQL Editor, esegui:
   SELECT * FROM agents LIMIT 1;
   -- Dovrebbe restituire le colonne senza errori
   ```

---

## Opzione 2: Supabase CLI

Se hai Supabase CLI installato:

```bash
# 1. Assicurati di essere nella root del progetto
cd /Users/gianmarioiamoni/PROGRAMMAZIONE/Projects/multi-agent-ai-platform

# 2. Push la migration
supabase db push

# 3. Verifica
supabase db diff
```

---

## Verifica Post-Migration

In Supabase Dashboard → Database → Tables, dovresti vedere:

✅ **agents** table con colonne:
- id, owner_id, name, description
- role, model, temperature, max_tokens
- tools_enabled, config, status
- created_at, updated_at

✅ **workflows** table con colonne:
- id, owner_id, name, description
- graph, status
- created_at, updated_at, last_run_at

✅ **Enums**:
- ai_model
- agent_status
- workflow_status

---

## Configura Tavily API

```bash
# 1. Registrati su Tavily
https://tavily.com

# 2. Ottieni API Key dalla dashboard

# 3. Aggiungi a .env.local
echo "TAVILY_API_KEY=tvly-xxxxxxxxxxxxx" >> .env.local

# 4. Riavvia dev server
pnpm dev
```

---

## Test Rapido

```bash
# 1. Avvia dev server
pnpm dev

# 2. Vai su
http://localhost:3000/app/agents

# 3. Dovresti vedere:
✅ Empty state "No agents yet"
✅ Button "Create Your First Agent"

# 4. Click e crea un agent
✅ Form di creazione caricato
✅ Submit crea agent
✅ Redirect a lista con agent creato
```

---

## Troubleshooting

### Error: "relation agents does not exist"

**Causa**: Migration non applicata

**Soluzione**:
1. Riapplica la migration dalla dashboard
2. Verifica che sia andata a buon fine
3. Ricarica la pagina

### Error: "permission denied for table agents"

**Causa**: RLS policies non create

**Soluzione**:
1. Verifica che TUTTA la migration sia stata eseguita
2. La migration include le RLS policies
3. Riesegui l'intera migration

### Error: "TAVILY_API_KEY not configured"

**Causa**: API key mancante

**Soluzione**:
1. Aggiungi TAVILY_API_KEY a .env.local
2. Riavvia pnpm dev
3. Riprova

---

**Migration pronta!** Ora puoi procedere con il testing della Week 3. 🚀

