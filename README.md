# Stormscope

Real-time atmospheric visualization platform — rain radar, storm intelligence, and scalable weather overlays.

## Stack (in progress)

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
├── frontend/     # React + Mapbox (Phase 1)
├── backend/      # FastAPI (later)
├── infra/        # Docker, Terraform, AWS (later)
└── extension/    # Chrome MV3 (later)
```

## Phase 1 — Map foundation (cloud preview)

**Goal:** Interactive Mapbox GL map — viewed in the browser via **GitHub Pages**, not `npm run dev` on your machine.

### One-time setup

1. **Push this repo to GitHub** (create `stormscope` on GitHub, then push `main`).

2. **Mapbox token**
   - Create a **public** token (`pk.*`) at [Mapbox access tokens](https://account.mapbox.com/access-tokens/).
   - Under **URL restrictions**, allow your Pages host, e.g. `https://*.github.io/*` (required for the map to load on Pages).

3. **GitHub repository secret**
   - Repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
   - Name: `VITE_MAPBOX_ACCESS_TOKEN`
   - Value: your `pk.` token

4. **Enable GitHub Pages** (if not already on)
   - Repo → **Settings** → **Pages** → Source: **GitHub Actions**

The site deploys even before the Mapbox secret exists (you’ll see a setup banner). After adding the secret, re-run the deploy workflow so the map loads.

### View the app

After the first push, open **Actions** and confirm **Deploy frontend (GitHub Pages)** is green.

**https://ganesh44we.github.io/stormscope/**

(Use `https://<username>.github.io/<repo-name>/` if your GitHub username or repo name differs.)

If the page is blank or assets 404, hard-refresh (Cmd+Shift+R). The build uses relative asset paths so the repo name only affects the URL path, not the build.

Use the geolocate control (top-right). Geolocation requires **HTTPS**; GitHub Pages provides that.

### Re-deploy manually

Actions → **Deploy frontend (GitHub Pages)** → **Run workflow**.

### Docker image (optional, AWS-aligned)

For ECS/Fargate or any host without Node on the machine:

```bash
docker build -f infra/docker/frontend.Dockerfile \
  --build-arg VITE_MAPBOX_ACCESS_TOKEN=pk.your_token \
  --build-arg VITE_BASE_PATH=/ \
  -t stormscope-frontend .
docker run --rm -p 8080:80 stormscope-frontend
```

Then open `http://localhost:8080` only if you need a quick container smoke test — **primary workflow is GitHub Pages**.

## Roadmap

1. **Core visualization** — live map, user location, radar overlay, animation, legend
2. **Real-time intelligence** — WebSockets, alerts, caching, predictions
3. **Production infra** — CDN, Docker, AWS, observability
