# StormScope

Real-time atmospheric visualization platform — rain radar, storm intelligence, and scalable weather overlays.

## Stack

| Layer | Choice |
| --- | --- |
| Frontend | React, TypeScript, Vite, **Leaflet**, **React-Leaflet**, **OpenStreetMap** |
| Radar tiles | RainViewer (free public API) |
| Backend | FastAPI (Phase 2+) |
| Real-time | WebSockets |
| Cache | Redis |
| Database | PostgreSQL → PostGIS |
| Deploy | AWS (ECS, CloudFront, RDS, ElastiCache) |

## Repository layout

```text
stormscope/
├── frontend/     # Leaflet + OSM + weather runtime
├── backend/      # FastAPI (later)
├── infra/        # Docker, Terraform, AWS (later)
└── extension/    # Chrome MV3 (later)
```

## Frontend — local dev

```bash
cd frontend
npm install
npm run dev
```

No Mapbox token or `.env` file needed. Open http://localhost:5173 and allow browser location.

## Frontend — GitHub Pages

**Live:** https://ganesh44we.github.io/stormscope/

Pushes to `main` deploy automatically via GitHub Actions (no secrets required for the map).

## Roadmap

1. **Core visualization** — radar overlay, animation, 200km radius, legend ✓
2. **Real-time intelligence** — WebSockets, alerts, backend caching
3. **Production infra** — CDN, Docker, AWS, observability
