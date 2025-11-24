# OpenAI API Key Setup Guide

Questa guida ti aiuta a ottenere e configurare la chiave API di OpenAI per il progetto.

## 📋 Prerequisiti

- Un account OpenAI (puoi crearlo gratuitamente)
- Una carta di credito/debito (richiesta per creare la chiave API, anche se usi il free tier)

## 🔑 Step 1: Creare un Account OpenAI

1. Vai su [https://platform.openai.com](https://platform.openai.com)
2. Clicca su **"Sign up"** (in alto a destra)
3. Completa la registrazione con:
   - Email
   - Password
   - Verifica email
   - Numero di telefono (per sicurezza)

## 💳 Step 2: Aggiungere Metodo di Pagamento

⚠️ **Nota**: Anche se usi il free tier, OpenAI richiede un metodo di pagamento per creare le chiavi API.

1. Dopo il login, vai su **Settings** → **Billing**
2. Clicca su **"Add payment method"**
3. Inserisci i dati della tua carta
4. Conferma il pagamento

**Importante**: 
- Il free tier include $5 di credito gratuito
- Non verrà addebitato nulla finché non superi i limiti gratuiti
- Puoi impostare limiti di spesa mensile per sicurezza

## 🔑 Step 3: Creare la Chiave API

1. Vai su [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Oppure: **Settings** → **API keys** (menu laterale)

2. Clicca su **"+ Create new secret key"**

3. Compila il form:
   - **Name**: `Multi-Agent AI Platform` (o un nome a tua scelta)
   - **Permissions**: Lascia le impostazioni di default

4. Clicca su **"Create secret key"**

5. ⚠️ **IMPORTANTE**: Copia immediatamente la chiave!
   - La chiave viene mostrata **solo una volta**
   - Formato: `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Se la perdi, dovrai crearne una nuova

6. Salva la chiave in un posto sicuro (password manager consigliato)

## 🔧 Step 4: Configurare nel Progetto

1. Apri il file `.env.local` nella root del progetto

2. Aggiungi questa riga:
   ```env
   OPENAI_API_KEY=sk-proj-tua-chiave-qui
   ```

3. **Sostituisci** `sk-proj-tua-chiave-qui` con la chiave reale che hai copiato

4. Salva il file

## ✅ Step 5: Verificare la Configurazione

Esegui il test per verificare che funzioni:

```bash
p
```

Oppure verifica manualmente:

```bash
# Verifica che la variabile sia caricata
node -e "require('dotenv').config({ path: '.env.local' }); console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? '✅ Configurata' : '❌ Mancante');"
```

## 💰 Costi e Limiti

### Free Tier
- **$5 di credito gratuito** all'iscrizione
- Valido per 3 mesi
- Dopo, paghi solo per quello che usi

### Prezzi (aggiornati a Dicembre 2024)
- **GPT-4o**: ~$0.03 per 1K token input, ~$0.06 per 1K token output
- **GPT-4o-mini**: ~$0.015 per 1K token input, ~$0.06 per 1K token output
- **GPT-3.5-turbo**: ~$0.0015 per 1K token input, ~$0.002 per 1K token output

### Consigli per Risparmiare
- Usa `gpt-4o-mini` per la maggior parte dei test (più economico)
- Imposta un **limite di spesa mensile** in OpenAI Dashboard
- Monitora l'uso nella sezione **Usage** del dashboard

## 🔒 Sicurezza

### ⚠️ Mai Committare la Chiave API!

- ✅ `.env.local` è già in `.gitignore`
- ❌ Non aggiungere mai la chiave nel codice
- ❌ Non condividere la chiave pubblicamente
- ✅ Usa variabili d'ambiente per tutto

### Se la Chiave Viene Compromessa

1. Vai su [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Trova la chiave compromessa
3. Clicca su **"Revoke"** (revoca)
4. Crea una nuova chiave
5. Aggiorna `.env.local` con la nuova chiave

## 📊 Monitoraggio Uso

1. Vai su [https://platform.openai.com/usage](https://platform.openai.com/usage)
2. Visualizza:
   - Token usati
   - Costi
   - Richieste API
   - Errori

## 🐛 Troubleshooting

### "Invalid API key"
- Verifica che la chiave sia copiata correttamente (senza spazi)
- Verifica che inizi con `sk-`
- Controlla che non sia scaduta o revocata

### "Insufficient quota"
- Verifica il credito disponibile
- Controlla i limiti di spesa
- Aggiungi credito se necessario

### "Rate limit exceeded"
- Hai superato il limite di richieste al minuto
- Aspetta qualche secondo e riprova
- Considera di implementare retry logic

## 📚 Risorse Utili

- [OpenAI Platform Dashboard](https://platform.openai.com)
- [OpenAI Documentation](https://platform.openai.com/docs)
- [Pricing Information](https://openai.com/pricing)
- [API Reference](https://platform.openai.com/docs/api-reference)

## ✅ Checklist

- [ ] Account OpenAI creato
- [ ] Metodo di pagamento aggiunto
- [ ] Chiave API creata e copiata
- [ ] Chiave aggiunta a `.env.local`
- [ ] Test eseguito con successo
- [ ] Limite di spesa impostato (consigliato)

---

**Dopo aver configurato la chiave, esegui:**
```bash
pnpm test:workflow
```

Per testare il workflow engine completo! 🚀

