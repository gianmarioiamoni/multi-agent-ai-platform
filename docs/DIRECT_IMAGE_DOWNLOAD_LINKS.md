# Link Diretti per Scaricare Immagini Background

## Immagini Raccomandate - Unsplash Source API

### Opzione 1: "Una stanza con molte macchine" (Robotica/Automazione)
**URL diretto**: https://images.unsplash.com/photo-1518811558457-5c8f4c6866b0?w=1920&h=1080&fit=crop&q=80
**Caratteristiche**: Macchinari industriali, tema automazione
**Dimensione**: 1920x1080

### Opzione 2: "Moderno impianto operativo" (Industria 4.0)
**URL diretto**: https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1920&h=1080&fit=crop&q=80
**Caratteristiche**: Ambiente industriale moderno con pallet e macchinari
**Dimensione**: 1920x1080

### Opzione 3: "Dashboard e tecnologia" (Business Automation)
**URL diretto**: https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&h=1080&fit=crop&q=80
**Caratteristiche**: Dashboard, schermi, dati, automazione business
**Dimensione**: 1920x1080

## Come Scaricare

### Metodo 1: Script Automatico
```bash
./scripts/download-landing-bg-image.sh
```

### Metodo 2: Download Manuale con curl
```bash
curl -L "https://images.unsplash.com/photo-1518811558457-5c8f4c6866b0?w=1920&h=1080&fit=crop&q=80" -o public/images/landing-bg.jpg
```

### Metodo 3: Browser
1. Apri il link dell'immagine nel browser
2. Tasto destro sull'immagine > "Salva immagine come..."
3. Salva come `landing-bg.jpg` in `public/images/`

## Parametri Unsplash Source API

- `w=1920`: Larghezza (1920px)
- `h=1080`: Altezza (1080px)
- `fit=crop`: Modalità di adattamento
- `q=80`: Qualità (80%, bilanciata tra qualità e dimensione file)

## Note

Tutte le immagini sono gratuite da Unsplash e possono essere usate liberamente per uso commerciale senza attribuzione.

