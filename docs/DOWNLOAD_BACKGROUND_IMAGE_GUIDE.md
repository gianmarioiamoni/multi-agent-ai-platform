# Guida Passo-Passo: Download e Applicazione Background Image

## Passo 1: Trova l'Immagine

### Opzione A: Unsplash (Consigliato)

1. Vai su https://unsplash.com
2. Cerca uno di questi termini:
   - `collaborative robots`
   - `business automation`
   - `industrial automation`
   - `robotics workplace`
   - `smart factory`

3. Filtra per:
   - ✅ Orientamento: Orizzontale (Landscape)
   - ✅ Risoluzione: Alta (> 1920x1080)
   - ✅ Licenza: Gratuita per uso commerciale

### Opzione B: Pexels (Alternativa)

1. Vai su https://www.pexels.com
2. Cerca: `robotics` o `automation`
3. Filtra per orientamento orizzontale

### Opzione C: Pixabay

1. Vai su https://pixabay.com
2. Cerca: `collaborative robots` o `business automation`

## Passo 2: Scarica l'Immagine

1. Clicca sull'immagine che ti piace
2. Clicca sul pulsante "Download" (solitamente in alto a destra)
3. Scegli la risoluzione più alta disponibile (idealmente 1920x1080 o superiore)
4. Salva l'immagine sul tuo computer

## Passo 3: Ottimizza l'Immagine

L'immagine scaricata potrebbe essere troppo pesante. Ottimizzala:

### Usando TinyJPG (Online)

1. Vai su https://tinyjpg.com
2. Carica l'immagine scaricata
3. Scarica la versione ottimizzata
4. Verifica che il peso sia < 500KB

### Usando ImageOptim (Mac)

1. Scarica ImageOptim: https://imageoptim.com
2. Trascina l'immagine nell'app
3. ImageOptim ottimizzerà automaticamente
4. Verifica che il peso sia < 500KB

### Usando Squoosh (Google, Online)

1. Vai su https://squoosh.app
2. Carica l'immagine
3. Regola la qualità per ottenere < 500KB
4. Scarica l'immagine ottimizzata

## Passo 4: Rinomina e Posiziona l'Immagine

1. Rinomina l'immagine come `landing-bg.jpg`
2. Spostala nella cartella:
   ```
   public/images/landing-bg.jpg
   ```

## Passo 5: Verifica

1. Riavvia il server di sviluppo:
   ```bash
   pnpm dev
   ```

2. Visita la homepage (http://localhost:3000)
3. Se non sei autenticato, vedrai la landing page con il nuovo background

## Troubleshooting

### L'immagine non appare

- ✅ Verifica che il file si chiami esattamente `landing-bg.jpg`
- ✅ Verifica che sia nella cartella `public/images/`
- ✅ Controlla la console del browser per errori di caricamento
- ✅ Riavvia il server di sviluppo

### L'immagine è troppo scura/chiara

- Modifica l'overlay nel componente `LandingHero`:
  - File: `src/components/landing/landing-hero.tsx`
  - Linea 32: Modifica `bg-[var(--color-background)]/85` (85 = opacità)

### Vuoi provare più immagini

1. Salva più immagini con nomi diversi:
   - `landing-bg-option-1.jpg`
   - `landing-bg-option-2.jpg`
   - `landing-bg-option-3.jpg`

2. Modifica `BACKGROUND_IMAGE_PATH` in:
   ```
   src/components/landing/landing-page-client.tsx
   ```

3. Cambia la costante:
   ```typescript
   const BACKGROUND_IMAGE_PATH = '/images/landing-bg-option-1.jpg';
   ```

## Suggerimenti Finali

- 🎯 Cerca immagini con spazio "vuoto" nella parte superiore per il testo
- 🎯 Preferisci immagini con colori che si abbinano al tema del sito (blu/viola)
- 🎯 Assicurati che l'immagine rappresenti il concetto di "collaborazione" tra umani e AI/robot
- 🎯 L'overlay scuro garantisce la leggibilità, quindi non preoccuparti se l'immagine originale è chiara

