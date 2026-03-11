# WanderGenius

WanderGenius ist eine leichtgewichtige Single-Page-App (Vite + React + TypeScript) zur Reiseinspiration und -planung. Die App bietet u.a. eine Bildergalerie, Kartenanzeige, Wetterinfos, Trip-Planer und Sternebewertungen.

**Kernfunktionen**
- Zielsuche und Bildvorschau (ImageSlider)
- Kartendarstellung mit POIs (MapDisplay)
- Aktuelle Wetteranzeige (WeatherDisplay)
- Reiseplaner mit Tagesübersicht (TripPlannerForm, TripPlanDisplay)
- Bewertungskomponente (StarRating)

## Lokale Entwicklung

Voraussetzungen: Node.js

1. Abhängigkeiten installieren:
   `npm install`
2. API-Schlüssel setzen (falls nötig):
   Setze `VITE_GEMINI_API_KEY` in `.env.local` mit deinem Gemini API-Key.
3. Entwicklung starten:
   `npm run dev`
4. Produktion bauen:
   `npm run build`

Die gebauten Dateien landen in `dist/`.

## Docker

Ein Dockerfile wurde hinzugefügt, um ein Produktionsimage zu bauen und mit `nginx` zu servieren.

Build lokal:
```
docker build -t wandergenius:latest .
```

Starten:
```
docker run -p 80:80 wandergenius:latest
```

## GitHub Container Registry (GHCR)

Ein GitHub Actions Workflow wurde hinzugefügt unter `.github/workflows/docker-publish.yml`. Bei jedem Push auf `main` wird ein Docker-Image gebaut und nach `ghcr.io/${{ github.repository_owner }}/wandergenius` gepusht (Tags: `latest` und Commit-SHA). Der Workflow verwendet das eingebaute `GITHUB_TOKEN` zum Login in GHCR.

## Dateien
- Dockerfile: enthält mehrstufigen Build (Node -> nginx)
- Workflow: `.github/workflows/docker-publish.yml` (build & push nach ghcr.io)

---
Bei Fragen oder wenn du möchtest, dass ich ein kurzes Demo-Run-Skript oder ein Compose-Setup hinzufüge, sag Bescheid.
