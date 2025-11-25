# Quick Start: Testing Workflow Runs UI

Guida rapida per testare la nuova vista dettagliata dei workflow runs.

## Metodo 1: Test con Workflow Runs Esistenti (Se ne hai già)

1. **Accedi alla pagina Runs**:
   ```
   http://localhost:3000/app/runs
   ```
   - Oppure clicca su "Runs" nella sidebar

2. **Verifica la lista**:
   - ✅ Dovresti vedere tutti i workflow runs
   - ✅ Ogni card è cliccabile e porta al dettaglio

3. **Clicca su un run** per vedere il dettaglio completo

## Metodo 2: Creare un Workflow Run di Test

Se non hai workflow runs, puoi crearne uno usando lo script di test:

### Opzione A: Usa lo script esistente

```bash
# Esegui lo script di test del workflow engine
pnpm tsx scripts/test-workflow-engine.ts
```

Questo creerà:
- Agents di test
- Un workflow di test
- Eseguirà il workflow e creerà un workflow run

### Opzione B: Crea workflow run manualmente via UI

1. **Crea gli agents necessari** (se non li hai):
   - Vai su `/app/agents`
   - Crea almeno un agent con tool abilitati (es. web_search)

2. **Crea un workflow**:
   - Vai su `/app/workflows`
   - Clicca "Create Workflow"
   - Aggiungi almeno un agent al workflow
   - Salva

3. **Esegui il workflow** (se c'è una UI per eseguirlo) oppure usa lo script

## Test Rapido della UI

### 1. Lista Workflow Runs (`/app/runs`)

**Cosa verificare**:
- [ ] Lista mostra tutti i runs
- [ ] Card mostrano: nome workflow, status, data, durata
- [ ] Status hanno colori corretti (verde=completed, rosso=failed, etc.)
- [ ] Clic su card porta al dettaglio

### 2. Dettaglio Workflow Run (`/app/runs/[id]`)

**Cosa verificare**:
- [ ] Header mostra: nome workflow, status, run ID
- [ ] Tabella mostra: Started, Finished, Duration
- [ ] Input e Output sono visibili
- [ ] Timeline mostra tutti gli step in ordine
- [ ] Ogni step mostra: nome agent, input, output
- [ ] Tool calls sono visibili con parametri e risultati
- [ ] Errori (se presenti) sono mostrati chiaramente

### 3. Navigazione

**Cosa verificare**:
- [ ] "Back to Runs" torna alla lista
- [ ] URL cambia correttamente
- [ ] Run non trovato mostra pagina 404

## Checklist Completa

```
□ Lista runs carica correttamente
□ Card runs mostrano tutte le info
□ Clic su card funziona
□ Dettaglio run carica correttamente
□ Header mostra tutte le info
□ Timeline mostra tutti gli step
□ Tool calls sono visibili
□ Status colorati correttamente
□ Date formattate correttamente
□ Durata calcolata correttamente
□ Navigazione funziona
```

## Problemi Comuni

**"No Workflow Runs Yet"**:
- Esegui uno script di test o crea/esegui un workflow manualmente

**Errore di caricamento**:
- Controlla console browser (F12) per errori
- Controlla log server per errori backend

**Run non trovato**:
- Verifica che l'ID sia corretto
- Verifica di essere loggato come utente che possiede il run

