# Seed Demo Data - Guida Rapida

## 📋 Panoramica

Questo script crea agenti e workflow dimostrativi per l'utente demo, come definito in Sprint 4, Week 8.

## 🚀 Utilizzo

```bash
pnpm seed:demo
```

## 📦 Requisiti

1. **Utente demo esistente**: L'utente con email `multiagentdemouser@gmail.com` deve esistere in Supabase
2. **Flag demo**: L'utente deve avere `is_demo = true` nella tabella `profiles`
3. **Variabili d'ambiente**: `.env.local` deve contenere:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

## 🎯 Cosa Crea

### Agenti Demo (5)

1. **Research Agent**
   - Tool: `web_search`
   - Specializzato in ricerca web e analisi competitor

2. **Report Agent**
   - Nessun tool (solo analisi)
   - Genera report strutturati e sintesi

3. **Email Agent**
   - Tool: `email`
   - Gestisce comunicazioni email professionali

4. **Meeting Preparation Agent**
   - Tools: `calendar`, `web_search`, `db_ops`
   - Prepara briefing per meeting

5. **Operations Agent**
   - Tools: `db_ops`, `email`
   - Monitora operazioni e invia reminder

### Workflow Demo (3)

1. **Weekly Report Generator**
   - Step 1: Research Agent → ricerca competitori
   - Step 2: Report Agent → genera report strutturato
   - Step 3: Email Agent → invia report al manager

2. **Meeting Preparation Assistant**
   - Step 1: Meeting Preparation Agent → raccoglie info meeting e ricerca
   - Step 2: Report Agent → genera briefing

3. **Operations Follow-up Automation**
   - Step 1: Operations Agent → controlla task aperti e invia reminder

## 🔄 Comportamento Idempotente

Lo script è **idempotente**: se eseguito più volte:
- ✅ Verifica se gli agenti esistono già → li salta
- ✅ Verifica se i workflow esistono già → li salta
- ✅ Se gli agenti esistono ma i workflow no → crea solo i workflow

Per ricreare tutto da zero, elimina manualmente gli agenti e workflow esistenti dall'utente demo.

## 🔍 Verifica

Dopo l'esecuzione, accedi come utente demo (`multiagentdemouser@gmail.com`) e verifica:
- Pagina `/app/agents` → dovresti vedere 5 agenti
- Pagina `/app/workflows` → dovresti vedere 3 workflow

## ⚠️ Note

- Lo script usa il **Service Role Key** per bypassare RLS
- Gli agenti e workflow sono creati con status `active`
- Tutti gli agenti usano il modello `gpt-4o-mini` per costi ridotti

