# StormScope Frontend

React + TypeScript + Vite + Mapbox GL — fullscreen interactive map foundation.

## Setup

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_MAPBOX_TOKEN in .env (Mapbox public pk. token)
npm run dev
```

## Source layout

```text
src/
├── components/   # Shared UI
├── hooks/        # useGeolocation, useRadarEngine
├── map/          # MapView + map.css
├── overlays/     # RadarHud, RadarLegend
├── radar/        # Layer manager, animator, frame controller, engine
├── services/
│   └── radar/    # RainViewer API, parser, types
└── types/        # Shared TypeScript types
```

## Radar pipeline (Step 3)

```text
RainViewer API → radarApi → radarParser → RadarEngine
  → RadarLayerManager (Mapbox raster tiles)
  → RadarAnimator (frame loop, outside React)
```

Animated precipitation uses RainViewer TMN color scheme (intensity greens → purple). Playback respects the 200km analysis `maxBounds`.

## Environment

| Variable | Description |
| --- | --- |
| `VITE_MAPBOX_TOKEN` | Mapbox public token (`pk.*`) — never commit `.env` |

For GitHub Pages, set repo secret **`VITE_MAPBOX_TOKEN`** (same name) and re-run the deploy workflow.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
