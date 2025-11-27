# Testing Guide - Sprint 2 Week 3

Guida completa per testare l'implementazione degli Agents e Web Search Tool.

## 📋 Prerequisiti

### 1. Applicare la Migration

Applica la migration al database Supabase:

```bash
# Opzione 1: Dalla dashboard Supabase
1. Vai su https://supabase.com/dashboard
2. Seleziona il tuo progetto
3. SQL Editor → New Query
4. Copia il contenuto di: supabase/migrations/003_agents_and_workflows.sql
5. Esegui la query

# Opzione 2: Con Supabase CLI (se installato)
supabase db push
```

### 2. Configurare Tavily API (Web Search)

```bash
# 1. Registrati su Tavily
https://tavily.com

# 2. Ottieni API key dalla dashboard

# 3. Aggiungi a .env.local
echo "TAVILY_API_KEY=tvly-xxxxxxxxxx" >> .env.local
```

### 3. Avviare il Server

```bash
pnpm dev
```

---

## 🧪 Test 1: Middleware Protection

Verifica che le route siano protette.

### Test 1.1: Route /app/* (User Authenticated)

```bash
# Test: Accesso senza autenticazione
1. Apri browser in modalità incognito
2. Vai su: http://localhost:3000/app/agents
3. ✅ Dovresti essere reindirizzato a /auth/login
```

### Test 1.2: Route /admin/* (Admin Only)

```bash
# Test: Accesso con utente normale
1. Login con utente NON admin
2. Vai su: http://localhost:3000/admin
3. ✅ Dovresti essere reindirizzato a /app/dashboard

# Test: Accesso con admin
1. Login con utente admin
2. Vai su: http://localhost:3000/admin
3. ✅ Dovresti vedere l'Admin Panel
```

---

## 🧪 Test 2: Agents List Page

Testa la pagina di lista agents.

### Test 2.1: Empty State

```bash
1. Login come utente (non admin)
2. Vai su: http://localhost:3000/app/agents
3. ✅ Dovresti vedere "No agents yet"
4. ✅ Dovresti vedere il bottone "Create Your First Agent"
```

### Test 2.2: Navigazione

```bash
1. Dalla empty state, clicca "Create Your First Agent"
2. ✅ Dovresti essere reindirizzato a /app/agents/create
3. ✅ Dovresti vedere il form "Create AI Agent"
```

---

## 🧪 Test 3: Agent Builder Form

Testa il form di creazione agent completo.

### Test 3.1: Validazione Campi

```bash
# Test: Name richiesto
1. Lascia "Agent Name" vuoto
2. Compila il resto
3. Clicca "Create Agent"
4. ✅ Dovresti vedere errore: "Name is required"

# Test: Role minimo 10 caratteri
1. Inserisci "Test" in "Agent Role"
2. Compila il resto
3. Clicca "Create Agent"
4. ✅ Dovresti vedere errore: "Role must be at least 10 characters"
```

### Test 3.2: Selezione Model

```bash
1. Clicca su ciascun modello
2. ✅ Dovresti vedere il modello selezionato evidenziato
3. ✅ Dovresti vedere il checkmark sul modello selezionato
4. ✅ Dovresti vedere i dettagli (cost, max tokens)
```

### Test 3.3: Sliders (Temperature & Max Tokens)

```bash
# Test: Temperature Slider
1. Muovi lo slider Temperature
2. ✅ Il valore dovrebbe aggiornarsi in tempo reale
3. ✅ Range: 0.0 - 2.0

# Test: Max Tokens Slider
1. Muovi lo slider Max Tokens
2. ✅ Il valore dovrebbe aggiornarsi in tempo reale
3. ✅ Range: 100 - 4096
```

### Test 3.4: Tools Selection

```bash
1. Seleziona "Web Search"
2. ✅ Dovrebbe essere checkato
3. ✅ Il bordo del card dovrebbe diventare primary
4. ✅ Lo sfondo dovrebbe diventare primary/5

# Test: Coming Soon Tools
1. Prova a selezionare "Email", "Calendar", "Database Operations"
2. ✅ Dovrebbero essere disabilitati
3. ✅ Dovrebbero mostrare badge "Coming Soon"
```

---

## 🧪 Test 4: Creazione Agent

Crea un agent completo.

### Test 4.1: Agent Base (Senza Tools)

```bash
# Dati Test:
Name: Research Assistant
Description: Helps with research tasks
Role: You are a helpful research assistant that provides accurate and detailed information on any topic. You analyze questions carefully and provide comprehensive answers with sources when possible.
Model: GPT-4o Mini
Temperature: 0.7
Max Tokens: 2000
Tools: (nessuno selezionato)

# Esegui:
1. Compila tutti i campi
2. NON selezionare alcun tool
3. Clicca "Create Agent"

# Risultato atteso:
✅ Toast success: "Agent created successfully!"
✅ Redirect a /app/agents
✅ Dovresti vedere il tuo agent nella lista
✅ Nota: Mostra warning "💡 Select at least one tool..."
```

### Test 4.2: Agent con Web Search

```bash
# Dati Test:
Name: Web Research Agent
Description: AI agent that searches the web for information
Role: You are an expert web researcher. You search the web for accurate, up-to-date information and provide comprehensive summaries with sources.
Model: GPT-4o Mini
Temperature: 0.5
Max Tokens: 3000
Tools: ✅ Web Search

# Esegui:
1. Compila tutti i campi
2. Seleziona "Web Search"
3. Clicca "Create Agent"

# Risultato atteso:
✅ Toast success: "Agent created successfully!"
✅ Redirect a /app/agents
✅ Agent nella lista con:
   - Nome: "Web Research Agent"
   - Description: "AI agent that searches..."
   - Model: "GPT-4o Mini"
   - Status: "active" (badge verde)
   - Tool badge: "Web Search" (badge primary)
```

### Test 4.3: Creazione Multipla

```bash
# Crea 3-4 agents diversi con configurazioni varie

Agent 1: Content Writer
- Model: GPT-4o
- Temperature: 0.9 (creative)
- Tools: nessuno

Agent 2: Data Analyst
- Model: GPT-4 Turbo
- Temperature: 0.3 (focused)
- Tools: Web Search

Agent 3: Email Assistant
- Model: GPT-3.5 Turbo
- Temperature: 0.7
- Tools: Web Search (Email in futuro)

# Risultato atteso:
✅ Tutti gli agents creati
✅ Lista con grid responsive (1-3 colonne)
✅ Ogni card mostra le info corrette
✅ Filtri/ordinamento corretto (più recente prima)
```

---

## 🧪 Test 5: Agents List Display

Testa la visualizzazione della lista con agents.

### Test 5.1: Card Layout

```bash
1. Vai su /app/agents
2. Verifica ogni card:

✅ Header:
   - Nome agent prominente
   - Status badge nell'angolo (colore corretto)
   - Description (se presente, max 2 righe)

✅ Content:
   - Icona + nome modello
   - Tools section con badge
   - Data creazione in formato leggibile

✅ Interattività:
   - Hover: bordo diventa primary/50
   - Click: dovrebbe aprire dettaglio (route /app/agents/:id)
```

### Test 5.2: Responsive Layout

```bash
# Desktop (>= 1024px)
✅ Grid 3 colonne

# Tablet (768px - 1023px)
✅ Grid 2 colonne

# Mobile (< 768px)
✅ Grid 1 colonna
```

### Test 5.3: Status Badges

```bash
# Status colors:
✅ active: Verde (bg-green-500/20, text-green-400, border-green-500/30)
✅ inactive: Grigio
✅ archived: Arancione

# Nota: Per ora tutti sono "active"
# Per testare altri status, modificare manualmente nel DB
```

---

## 🧪 Test 6: Web Search Tool (Backend)

Testa il Web Search tool direttamente.

### Test 6.1: Verifica Configurazione

```bash
# Verifica che TAVILY_API_KEY sia configurato
pnpm verify:supabase
# oppure
echo $TAVILY_API_KEY
```

### Test 6.2: Test Tool in Console

Crea file temporaneo per testare:

```typescript
// scripts/test-web-search.ts
import { webSearchTool } from '../src/lib/tools/web-search';

async function testWebSearch() {
  console.log('Testing Web Search Tool...\n');
  
  // Test 1: Basic search
  const result1 = await webSearchTool.execute({
    query: 'Latest AI developments',
    maxResults: 3,
  });
  console.log('Test 1 - Basic Search:', result1);
  
  // Test 2: Empty query (should fail)
  const result2 = await webSearchTool.execute({
    query: '',
  });
  console.log('Test 2 - Empty Query:', result2);
  
  // Test 3: Many results
  const result3 = await webSearchTool.execute({
    query: 'OpenAI GPT-4',
    maxResults: 10,
  });
  console.log('Test 3 - Many Results:', result3);
}

testWebSearch();
```

```bash
# Esegui il test
pnpm tsx scripts/test-web-search.ts

# Risultati attesi:
✅ Test 1: success: true, data con 3 risultati
✅ Test 2: success: false, error: "Search query is required"
✅ Test 3: success: true, data con 10 risultati
✅ Execution time < 5000ms per query
```

### Test 6.3: Test Tool Registry

```bash
# Test in console browser o Node
import { getTool, executeTool, isToolAvailable } from '@/lib/tools/registry';

// Test 1: Get tool
const tool = getTool('web_search');
console.log(tool); // ✅ Dovrebbe restituire web search tool

// Test 2: Execute tool
const result = await executeTool('web_search', {
  query: 'test query',
  maxResults: 5,
});
console.log(result); // ✅ Dovrebbe eseguire la ricerca

// Test 3: Check availability
const available = isToolAvailable('web_search');
console.log(available); // ✅ true se TAVILY_API_KEY configurato

// Test 4: Tool non esistente
const invalid = getTool('invalid_tool');
console.log(invalid); // ✅ undefined
```

---

## 🧪 Test 7: Error Handling

Testa la gestione degli errori.

### Test 7.1: Form Validation Errors

```bash
1. Vai su /app/agents/create
2. Lascia campi richiesti vuoti
3. Clicca "Create Agent"
4. ✅ Errori mostrati sotto i campi
5. ✅ Nessun submit al server
```

### Test 7.2: Network Errors

```bash
# Simula errore di rete:
1. Apri DevTools → Network
2. Throttle to "Offline"
3. Prova a creare un agent
4. ✅ Toast error: "An unexpected error occurred"
5. ✅ Form rimane compilato
6. ✅ Nessun redirect
```

### Test 7.3: Web Search Timeout

```bash
# Simula timeout (richiede modifica temporanea):
1. Modifica WEB_SEARCH_TIMEOUT a 1ms in web-search.ts
2. Esegui test web search
3. ✅ Dovrebbe ricevere: "Search request timed out"
4. ✅ Retry automatico (2 tentativi)
```

---

## 🧪 Test 8: Database Verification

Verifica che i dati siano salvati correttamente.

### Test 8.1: Check Agents Table

```sql
-- Esegui in Supabase SQL Editor

-- 1. Lista tutti gli agents
SELECT * FROM agents ORDER BY created_at DESC;

-- ✅ Verifica:
-- - owner_id corrisponde al tuo user_id
-- - name, description, role salvati correttamente
-- - model, temperature, max_tokens corretti
-- - tools_enabled array corretto
-- - status = 'active'
-- - created_at e updated_at popolati
```

### Test 8.2: Check RLS Policies

```sql
-- Test RLS: Non dovresti vedere agents di altri utenti

-- 1. Crea un secondo utente
-- 2. Crea agents con entrambi gli utenti
-- 3. Verifica che ogni utente veda solo i propri agents

-- Query come user 1:
SELECT * FROM agents;
-- ✅ Dovresti vedere SOLO i tuoi agents

-- Query come admin:
SELECT * FROM agents;
-- ✅ Dovresti vedere TUTTI gli agents
```

---

## 🧪 Test 9: Performance

Verifica le performance.

### Test 9.1: Page Load Time

```bash
# Con DevTools:
1. Network → Disable cache
2. Ricarica /app/agents
3. ✅ First Contentful Paint < 1s
4. ✅ Time to Interactive < 2s
```

### Test 9.2: Web Search Performance

```bash
# Test execution time:
1. Esegui 5 ricerche consecutive
2. ✅ Media execution time < 3s
3. ✅ Timeout dopo 10s
4. ✅ Retry funziona entro 5s totali
```

---

## 🧪 Test 10: Navigation & UX

Testa il flusso utente completo.

### Test 10.1: Full User Flow

```bash
# Scenario: Nuovo utente che crea primo agent

1. Login → /app/dashboard
   ✅ Sidebar visibile con "Agents" link

2. Click "Agents" in sidebar
   ✅ Vai a /app/agents
   ✅ Empty state mostrato

3. Click "Create Your First Agent"
   ✅ Vai a /app/agents/create
   ✅ Form vuoto con defaults

4. Compila form e submit
   ✅ Loading state su button
   ✅ Button disabilitato durante submit
   ✅ Toast success

5. Redirect automatico a /app/agents
   ✅ Agent appena creato nella lista
   ✅ Badge "active" visibile
   ✅ Tools mostrati correttamente

6. Click sul card agent
   ✅ Dovrebbe aprire /app/agents/:id
   ✅ (Nota: Questa pagina sarà implementata in Week 4)
```

### Test 10.2: Cancel Flow

```bash
1. Vai su /app/agents/create
2. Inizia a compilare il form
3. Click "Cancel"
4. ✅ Redirect a /app/agents
5. ✅ Nessun agent creato
```

---

## 📊 Checklist Completa

### Database
- [ ] Migration 003 applicata correttamente
- [ ] Tabella `agents` esiste
- [ ] Tabella `workflows` esiste
- [ ] Enum types creati
- [ ] RLS policies attive

### Backend
- [ ] Server actions funzionano
- [ ] getAgents() restituisce lista
- [ ] createAgent() crea agent
- [ ] Web Search tool configurato
- [ ] Tool registry funziona

### Frontend - Agents List
- [ ] Empty state mostrato correttamente
- [ ] Lista agents mostrata (se esistono)
- [ ] Card layout responsive
- [ ] Status badges color-coded
- [ ] Tools badges mostrati
- [ ] Click su card funziona

### Frontend - Agent Builder
- [ ] Form si carica correttamente
- [ ] Tutti i campi sono editabili
- [ ] Validazione funziona
- [ ] Model selection funziona
- [ ] Sliders funzionano
- [ ] Tools checkboxes funzionano
- [ ] Submit crea agent
- [ ] Toast notifications funzionano
- [ ] Redirect dopo submit

### Web Search Tool
- [ ] TAVILY_API_KEY configurato
- [ ] Tool execute funziona
- [ ] Timeout funziona (10s)
- [ ] Retry funziona (2 tentativi)
- [ ] Error handling completo
- [ ] Logging dettagliato

### Middleware
- [ ] /app/* richiede auth
- [ ] /admin/* richiede admin role
- [ ] Redirect funzionano
- [ ] Session management corretto

---

## 🐛 Troubleshooting

### Problema: "Table agents does not exist"

```bash
Soluzione:
1. Verifica che la migration sia stata applicata
2. Controlla in Supabase Dashboard → Database → Tables
3. Se non c'è, applica manualmente il SQL
```

### Problema: "Web search not configured"

```bash
Soluzione:
1. Verifica .env.local contiene TAVILY_API_KEY
2. Riavvia il dev server (pnpm dev)
3. Verifica che la chiave sia valida su tavily.com
```

### Problema: "Agent not found or unauthorized"

```bash
Soluzione:
1. Verifica di essere loggato
2. Controlla che l'agent appartenga al tuo user_id
3. Verifica RLS policies nel database
```

### Problema: Form non fa submit

```bash
Soluzione:
1. Apri DevTools → Console
2. Cerca errori di validazione
3. Verifica che tutti i campi richiesti siano compilati
4. Controlla Network tab per errori API
```

---

## ✅ Test Completati con Successo

Se tutti i test passano, hai verificato:

✅ Database schema corretto  
✅ Backend CRUD funzionante  
✅ Frontend UI completa e responsive  
✅ Form validation funzionante  
✅ Web Search tool operativo  
✅ Error handling robusto  
✅ Middleware protection attivo  
✅ Navigation flow smooth  

**Week 3 è pronta per la produzione!** 🎉

---

## 📝 Note per Development

1. **Prima di testare**: Assicurati che la migration sia applicata
2. **API Key**: Tavily offre un free tier sufficiente per testing
3. **Performance**: I test di load andrebbero eseguiti con più utenti
4. **Security**: RLS testato solo manualmente, considera E2E tests
5. **Logs**: Controlla sempre i server logs per debugging

**Ready to test Sprint 2 - Week 4!** 🚀

