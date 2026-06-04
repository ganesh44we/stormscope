# Stormscope Frontend

React + TypeScript + Vite + Mapbox GL JS.

## How you run this (cloud-first)

This project is meant to be **built in CI and opened on GitHub Pages**, not via `npm run dev` on your laptop.

See the root [README](../README.md):

1. Add GitHub secret `VITE_MAPBOX_ACCESS_TOKEN`
2. Enable Pages (GitHub Actions source)
3. Push `main` → open `https://<user>.github.io/<repo>/`

## Source layout

```text
src/
├── components/   # App shell, shared UI
├── map/          # Mapbox map + config
├── overlays/     # Weather layers (Phase 1+)
├── radar/        # RainViewer integration (Phase 1+)
└── websocket/    # Live updates (Phase 2+)
```

## Scripts (CI / maintainers)

| Command | Description |
| --- | --- |
| `npm run build` | Production build (used by GitHub Actions) |
| `npm run dev` | Optional local HMR — not the default workflow |
| `npm run preview` | Serve `dist/` after a build |

## Build env vars

| Variable | Required | Notes |
| --- | --- | --- |
| `VITE_MAPBOX_ACCESS_TOKEN` | Yes | Injected in GitHub Actions from repo secret |
| `VITE_BASE_PATH` | Pages only | CI sets `/<repo-name>/`; use `/` for root-hosted deploys |
