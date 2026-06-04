# StormScope Frontend

React + TypeScript + Vite + **Leaflet** + **React-Leaflet** + **OpenStreetMap** (fully free, no API keys).

## Setup

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173 — allow location when prompted.

## Source layout

```text
src/
├── components/   # Shared UI
├── hooks/        # useGeolocation, useWeatherRuntime
├── map/          # MapView, OSM tiles, location layers
├── overlays/     # RadarHud, RadarLegend, AtmosphericStatus
├── radar/        # Leaflet tile radar engine
├── services/radar/  # RainViewer API (provider-agnostic)
├── weather/      # WeatherEngine runtime (Step 4)
└── types/        # Shared types
```

## Radar pipeline

```text
RainViewer API → services/radar → WeatherEngine → RadarLayerManager (L.tileLayer) → Leaflet map
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

No `.env` required for the basemap. RainViewer radar tiles are fetched at runtime (free public API).
