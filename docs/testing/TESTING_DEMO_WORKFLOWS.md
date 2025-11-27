# Testing Demo Workflows - Guida Completa

## 📋 Panoramica

Questa guida spiega come testare i workflow demo creati con lo script seed. Ogni workflow richiede dati specifici per funzionare correttamente.

## ⚡ Quick Start

**Per testare rapidamente senza configurare tutto:**

1. **Weekly Report Generator** ✅ Funziona subito
   - Richiede solo: `TAVILY_API_KEY` (web search)
   - Email: opzionale (se non configurato, vedrai comunque il report generato)

2. **Meeting Preparation Assistant** ⚠️ Richiede Calendar
   - Connetti Google Calendar in `/app/integrations`
   - Crea eventi nel calendario per domani
   - Web search opzionale

3. **Operations Follow-up Automation** ⚠️ Richiede DB endpoint
   - Crea endpoint mock `/api/tools/db/get-open-tasks` (esempio nella guida)
   - Email opzionale

## 🔐 Setup Iniziale

### 1. Accesso come Utente Demo

1. Accedi alla piattaforma con le credenziali dell'utente demo:
   - Email: `multiagentdemouser@gmail.com`
   - Password: (la password configurata)

2. Verifica che gli agenti e workflow siano visibili:
   - `/app/agents` → dovresti vedere 5 agenti
   - `/app/workflows` → dovresti vedere 3 workflow

## 🧪 Test dei Workflow

### Workflow 1: Weekly Report Generator

**Descrizione**: Ricerca competitori, genera report strutturato, invia via email.

**Agenti coinvolti**:
1. Research Agent (web_search)
2. Report Agent (nessun tool)
3. Email Agent (email)

**Setup richiesto**:
- ✅ Nessun setup particolare (web_search è sempre disponibile)
- ⚠️ Email tool richiede configurazione SMTP (vedi sotto)

**Come testare**:

1. Vai su `/app/workflows`
2. Clicca su "Weekly Report Generator"
3. Clicca "Run Workflow"
4. Inserisci un input come:
   ```
   Generate a weekly report about the top 3 competitors in the AI automation space. 
   Research their latest products, pricing, and market positioning.
   Send the report to manager@example.com
   ```
5. Clicca "Run"
6. Monitora l'esecuzione nella vista dettaglio del workflow run

**Input di esempio**:
- "Create a weekly report on competitors in the SaaS project management space"
- "Research and report on top 5 AI coding assistants in the market"
- "Generate competitor analysis report for cloud hosting providers"

**Cosa aspettarsi**:
- Step 1: Research Agent esegue ricerche web sui competitori
- Step 2: Report Agent sintetizza le informazioni in un report strutturato
- Step 3: Email Agent invia il report via email (se configurato)

---

### Workflow 2: Meeting Preparation Assistant

**Descrizione**: Prepara briefing per meeting prossimi. Controlla calendario, ricerca info, genera briefing.

**Agenti coinvolti**:
1. Meeting Preparation Agent (calendar, web_search, db_ops)
2. Report Agent (nessun tool)

**Setup richiesto**:
- ⚠️ **Google Calendar Integration**: Deve essere configurata
  - Vai su `/app/integrations`
  - Connetti Google Calendar
  - Autorizza l'accesso
- ✅ Web search è sempre disponibile
- ⚠️ DB operations richiede tabelle/endpoint configurati (opzionale per test base)

**Come testare**:

#### Preparazione Calendar:

1. **Connetti Google Calendar**:
   - Vai su `/app/integrations`
   - Clicca "Connect" su Google Calendar
   - Autorizza l'accesso

2. **Crea eventi demo nel calendario**:
   - Apri Google Calendar con l'account collegato
   - Crea eventi futuri con questi dettagli:
     ```
     Evento 1:
     - Titolo: "Meeting with TechCorp"
     - Data: Domani alle 14:00
     - Descrizione: "Discuss partnership opportunities"
     - Partecipanti: (aggiungi email se possibile)
     
     Evento 2:
     - Titolo: "Q4 Planning with Acme Inc"
     - Data: Dopo domani alle 10:00
     - Descrizione: "Quarterly business review"
     ```

#### Eseguire il Workflow:

1. Vai su `/app/workflows`
2. Clicca su "Meeting Preparation Assistant"
3. Clicca "Run Workflow"
4. Inserisci input come:
   ```
   Prepare a briefing for my next meeting tomorrow. Include information about 
   the company, recent news, and key talking points.
   ```
   O più specifico:
   ```
   Generate a meeting briefing for the TechCorp meeting scheduled for tomorrow at 2 PM. 
   Research the company background and prepare talking points.
   ```
5. Clicca "Run"
6. Monitora l'esecuzione

**Input di esempio**:
- "Prepare briefing for my meeting tomorrow afternoon"
- "Create meeting prep document for TechCorp meeting"
- "Research and brief me on Acme Inc before our Q4 planning meeting"

**Cosa aspettarsi**:
- Step 1: Meeting Preparation Agent:
  - Legge eventi futuri dal calendario
  - Ricerca informazioni sul web per aziende/partecipanti
  - (Opzionale) Consulta database per informazioni aggiuntive
- Step 2: Report Agent genera un briefing completo

**Note**:
- Se non ci sono eventi nel calendario, il workflow potrebbe fallire o produrre un messaggio di avviso
- Il workflow cerca eventi nei prossimi 7 giorni per default

---

### Workflow 3: Operations Follow-up Automation

**Descrizione**: Monitora task aperti e invia reminder automatici via email.

**Agenti coinvolti**:
1. Operations Agent (db_ops, email)

**Setup richiesto**:
- ⚠️ **Database Operations Tool**: Richiede endpoint API configurati
  - `/api/tools/db/get-open-tasks` → deve ritornare lista task aperti
  - Questo è opzionale per test - puoi mockare i dati
- ⚠️ **Email tool**: Richiede configurazione SMTP

**Come testare**:

#### Preparazione Database (opzionale per test base):

Per testare completamente questo workflow, serve un endpoint che restituisca task aperti. Per ora, puoi testarlo con dati mockati o creare un endpoint semplice.

**Opzione 1: Creare endpoint mock** (per test rapido):
- Crea un endpoint `/api/tools/db/get-open-tasks` che ritorna dati di esempio

**Opzione 2: Test senza DB** (limitato):
- Il workflow può funzionare anche senza dati DB, ma sarà meno realistico

#### Eseguire il Workflow:

1. Vai su `/app/workflows`
2. Clicca su "Operations Follow-up Automation"
3. Clicca "Run Workflow"
4. Inserisci input come:
   ```
   Check for open tasks that need follow-up and send reminder emails 
   to the responsible parties.
   ```
   O più specifico:
   ```
   Review all open operational tasks and send reminder emails for items 
   that are overdue or approaching deadline.
   ```
5. Clicca "Run"
6. Monitora l'esecuzione

**Input di esempio**:
- "Check open tasks and send reminders"
- "Review overdue items and notify team members"
- "Follow up on all pending operations tasks"

**Cosa aspettarsi**:
- Step 1: Operations Agent:
  - Consulta database per task aperti
  - Analizza scadenze e priorità
  - Genera email di reminder personalizzate
  - Invia email ai responsabili

**Note**:
- Questo workflow è più complesso perché richiede:
  1. Database con task/attività
  2. Email configurate
  3. Logica di business per determinare quando inviare reminder

---

## 🔧 Configurazioni Necessarie

### 1. Email Tool (SMTP Configuration)

**Per tutti i workflow che usano Email Agent**:

1. Configura le variabili d'ambiente in `.env.local`:
   ```env
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your-email@example.com
   SMTP_PASSWORD=your-password
   SMTP_FROM_EMAIL=noreply@example.com
   ```

2. **Opzioni per test locali**:
   - **Mailtrap** (consigliato per test): https://mailtrap.io/
     - Crea account gratuito
     - Copia le credenziali SMTP
     - Le email vengono catturate e non inviate veramente
   - **Ethereal Email**: https://ethereal.email/
     - Genera credenziali temporanee
     - Utile per test rapidi
   - **Gmail SMTP** (limitato):
     ```env
     SMTP_HOST=smtp.gmail.com
     SMTP_PORT=587
     SMTP_USER=your-gmail@gmail.com
     SMTP_PASSWORD=your-app-password  # Usa "App Password" non la password normale!
     SMTP_FROM_EMAIL=your-gmail@gmail.com
     ```
     - ⚠️ Gmail richiede "App Password": https://support.google.com/accounts/answer/185833

3. Verifica la configurazione:
   - Riavvia il server Next.js dopo aver aggiunto le variabili
   - Il tool email fallirà con un messaggio chiaro se la configurazione è mancante

**Note**:
- Il tool email usa Nodemailer
- Se SMTP non è configurato, i workflow funzioneranno ma l'invio email fallirà
- Controlla i log per errori SMTP specifici

### 2. Google Calendar Integration

**Solo per Meeting Preparation Assistant**:

1. Vai su `/app/integrations`
2. Clicca "Connect" su Google Calendar
3. Autorizza l'applicazione
4. Verifica la connessione

**Prerequisiti**:
- L'utente demo deve avere un account Google Calendar
- Google Cloud Console deve essere configurato con OAuth credentials
- Redirect URI configurato: `http://localhost:3000/auth/callback/google-calendar`

### 3. Database Operations Tool (Opzionale)

**Solo per Operations Follow-up Automation e Meeting Preparation Assistant**:

Per testare completamente questo workflow, serve implementare gli endpoint API:

1. **Endpoint API**: `/api/tools/db/get-open-tasks`
   - **Percorso**: `src/app/api/tools/db/get-open-tasks/route.ts`
   - **Metodo**: GET
   - **Response**: Lista di task aperti
   - **Formato suggerito**:
     ```json
     {
       "success": true,
       "data": [
         {
           "id": "task-1",
           "title": "Complete Q4 Report",
           "assignee": "user@example.com",
           "due_date": "2024-12-31T23:59:59Z",
           "status": "open",
           "priority": "high"
         },
         {
           "id": "task-2",
           "title": "Review Contract",
           "assignee": "manager@example.com",
           "due_date": "2024-12-20T12:00:00Z",
           "status": "open",
           "priority": "medium"
         }
       ]
     }
     ```

2. **Endpoint API** (opzionale): `/api/tools/db/insert-report`
   - **Percorso**: `src/app/api/tools/db/insert-report/route.ts`
   - **Metodo**: POST
   - **Body**: 
     ```json
     {
       "title": "Report Title",
       "content": "Report content...",
       "type": "weekly",
       "metadata": {}
     }
     ```

**Creare endpoint mock per test**:

Puoi creare questi endpoint come mock per testare i workflow:

```typescript
// src/app/api/tools/db/get-open-tasks/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // Mock data for testing
  const mockTasks = [
    {
      id: 'task-1',
      title: 'Complete Q4 Report',
      assignee: 'demo@example.com',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
      status: 'open',
      priority: 'high',
    },
    {
      id: 'task-2',
      title: 'Review Contract',
      assignee: 'manager@example.com',
      due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
      status: 'open',
      priority: 'medium',
    },
  ];

  return NextResponse.json({ success: true, data: mockTasks });
}
```

**Note**: 
- Questi endpoint possono essere creati come mock per test
- In produzione, si connetterebbero al database reale (Supabase)
- Gli endpoint devono essere autenticati (middleware/auth)
- Se gli endpoint non esistono, il tool fallirà con un errore chiaro

---

## 📝 Checklist Pre-Test

Prima di testare, verifica:

- [ ] Utente demo può accedere (`multiagentdemouser@gmail.com`)
- [ ] 5 agenti visibili in `/app/agents`
- [ ] 3 workflow visibili in `/app/workflows`
- [ ] Email tool configurato (SMTP variables in `.env.local`)
- [ ] Google Calendar connected (per Meeting Preparation) - vai su `/app/integrations`
- [ ] Eventi creati in Google Calendar (per Meeting Preparation)
- [ ] (Opzionale) DB endpoints configurati (per Operations Follow-up)

---

## 🎯 Test Scenari Completi

### Scenario 1: Weekly Report (Completo)

1. ✅ Workflow esegue ricerca web
2. ✅ Genera report strutturato
3. ✅ Invia email con report allegato
4. ✅ Verifica email ricevuta

### Scenario 2: Meeting Prep (Completo)

1. ✅ Calendar connected
2. ✅ Eventi presenti nel calendario
3. ✅ Workflow legge eventi
4. ✅ Ricerca info su web
5. ✅ Genera briefing completo

### Scenario 3: Operations (Completo)

1. ✅ DB endpoint configurato
2. ✅ Task aperti nel database
3. ✅ Workflow identifica task da seguire
4. ✅ Genera email di reminder
5. ✅ Invia email ai responsabili

---

## 🔍 Verifica Risultati

Dopo ogni esecuzione di workflow:

1. **Vista Workflow Run**:
   - Vai su `/app/runs`
   - Clicca sul workflow run appena eseguito
   - Verifica:
     - Status (completed/failed)
     - Output finale
     - Log di ogni step
     - Tool calls eseguiti

2. **Timeline View**:
   - Vedi lo step-by-step execution
   - Verifica input/output di ogni agent
   - Controlla tool invocations

3. **Errori**:
   - Se un workflow fallisce, controlla:
     - Log errori nella timeline
     - Configurazione tool mancante
     - Dati mancanti (es. nessun evento nel calendario)

---

## ⚠️ Problemi Comuni

### "No events found in calendar"
- **Causa**: Nessun evento futuro nel calendario
- **Soluzione**: Crea eventi nel Google Calendar collegato

### "Email sending failed"
- **Causa**: SMTP non configurato o credenziali errate
- **Soluzione**: Verifica variabili SMTP in `.env.local`

### "Database endpoint not found"
- **Causa**: Endpoint `/api/tools/db/*` non implementato
- **Soluzione**: Crea endpoint mock o implementa endpoint reale

### "Rate limit exceeded"
- **Causa**: Troppe richieste a OpenAI o altri servizi
- **Soluzione**: Attendi qualche minuto e riprova

---

## 🚀 Quick Start Test (Minimo Setup)

Per testare rapidamente **senza** configurare tutto:

1. **Weekly Report Generator**:
   - ✅ Funziona con solo web_search
   - ⚠️ Email fallirà se SMTP non configurato, ma vedrai comunque il report

2. **Meeting Preparation**:
   - ⚠️ Richiede Calendar connection
   - ✅ Puoi testare solo la parte di ricerca web

3. **Operations Follow-up**:
   - ⚠️ Richiede DB endpoint
   - Può essere testato creando un endpoint mock semplice

---

## 📚 Esempi di Input per Test

### Weekly Report Generator:
```
Generate a weekly competitor analysis report for the AI automation tools market. 
Research the top 3 competitors, their features, pricing, and market position. 
Send the report to demo@example.com.
```

### Meeting Preparation Assistant:
```
Prepare a comprehensive briefing for my meeting with TechCorp scheduled for tomorrow at 2 PM. 
Include company background, recent news, and key discussion points.
```

### Operations Follow-up Automation:
```
Review all open operational tasks and send reminder emails for items that are overdue 
or due within the next 3 days. Be professional and concise in the reminders.
```

