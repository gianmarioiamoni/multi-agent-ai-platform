# Testing Guide: Workflow Runs UI

Questa guida spiega come testare la nuova implementazione della vista dettagliata dei workflow runs.

## Prerequisiti

1. **Workflow esistente**: Devi avere almeno un workflow creato
2. **Workflow eseguito**: Il workflow deve essere stato eseguito almeno una volta per generare un workflow run

## Step 1: Verificare workflow runs esistenti

Se non hai ancora eseguito un workflow, devi prima crearne uno e eseguirlo:

1. Vai su `/app/workflows`
2. Clicca su "Create Workflow" o seleziona un workflow esistente
3. Configura il workflow con almeno un agent
4. Salva il workflow
5. Vai alla pagina del workflow e eseguilo con un input di test

## Step 2: Testare la Lista Workflow Runs

1. **Accedi alla pagina Runs**:
   - Vai su `/app/runs` nel browser
   - Oppure clicca su "Runs" nella sidebar

2. **Verifica la lista**:
   - ✅ Dovresti vedere tutte le esecuzioni dei workflow
   - ✅ Ogni card mostra:
     - Nome del workflow
     - Input iniziale (se presente)
     - Status (Pending, Running, Completed, Failed, Cancelled)
     - Data di inizio
     - Durata (se completato)

3. **Testa stati diversi**:
   - Verifica che i colori dello status siano corretti
   - Verifica che le date siano formattate correttamente
   - Verifica che la durata sia calcolata correttamente

4. **Testa stato vuoto**:
   - Se non ci sono workflow runs, dovresti vedere un messaggio "No Workflow Runs Yet"

## Step 3: Testare la Vista Dettaglio

1. **Apri un workflow run**:
   - Clicca su una card nella lista dei runs
   - Oppure vai direttamente su `/app/runs/{run-id}`

2. **Verifica l'header**:
   - ✅ Nome del workflow
   - ✅ Status con colore corretto
   - ✅ Run ID
   - ✅ Pulsante "Back to Runs"
   - ✅ Tabella con: Started, Finished, Duration
   - ✅ Input iniziale del workflow
   - ✅ Output finale del workflow (se presente)
   - ✅ Errori (se presenti)

3. **Verifica la Timeline**:
   - ✅ Dovresti vedere tutti gli step (agent runs) in ordine
   - ✅ Ogni step mostra:
     - Numero step e nome agent
     - Status
     - Durata di esecuzione
     - Input ricevuto
     - Output generato
     - Errori (se presenti)

4. **Verifica Tool Calls**:
   - ✅ Per ogni agent run, se ha eseguito tool calls, dovresti vedere:
     - Nome del tool
     - Status del tool call
     - Parametri passati (in formato JSON)
     - Risultato (se successo, in formato JSON)
     - Errori (se fallito, in formato testo)
     - Tempo di esecuzione

## Step 4: Testare Scenari Edge Cases

### Run senza agent runs
- Se un workflow run non ha agent runs, dovresti vedere "No agent runs recorded"

### Run in esecuzione
- Se un workflow è ancora in esecuzione (status "running"):
  - La durata potrebbe non essere disponibile
  - Alcuni step potrebbero essere ancora "pending" o "running"

### Run fallito
- Se un workflow è fallito:
  - Dovresti vedere il messaggio di errore nell'header
  - Gli step falliti dovrebbero mostrare gli errori
  - I tool calls falliti dovrebbero mostrare gli errori

### Run con molti step
- Se un workflow ha molti step:
  - Tutti gli step dovrebbero essere visibili nella timeline
  - La pagina dovrebbe essere scrollabile

### Run con molti tool calls
- Se un agent ha eseguito molti tool calls:
  - Tutti i tool calls dovrebbero essere visibili
  - Ogni tool call dovrebbe essere in una card separata

## Step 5: Testare Navigazione

1. **Da lista a dettaglio**:
   - Clicca su una card → dovresti andare al dettaglio
   - URL dovrebbe essere `/app/runs/{run-id}`

2. **Da dettaglio a lista**:
   - Clicca su "Back to Runs" → dovresti tornare alla lista
   - URL dovrebbe essere `/app/runs`

3. **Run non trovato**:
   - Vai su `/app/runs/invalid-id`
   - Dovresti vedere la pagina "Not Found" con pulsante per tornare alla lista

## Step 6: Testare Responsive Design

1. **Desktop**: Verifica che tutto sia ben organizzato
2. **Tablet**: Verifica che la griglia si adatti correttamente
3. **Mobile**: Verifica che i card siano leggibili su schermi piccoli

## Problemi Comuni

### "No workflow runs found"
- **Causa**: Non hai ancora eseguito un workflow
- **Soluzione**: Crea ed esegui un workflow dalla pagina `/app/workflows`

### "Workflow run not found"
- **Causa**: L'ID del run non esiste o non hai permesso di vederlo
- **Soluzione**: Verifica che l'ID sia corretto e che tu sia loggato

### Errore nel caricamento
- **Causa**: Problemi con le query al database
- **Soluzione**: Controlla la console del browser e i log del server per errori

## Checklist Completa

- [ ] Lista runs mostra tutti i workflow runs
- [ ] Card runs mostrano informazioni corrette
- [ ] Clic su card porta al dettaglio
- [ ] Dettaglio mostra tutte le informazioni
- [ ] Timeline mostra tutti gli step in ordine
- [ ] Tool calls sono visibili e leggibili
- [ ] Status sono colorati correttamente
- [ ] Date sono formattate correttamente
- [ ] Durata è calcolata correttamente
- [ ] Errori sono mostrati chiaramente
- [ ] Navigazione funziona correttamente
- [ ] Pagina Not Found funziona
- [ ] Design è responsive

## Prossimi Passi

Dopo aver testato, puoi procedere con:
- Rate limiting su API chiave
- Logging strutturato
- Miglioramento gestione errori

