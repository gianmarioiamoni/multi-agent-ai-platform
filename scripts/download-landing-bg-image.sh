#!/bin/bash

# Script per scaricare un'immagine di background da Unsplash per la landing page
# Tema: robot collaborativi - automazione business

# Directory di destinazione
DEST_DIR="public/images"
mkdir -p "$DEST_DIR"

# URL dell'immagine da Unsplash Source API
# Immagine: "Moderno impianto operativo" - tema automazione/industria 4.0
# Ambiente industriale moderno con pallet e macchinari
IMAGE_URL="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1920&h=1080&fit=crop&q=80"

# Nome del file di destinazione
OUTPUT_FILE="$DEST_DIR/landing-bg.jpg"

echo "Scaricando immagine di background da Unsplash..."
echo "URL: $IMAGE_URL"
echo "Destinazione: $OUTPUT_FILE"

# Scarica l'immagine
curl -L "$IMAGE_URL" -o "$OUTPUT_FILE" --progress-bar

if [ $? -eq 0 ]; then
    FILE_SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
    echo "✅ Immagine scaricata con successo!"
    echo "   Dimensione: $FILE_SIZE"
    echo "   Posizione: $OUTPUT_FILE"
else
    echo "❌ Errore durante il download dell'immagine"
    exit 1
fi

