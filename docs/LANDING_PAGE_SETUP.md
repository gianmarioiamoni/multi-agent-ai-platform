# Landing Page Setup Guide

## Struttura Creata

La landing page è stata creata con i seguenti componenti:

- **LandingNavbar**: Navbar pubblica con link a features e CTA
- **LandingHero**: Hero section con titolo, descrizione e CTA principali
- **LandingFeatures**: Sezione con 6 features principali della piattaforma
- **LandingHowItWorks**: Sezione step-by-step (4 passaggi)
- **LandingCTA**: Call-to-action finale
- **LandingFooter**: Footer con link utili

## Background Image

### Configurazione

Il componente `LandingHero` supporta un background image opaco. L'immagine è configurata in:
- Path: `src/components/landing/landing-page-client.tsx`
- Costante: `BACKGROUND_IMAGE_PATH = '/images/landing-bg.jpg'`

### Come Aggiungere l'Immagine

1. **Scegli un'immagine** seguendo i suggerimenti in `docs/LANDING_PAGE_IMAGE_SUGGESTIONS.md`

2. **Salva l'immagine** in `public/images/landing-bg.jpg`:
   ```bash
   # Esempio: copia l'immagine nella cartella public/images/
   cp /path/to/your/image.jpg public/images/landing-bg.jpg
   ```

3. **Formati supportati**: JPEG, PNG, WebP
   - Dimensioni consigliate: 1920x1080px o superiore
   - Peso: < 500KB ottimizzato

4. **Il componente rileva automaticamente** la presenza dell'immagine:
   - Se l'immagine esiste → viene usata come background con overlay opaco
   - Se l'immagine non esiste → usa un gradient di fallback

### Customizzazione Overlay

L'overlay opaco è configurato in `landing-hero.tsx`:
- Classe: `bg-[var(--color-background)]/85` (85% opacità)
- Backdrop blur: `backdrop-blur-sm`

Puoi modificare l'opacità cambiando `/85` (es. `/80` per più trasparenza, `/90` per meno).

## Routing

- **Utenti non autenticati**: Vedono la landing page
- **Utenti autenticati**: Redirect automatico a `/app/dashboard`

## Responsive Design

La landing page è completamente responsive:
- Mobile: layout ottimizzato per schermi piccoli
- Tablet: layout intermedio
- Desktop: layout completo con tutte le features

## Test

Per testare la landing page:
1. Assicurati di essere **non autenticato** (logout)
2. Vai su `http://localhost:3000`
3. Dovresti vedere la landing page completa

