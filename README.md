# StormScope

Real-time atmospheric visualization platform — rain radar, storm intelligence, and scalable weather overlays.

## Stack

| Layer | Choice |
| --- | --- |
| Frontend | React, TypeScript, Vite, Mapbox GL JS |
| Backend | FastAPI (Phase 2+) |
| Real-time | WebSockets |
| Cache | Redis |
| Database | PostgreSQL → PostGIS |
| Deploy | AWS (ECS, CloudFront, RDS, ElastiCache) |

## Repository layout

```text
stormscope/
├── frontend/     # stormscope-frontend (React + Mapbox)
├── backend/      # FastAPI (later)
├── infra/        # Docker, Terraform, AWS (later)
└── extension/    # Chrome MV3 (later)
```

## Frontend — local dev

```bash
cd frontend
npm install
cp .env.example .env
```

Add your Mapbox public token to `frontend/.env`:

```env
VITE_MAPBOX_TOKEN=pk.your_token_here
```

```bash
npm run dev
```

Expected: fullscreen dark map centered on Hyderabad, globe projection, navigation controls.

## Frontend — GitHub Pages (no local dev)

**Live:** https://ganesh44we.github.io/stormscope/

1. Repo secret **`VITE_MAPBOX_TOKEN`** → [Actions secrets](https://github.com/ganesh44we/stormscope/settings/secrets/actions)
2. Mapbox token URL restriction: `https://*.github.io/*`
3. Re-run **Deploy frontend (GitHub Pages)** workflow after adding the secret

## Roadmap

1. **Core visualization** — radar overlay, animation, 200km radius, legend
2. **Real-time intelligence** — WebSockets, alerts, caching
3. **Production infra** — CDN, Docker, AWS, observability
