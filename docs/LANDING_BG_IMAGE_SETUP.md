# Setup Background Image per Landing Page

## Passo 1: Scarica l'Immagine

Scarica un'immagine realistica JPG dal tema "robot collaborativi - automazione business" da una delle fonti consigliate in `LANDING_PAGE_BACKGROUND_IMAGES.md`.

## Passo 2: Ottimizza l'Immagine

L'immagine dovrebbe essere:
- **Formato**: JPG o WebP
- **Dimensioni**: 1920x1080 minimo (2560x1440 consigliato)
- **Peso**: < 500KB (usa strumenti come TinyJPG o ImageOptim)

## Passo 3: Salva l'Immagine

Salva l'immagine in:

```
public/images/landing-bg.jpg
```

Se vuoi testare più opzioni, salva con nomi diversi:
- `public/images/landing-bg-option-1.jpg`
- `public/images/landing-bg-option-2.jpg`
- `public/images/landing-bg-option-3.jpg`

## Passo 4: Applica l'Immagine

Il componente `LandingPageClient` carica automaticamente l'immagine da `/images/landing-bg.jpg`.

Se hai salvato l'immagine con un nome diverso, modifica `BACKGROUND_IMAGE_PATH` in:

```
src/components/landing/landing-page-client.tsx
```

## Struttura Attuale

Il componente `LandingHero` accetta un `backgroundImage` prop che viene passato automaticamente. L'immagine viene applicata con un overlay scuro per garantire la leggibilità del testo.

## Test

Dopo aver salvato l'immagine:
1. Riavvia il server di sviluppo (`pnpm dev`)
2. Visita la homepage (http://localhost:3000)
3. Se non autenticato, vedrai la landing page con il nuovo background

