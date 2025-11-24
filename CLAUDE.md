# Multi-Agent AI Platform (Agents + Tools)
Valore business: automazione avanzata per aziende tech.Funzionalità:
* Creazione agenti specializzati (email agent, report agent, research agent).
* Tool calling: web search, database, calendar, email.
* Orchestrazione multi-agent con task board.
* Template workflow (es. monthly report, competitor analysis).→ Perfetto per mostrare conoscenza agent framework + orchestrazione

## Descrizione sintetica
Multi-Agent AI Automation PlatformA full-stack platform that orchestrates multiple AI agents to automate business workflows across email, calendar, web search, and internal databases. Each agent has a specialized role (research, summarization, reporting, operations), can call tools (APIs, DB, schedulers), and collaborates to complete complex tasks. Built with Next.js, TypeScript, Supabase, OpenAI function calling, and a modular tool layer designed for extensibility and enterprise-grade authorization.

## Architettura & Roadmap tecnica ad alto livello
### Core building blocks
1. Frontend (Next.js + shadcn/ui)
    * Dashboard workflow
    * Agent builder (configurazione: role, tools, parametri modello)
    * Workflow builder (sequenze di agenti + condizioni)
    * Run viewer (log delle esecuzioni, tool calls, errori)
2. Backend (Next.js API routes / server actions)
    * Layer di orchestrazione agenti
    * Layer di tool calling (email, calendar, web search, DB, HTTP generic)
    * Job runner per workflow lunghi (durano minuti, non secondi)
    * Logging e audit (per ogni step e tool invocation)
3. Auth & Authorization (priorità iniziale)
    * Supabase Auth con:
        * Email/password
        * Google OAuth
    * Tabella profiles con role: "user" | "admin"
    * Script di bootstrap che:
        * legge ADMIN_EMAIL, ADMIN_PASSWORD da env
        * crea l’utente admin in Supabase se non esiste
    * Middleware/guard lato API e frontend:
        * route admin-only (es. gestione tools globali, monitoring)
        * route user per i workflow personali
4. Database (Supabase/Postgres)Tabelle principali:
    * profiles (user_id, name, role, settings)
    * agents (id, owner_id, name, description, model, tools_enabled[], config JSON)
    * workflows (id, owner_id, name, graph JSON: steps, edges, triggers)
    * workflow_runs (id, workflow_id, status, started_at, finished_at, created_by)
    * agent_runs (id, run_id, agent_id, input, output, status)
    * tool_invocations (id, agent_run_id, tool, params, result, status)
    * stored_credentials (per integrazioni utente: es. Google OAuth tokens, encrypted)
5. Integration/Tool LayerTool principali:
    * Email tool
        * invio email (es. via Resend/Mailgun/SendGrid)
        * lettura email (via Gmail API IMAP-like / Gmail REST)
    * Calendar tool
        * lettura eventi futuro/prossimi
        * creazione eventi/meeting
        * integrazione tipica: Google Calendar API con OAuth
    * Web search tool
        * wrapper verso un motore (Tavily / SerpAPI / Custom Search)
    * DB operations tool
        * API sicure per query su tabelle applicative (es. “get all open tasks”, “insert report”)
        * NO accesso SQL grezzo → usare endpoints typed
6. AI Layer (OpenAI)
    * Modello LLM per:
        * orchestrator principale (decide quali agenti/tool chiamare)
        * agenti specializzati (es. ResearchAgent, EmailAgent, ReportAgent)
    * Uso di function calling per:
        * scegliere tool
        * passare parametri strutturati
    * Gestione temperature, retry, timeouts.

## Design Auth & Authorization (come primo step)
### Autenticazione
* Supabase Auth
    * Provider: email/password
    * Provider: Google
* UI:
    * /auth/login, /auth/register
    * /auth/callback per Google
* next + supabase-js + sessioni server-side (middleware per proteggere route).
### Admin bootstrap
* Env vars:
    * ADMIN_EMAIL
    * ADMIN_PASSWORD
* Script (es. command yarn bootstrap:admin o eseguito alla prima startup):
    * Usa Supabase service key
    * Controlla se esiste utente con ADMIN_EMAIL
    * Se non esiste → crea utente con quella password
    * Inserisce/aggiorna record in profiles con role = 'admin'
## Ruoli
Per l’MVP ti direi:
* user: default, può creare/gestire i propri agenti e workflow
* admin: in più
    * vede tutte le workflow_runs
    * gestisce configurazione tool globali
    * monitora errori, limita uso, magari imposta feature flag
Al momento non serve una terza categoria, puoi sempre introdurla dopo (es. org_owner).

## Piano in 8 settimane (4 sprint da 2 settimane)
### Sprint 1 (Settimane 1–2) – Auth, ruoli, struttura base
Obiettivo: piattaforma con login funzionante, ruoli, e skeleton UI.
Settimana 1
* Setup progetto:
    * Next.js (App Router) + TypeScript
    * shadcn/ui installato e base theme
    * Supabase collegato (URL, anon key)
* Implementa:
    * Signup/login email/password
    * Login con Google
    * Layout base (Navbar, sidebar, pagina dashboard vuota)
* Tabella profiles + hook post-signup:
    * alla creazione utente → crea profile con role='user' di default
Settimana 2
* Script bootstrap:admin:
    * legge env
    * crea/aggiorna admin in Supabase
* Middleware/guard:
    * route /(admin) accessibile solo ad admin
    * route /(app) accessibile solo ad utenti loggati
* UI:
    * Pagina “Admin Panel” placeholder con info utente admin
    * Pagina “My Account” con dati profilo

### Sprint 2 (Settimane 3–4) – Modello dati agenti & primi tool
Obiettivo: creare agenti configurabili e uno/due strumenti già integrati.
Settimana 3
* DB:
    * Tabelle agents, workflows (solo schema base)
* Backend:
    * CRUD per agents (API routes o server actions)
* Frontend:
    * Pagina “Agents”
    * Agent Builder:
        * nome, descrizione
        * ruolo (system prompt)
        * modello (es. gpt-4.1 / gpt-4.1-mini)
        * tools disponibili: checkbox (email, calendar, web_search, db_ops)
* Implementa Web search tool:
    * Definisci interfaccia tool lato backend (toolId, schema, handler)
    * Implementa funzione callTool('web_search', params) che chiama il provider scelto
    * Gestisci errori, timeout, logging.
Settimana 4
* Implementa Email tool (solo invio all’inizio):
    * Config globale (es. API key Resend) visibile solo agli admin
    * Tool function: sendEmail(to, subject, body)
* Integrazione LLM function calling:
    * Definisci JSON schema per tool web_search e sendEmail
    * Orchestratore semplice:
        * Prende input utente e agent config
        * Chiama OpenAI con tool definitions
        * Esegue tool se il modello li richiama
* UI basic:
    * Pagina per testare un singolo agent: input testo → log risposta e tool calls.

### Sprint 3 (Settimane 5–6) – Multi-agent workflow & integrazioni avanzate
Obiettivo: orchestrare più agenti in sequenza e integrare calendar + DB tool.
Settimana 5
* Estendi DB:
    * workflow_runs, agent_runs, tool_invocations
* Workflow engine (MVP):
    * Struttura workflow come lista ordinata di step:
        * step1: ResearchAgent (web_search)
        * step2: ReportAgent (riassume risultati)
        * step3: EmailAgent (invia report)
    * Runner:
        * legge workflow
        * esegue gli step in sequenza
        * passa output step n → input step n+1
        * registra log su workflow_runs & agent_runs
* UI:
    * Pagina “Workflows”
    * Workflow builder MVP: non serve grafico super complesso, anche:
        * seleziona agenti in ordine
        * definisci input iniziale
Settimana 6
* Calendar tool:
    * Integrazione Google Calendar con OAuth per utente:
        * pagina “Integrations” per collegare account Google
        * salvataggio token (in stored_credentials cifrato)
    * Tool functions:
        * listUpcomingEvents(range)
        * createEvent(title, start, end, attendees[])
* DB operations tool:
    * Definisci API interne tipo:
        * /api/tools/db/get-open-tasks
        * /api/tools/db/insert-report
    * Il tool non esegue SQL libero, ma chiama queste API
* UI:
    * Aggiorna agent builder per includere questi nuovi tools
    * Migliora run viewer: timeline con steps + tool calls.

### Sprint 4 (Settimane 7–8) – Refinement, UX, logging, casi d’uso “ready-to-show”
Obiettivo: rendere il prodotto presentabile come progetto portfolio “quasi production-ready”.
Settimana 7
* Hardening:
    * rate limiting su API chiave
    * logging strutturato (es. in Supabase logs table o provider esterno)
    * gestione errori chiara per agent & workflow runs
* UX:
    * UI con shadcn/ui curata: cards, tabs, breadcrumbs
    * Vista dettagliata di un workflow_run:
        * step-by-step
        * input/output LLM (sanitizzato)
        * tool chiamati, parametri, risultati
Settimana 8
* Definisci 2–3 workflow “dimostrativi”:
    1. Weekly Report Agent
        * ResearchAgent → Web search competitors
        * ReportAgent → genera report strutturato
        * EmailAgent → invia al manager
    2. Meeting Preparation Agent
        * CalendarTool → trova prossimi meeting
        * WebSearch + DB tool → raccoglie info cliente
        * ReportAgent → genera briefing
    3. Operations Follow-up Agent
        * DB tool → leggi attività aperte
        * EmailAgent → manda reminder automatici
* Pulizia finale:
    * seed script per dati demo
    * README tecnico con architettura
    * screenshot UI

## STILE DI PROGRAMAZIONE
- Usare sempre import/export 
- Usare sempre programmazione funzionale, mai class
- Non usare MAI tipi any
- per OGNI componente React creato, applicare principio SRP sia per la parte di logica sia per la parte UI
- quando applichi SRP ad un componente, lascia il componente principale nella cartella in cui è e crea una sottocartella per i suoi sottocomponenti
- impostare ESLint in modo che dia errore per any, variabili o funzioni dichiarate e non usate
- applicare principi SOLID
- sviluppare test unitari con Jest e test di integrazione. Ove possibile usare TDD
- ottimizzare le prestazioni sfruttando al massimo componenti SSR rispetto CSR ove possibile
- centralizzare il più possibile la definizione di type e struct e di funzioni riutilizzabili, importando poi dove servono
- considerare sempre la manutenibilità e l'estendibilità del software sviluppato
- creare un gestione degli errori centralizzata e smooth per l'utente finale

