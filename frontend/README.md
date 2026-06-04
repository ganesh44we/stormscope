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
├── hooks/        # React hooks
├── map/          # Mapbox map (MapView, map.css)
├── overlays/     # Weather layers (Phase 1+)
├── radar/        # RainViewer integration (Phase 1+)
├── services/     # API / data clients
└── types/        # Shared TypeScript types
```

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
