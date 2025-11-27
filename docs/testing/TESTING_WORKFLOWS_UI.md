# Guida al Test dell'UI Workflows

Questa guida ti aiuterà a testare l'implementazione dell'UI Workflows per Sprint 3, Week 5.

## Prerequisiti

1. **Server in esecuzione**: Assicurati che il server di sviluppo sia attivo
2. **Utente autenticato**: Devi essere loggato nell'applicazione
3. **Agenti esistenti**: Crea almeno 2 agenti per poter costruire un workflow

## Preparazione

### 1. Avvia il server di sviluppo

```bash
pnpm dev
```

Il server sarà disponibile su: **http://localhost:3000**

### 2. Accedi all'applicazione

1. Vai su http://localhost:3000
2. Effettua il login (o signup se non hai ancora un account)
3. Verifica di essere nella dashboard

### 3. Crea almeno 2 agenti (se non li hai già)

1. Vai su **Agents** nella sidebar (`/app/agents`)
2. Clicca su **"Create Agent"** (o il bottone **"+"** su mobile)
3. Crea almeno 2 agenti diversi, ad esempio:
   - **Research Agent**: con tool `web_search` abilitato
   - **Report Agent**: senza tool (solo LLM per summarization)

## Test della Lista Workflows

### Test 1: Pagina Workflows vuota

1. Naviga a **Workflows** nella sidebar (`/app/workflows`)
2. **Verifica**:
   - ✅ Vedi il titolo "Workflows"
   - ✅ Vedi la descrizione "Build and automate multi-agent workflows"
   - ✅ Vedi il bottone **"Create Workflow"**
   - ✅ Vedi l'empty state con il messaggio "No Workflows Yet"

### Test 2: Responsive design (opzionale)

1. Apri gli strumenti di sviluppo del browser (F12)
2. Attiva il device toolbar (Ctrl/Cmd + Shift + M)
3. Testa su:
   - **Mobile** (375px): bottone mostra solo **"+"**
   - **Tablet** (768px): layout adattato
   - **Desktop** (1024px+): layout completo

## Test del Workflow Builder

### Test 3: Creazione workflow - Basic Info

1. Clicca su **"Create Workflow"** (o **"+"** su mobile)
2. Vai su `/app/workflows/create`
3. **Verifica**:
   - ✅ Vedi il form diviso in sezioni
   - ✅ Sezione "Basic Information" è visibile
   - ✅ Campo **Name** è presente e required
   - ✅ Campo **Description** è opzionale

4. **Test validazione**:
   - Lascia il campo Name vuoto e prova a salvare → deve mostrare errore
   - Inserisci un nome lungo (>100 caratteri) → deve mostrare errore
   - Inserisci una descrizione lunga (>500 caratteri) → deve mostrare errore

### Test 4: Creazione workflow - Steps Builder (senza agenti)

Se non hai ancora agenti creati:

1. Vai su `/app/workflows/create`
2. **Verifica**:
   - ✅ Vedi il messaggio "No Agents Available"
   - ✅ Vedi il suggerimento di creare agenti prima

### Test 5: Creazione workflow - Aggiunta Steps

1. Vai su `/app/workflows/create`
2. Compila **Basic Info**:
   - Name: `Test Research Workflow`
   - Description: `A simple workflow for testing`

3. Nella sezione **"Workflow Steps"**:
   - ✅ Vedi il messaggio "No steps added yet..."
   - ✅ Vedi il dropdown "Add Agent to Workflow"

4. **Aggiungi il primo step**:
   - Seleziona un agente dal dropdown (es. "Research Agent")
   - ✅ Verifica che lo step appaia nella lista
   - ✅ Verifica che mostri: numero step, nome agente, modello, tools

5. **Aggiungi il secondo step**:
   - Seleziona un altro agente (es. "Report Agent")
   - ✅ Verifica che appaia come Step 2
   - ✅ Verifica che il primo agente non sia più nel dropdown

### Test 6: Gestione Steps

1. Con almeno 2 steps aggiunti:

   **Riordino**:
   - ✅ Bottone "↑" (up) sul primo step è disabilitato
   - ✅ Bottone "↓" (down) sull'ultimo step è disabilitato
   - Clicca "↓" sul primo step → deve scambiare con il secondo
   - Clicca "↑" sul secondo step → deve tornare alla posizione originale

   **Rimozione**:
   - Clicca "×" su uno step → deve essere rimosso
   - ✅ Verifica che l'agente torni disponibile nel dropdown

   **Modifica nome**:
   - Modifica il nome dello step (es. "Step 1: Research" → "Research Step")
   - ✅ Verifica che il nome si aggiorni

### Test 7: Creazione workflow completo

1. Compila il form:
   - **Name**: `Weekly Report Automation`
   - **Description**: `Automatically generates weekly reports using research and summarization`
   - **Steps**:
     - Step 1: Research Agent (con web_search)
     - Step 2: Report Agent (senza tools)

2. Clicca **"Create Workflow"**

3. **Verifica**:
   - ✅ Vedi toast di successo "Workflow created successfully!"
   - ✅ Vieni reindirizzato a `/app/workflows`
   - ✅ Il nuovo workflow appare nella lista

### Test 8: Lista Workflows con dati

1. Dopo aver creato almeno un workflow:

   **Verifica**:
   - ✅ La lista mostra le card dei workflow
   - ✅ Ogni card mostra:
     - Nome del workflow
     - Descrizione (se presente)
     - Status badge (dovrebbe essere "Draft")
     - Data di creazione
     - Data ultimo run (se presente, potrebbe essere null)

2. **Responsive**:
   - ✅ Su mobile: 1 colonna
   - ✅ Su tablet: 2 colonne
   - ✅ Su desktop: 3 colonne

### Test 9: Navigazione workflow card

1. Clicca su una workflow card
2. **Nota**: Al momento porta a `/app/workflows/[id]` che non è ancora implementata
3. ✅ Questo è previsto (la pagina di dettaglio sarà in Sprint 4)

### Test 10: Validazione form completa

Prova questi scenari di errore:

1. **Nome mancante**:
   - Lascia Name vuoto
   - Aggiungi almeno uno step
   - Clicca "Create Workflow"
   - ✅ Deve mostrare errore di validazione

2. **Nessuno step**:
   - Compila Name
   - Non aggiungere step
   - Clicca "Create Workflow"
   - ✅ Deve mostrare toast: "Please add at least one step to the workflow"

3. **Step senza nome**:
   - Aggiungi uno step
   - Cancella il nome dello step
   - Clicca "Create Workflow"
   - ✅ Deve mostrare errore di validazione

## Checklist Completa

### Funzionalità Base
- [ ] Pagina workflows lista caricata
- [ ] Empty state mostrato quando non ci sono workflow
- [ ] Bottone "Create Workflow" funzionante
- [ ] Form creazione workflow funzionante
- [ ] Validazione form corretta
- [ ] Workflow creato con successo

### Steps Builder
- [ ] Dropdown agenti funzionante
- [ ] Aggiunta step funzionante
- [ ] Rimozione step funzionante
- [ ] Riordino step (up/down) funzionante
- [ ] Modifica nome step funzionante
- [ ] Agenti già aggiunti non appaiono nel dropdown

### UI/UX
- [ ] Layout responsive (mobile, tablet, desktop)
- [ ] Empty states informativi
- [ ] Toast notifications funzionanti
- [ ] Loading states durante creazione
- [ ] Error handling chiaro

### Integrazione Database
- [ ] Workflow salvato correttamente nel database
- [ ] Graph structure corretta (steps, edges, triggers)
- [ ] Status iniziale: "draft"
- [ ] Owner_id corretto

## Test Avanzati (Opzionali)

### Test con molti agenti
- Crea 5+ agenti
- Aggiungi tutti al workflow (se possibile, massimo un agente per step)
- Verifica che il dropdown gestisca correttamente la lista

### Test con workflow complesso
- Crea un workflow con 3-4 step
- Verifica il riordino funzioni correttamente
- Verifica che tutti gli step vengano salvati

## Troubleshooting

### Problema: "No Agents Available"
**Soluzione**: Crea almeno un agente in `/app/agents/create`

### Problema: Toast non appare
**Verifica**: 
- Che il ToastProvider sia nel layout (dovrebbe essere in `src/app/layout.tsx`)
- Console del browser per errori JavaScript

### Problema: Errore durante creazione workflow
**Verifica**:
- Console del browser (F12) per errori
- Console del server per log
- Che tutti gli agenti selezionati esistano ancora

### Problema: Workflow non appare nella lista dopo creazione
**Verifica**:
- Che il revalidatePath funzioni
- Ricarica la pagina manualmente
- Controlla il database Supabase direttamente

## Prossimi Step

Dopo aver completato i test, puoi procedere con:
- Sprint 3, Week 6: Calendar tool e DB operations tool
- Sprint 4: Vista dettagliata workflow_run e UI migliorata

---

**Buon testing! 🚀**

