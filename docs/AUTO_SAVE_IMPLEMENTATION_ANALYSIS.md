# Auto-Save Implementation Analysis

Analisi completa di cosa comporterebbe implementare l'auto-save per agenti e workflow, se abilitato nelle settings.

## 📊 Stato Attuale

### Form Esistenti
1. **Agent Builder** (`/app/agents/create`)
   - Form per creazione nuovi agenti
   - Usa React Hook Form
   - Submit manuale tramite bottone "Create Agent"
   - Hook: `use-agent-form.ts`

2. **Workflow Builder** (`/app/workflows/create`)
   - Form per creazione nuovi workflow
   - Usa React Hook Form
   - Submit manuale tramite bottone "Create Workflow"
   - Hook: `use-workflow-form.ts`

### ❌ Funzionalità Mancanti
- **Nessuna pagina di edit** per agenti/workflow esistenti
- **Nessun auto-save** implementato
- Form attuali supportano solo **creazione**, non **modifica**

## 🎯 Cosa Servirebbe per Implementare Auto-Save

### 1. **Pagine di Edit**

Prima di tutto, servirebbero pagine per modificare agenti/workflow esistenti:
- `/app/agents/[id]/edit` - Pagina per modificare un agent esistente
- `/app/workflows/[id]/edit` - Pagina per modificare un workflow esistente

**Impatto**: 
- Creare nuove pagine
- Modificare `AgentBuilder` e `WorkflowBuilder` per supportare sia create che edit mode
- Caricare dati esistenti nei form quando in modalità edit

### 2. **Logica di Auto-Save**

#### A) **Hook Custom per Auto-Save**

Creare un hook `use-auto-save.ts` che:
- Monitora i cambiamenti del form usando `form.watch()` o `useWatch()`
- Implementa debounce (es. 2-3 secondi di inattività prima di salvare)
- Distingue tra "nuovo" (create) e "esistente" (update)
- Gestisce lo stato di salvataggio (idle, saving, saved, error)

**Complessità**: Media-Alta
```typescript
// Esempio struttura
function useAutoSave(form: UseFormReturn, {
  entityId?: string, // undefined = nuovo, string = esistente
  onCreate: (data) => Promise<Agent>,
  onUpdate: (id, data) => Promise<Agent>,
  enabled: boolean, // da settings
  debounceMs: number = 2000
})
```

#### B) **Integrazione con React Hook Form**

- Usare `form.watch()` per monitorare tutti i cambiamenti
- Oppure usare `useWatch` hook di React Hook Form
- Tracciare se il form è "dirty" (modificato)

**Complessità**: Media

### 3. **Gestione Stato**

#### Stati Necessari:
- `idle` - Nessun cambiamento
- `typing` - Utente sta scrivendo (debounce in corso)
- `saving` - Salvataggio in corso
- `saved` - Salvato con successo
- `error` - Errore durante il salvataggio
- `conflict` - Conflitto con modifica simultanea

**Complessità**: Media

### 4. **UI/UX Components**

#### Indicatori Visivi:

1. **Badge/Icona di Stato**
   - "Saving..." durante il salvataggio
   - "Saved" dopo salvataggio riuscito
   - "Error" se fallisce
   - Opzionale: timestamp ultimo salvataggio

2. **Toast Notifications** (opzionale, potrebbero essere invasivi)
   - Toast discreto "Saved automatically" solo dopo primo salvataggio
   - Toast errore se auto-save fallisce

3. **Indicatore Globale**
   - Banner in alto o icona nell'header
   - Mostra stato di tutti i form aperti

**Complessità**: Media

### 5. **Gestione Conflitti**

Problema: Se due utenti (o due tab) modificano lo stesso agent/workflow simultaneamente:

**Soluzioni Possibili**:

#### Opzione A: Last-Write-Wins (Semplice)
- L'ultimo salvataggio sovrascrive i precedenti
- Nessuna gestione conflitti
- **Pro**: Semplice da implementare
- **Contro**: Perdita di dati se due persone modificano insieme

#### Opzione B: Optimistic Locking (Consigliato)
- Aggiungere campo `version` o `updated_at` alla tabella
- Salvare con controllo: `WHERE id = ? AND updated_at = ?`
- Se `updated_at` è cambiato, ritornare errore di conflitto
- Mostrare all'utente che c'è stato un conflitto e offrire di ricaricare

**Complessità**: Alta

#### Opzione C: Operational Transform / CRDT (Complesso)
- Gestione avanzata di conflitti a livello di campo
- **Pro**: Nessuna perdita di dati
- **Contro**: Molto complesso da implementare
- **Raccomandazione**: Non necessario per MVP

### 6. **Salvataggio Intelligente**

#### Quando Salvare:

**Sempre** (se auto-save enabled):
- Dopo debounce di inattività (es. 2-3 secondi)
- Quando l'utente cambia campo (dopo debounce)

**Mai** (anche con auto-save):
- Se il form è invalido (validation errors)
- Se l'utente sta ancora scrivendo (debounce non scaduto)
- Se c'è già un salvataggio in corso

**Opzionale**:
- Salvataggio quando si cambia tab/browser tab
- Salvataggio quando si chiude il browser (beforeunload event)

### 7. **Draft State (Boozze)**

#### Opzione A: Salvare Direttamente come Entità Reale
- Salvataggio crea/aggiorna agent/workflow nel database
- **Pro**: Semplice, sempre salvato
- **Contro**: Rischio di creare agent/workflow incompleti

#### Opzione B: Status "draft" vs "active"
- Creare agent/workflow con status `draft` durante l'auto-save
- Passare a `active` solo con submit manuale
- **Pro**: Distingue bozze da entità complete
- **Contro**: Serve logica aggiuntiva per gestire draft

**Raccomandazione**: Opzione B con status `draft`

### 8. **Database Changes**

#### Modifiche Necessarie:

1. **Campo `status` per Workflows**:
   - Attualmente: `'draft' | 'active'` già esiste
   - ✅ Già supportato

2. **Campo `status` per Agents**:
   - Attualmente: `'active' | 'archived'`
   - ⚠️ Servirebbe aggiungere `'draft'` se usiamo status draft

3. **Campo `version` o `updated_at`**:
   - Per optimistic locking
   - `updated_at` già esiste tramite trigger
   - Potrebbe servire campo `version` incrementale per conflitti più robusti

### 9. **Performance Considerations**

#### Ottimizzazioni Necessarie:

1. **Debounce**
   - Evitare salvataggi troppo frequenti
   - Default: 2-3 secondi dopo ultimo cambio

2. **Dirty Checking**
   - Salvare solo se ci sono cambiamenti reali
   - Confrontare valori attuali vs. ultimi salvati

3. **Rate Limiting**
   - Limitare numero di auto-save per minuto
   - Es. max 10 auto-save/minuto per utente

4. **Batch Updates**
   - Raggruppare più cambiamenti se arrivano velocemente
   - Salvare tutti insieme invece che uno alla volta

### 10. **Error Handling**

#### Scenari da Gestire:

1. **Errore di Rete**
   - Retry automatico con backoff esponenziale
   - Mantenere cambiamenti in localStorage come backup
   - Mostrare errore all'utente

2. **Errore di Validazione**
   - Non salvare se form è invalido
   - Indicare quali campi sono problematici
   - Continuare a provare quando form diventa valido

3. **Errore di Autorizzazione**
   - L'utente potrebbe aver perso permessi
   - Interrompere auto-save e notificare

4. **Conflitto di Versione**
   - Rilevare quando qualcun altro ha modificato
   - Offrire opzioni: reload, merge manuale, overwrite

### 11. **Testing**

#### Test Necessari:

1. **Unit Tests**
   - Hook `useAutoSave`
   - Logica di debounce
   - Gestione stati

2. **Integration Tests**
   - Auto-save durante digitazione
   - Gestione errori
   - Conflitti simultanei

3. **E2E Tests**
   - Flusso completo: creazione → modifica → auto-save → verifica salvataggio

### 12. **Backward Compatibility**

- Utenti con auto-save disabilitato continuano a funzionare come prima
- Form esistenti non vengono modificati (solo aggiunta di funzionalità)
- Nuove pagine di edit sono separate da quelle di create

## 📋 Riepilogo Complessità

### Difficoltà per Componente:

| Componente | Complessità | Stima Tempo |
|------------|-------------|-------------|
| Pagine Edit (Agent/Workflow) | Media | 4-6 ore |
| Hook `useAutoSave` | Alta | 6-8 ore |
| Indicatori UI | Bassa | 2-3 ore |
| Gestione Conflitti (Optimistic Locking) | Alta | 4-6 ore |
| Draft Status | Bassa | 1-2 ore |
| Error Handling | Media | 3-4 ore |
| Testing | Media | 4-6 ore |
| **TOTALE** | **Alta** | **~24-35 ore** |

### Rischi:

1. **Alto**: Complessità di gestione conflitti
2. **Medio**: Performance con molti utenti che salvano simultaneamente
3. **Medio**: Esperienza utente se auto-save è troppo invasivo o troppo lento
4. **Basso**: Compatibilità con codice esistente (è solo aggiunta)

## 🎯 Raccomandazione

### Per MVP (Minimal Viable Product):

**✅ Implementare:**
1. Pagine di edit per agenti/workflow
2. Auto-save base con debounce
3. Indicatori visivi minimi (badge "Saving"/"Saved")
4. Draft status per distinguere bozze da entità complete
5. Error handling base

**⚠️ Implementare in Fase 2:**
1. Gestione conflitti avanzata (optimistic locking)
2. Retry automatico con localStorage backup
3. Toast notifications per auto-save
4. Batch updates

**❌ Non Implementare (per MVP):**
1. Operational Transform / CRDT
2. Merge automatico di conflitti
3. Versioning completo delle modifiche

### Alternative Semplificate:

Se l'implementazione completa è troppo complessa, si può iniziare con:

1. **Auto-Save Solo per Modifiche** (non per creazione)
   - Più semplice perché non serve gestire "nuovo" vs "esistente"
   - Utente crea manualmente, poi auto-save durante modifiche

2. **Auto-Save Solo con Conferma**
   - Auto-save ma mostra sempre banner "Saved automatically" che l'utente può chiudere
   - Più trasparente ma leggermente più invasivo

3. **Draft in localStorage**
   - Salvare bozza in localStorage invece che database
   - Quando utente fa submit, salvare nel database
   - **Pro**: Nessun rischio di conflitti, implementazione semplice
   - **Contro**: Perdita dati se si chiude browser senza submit

## 🔍 Domande da Chiarire

1. **Auto-save deve funzionare anche per creazione** o solo per modifica?
2. **Quanto tempo di debounce** è accettabile? (2-3 secondi ok?)
3. **Gestione conflitti**: Last-write-wins o optimistic locking?
4. **Indicatori visivi**: Quanto invasivi? (badge piccolo vs banner)
5. **Draft status**: Vogliamo distinguere bozze da agent/workflow "completi"?

## 📝 Conclusioni

Implementare auto-save è una **funzionalità complessa** che richiede:
- ✅ Creazione pagine di edit (necessarie comunque)
- ✅ Hook custom con debounce e gestione stati
- ✅ UI indicators
- ✅ Gestione errori robusta
- ✅ Gestione conflitti (se multi-user)

**Raccomandazione**: 
- Per MVP, implementare versione semplificata (auto-save solo per edit, last-write-wins)
- Posticipare gestione conflitti avanzata a quando necessario
- Stimare 1-2 settimane di lavoro per implementazione completa

