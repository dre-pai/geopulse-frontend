# GeoPulse Frontend

Interactive geopolitical intelligence dashboard — companion to `geopulse-backend`.

## Stack

- React 19 + TypeScript + Vite
- TanStack Query + Zustand
- MapLibre GL (live event map)
- React Flow (relationship graphs)
- Recharts + Framer Motion
- Tailwind CSS v4

## Quick start (recommended)

Run the full stack from the backend repo (Docker installs deps and starts API + UI):

```bash
cd ../geopulse-backend
./up.sh
```

App: http://localhost:5173  

Production-like stack (nginx on port 3000, proxies `/api` to the API):

```bash
cd ../geopulse-backend
./up.sh prod
```

## Frontend-only (without Docker)

```bash
npm install
npm run dev
```

Vite proxies `/api` → `http://localhost:8000`. Start the backend first for live data; the UI falls back to demo fixtures when the API is offline.

Optional:

```bash
cp .env.example .env
# VITE_API_BASE=/api/v1
# VITE_PROXY_TARGET=http://localhost:8000
```

## Docker image

Multi-stage `Dockerfile`:

- `development` — Vite with HMR
- `production` — static build served by nginx (proxies `/api` to the `api` service)

## Routes

| Path | View |
|------|------|
| `/` | Globe + filters + live ticker |
| `/country/:countryRef` | Risk, timeline, alliances, AI summary |
| `/explore` | Event search |
| `/compare` | Multi-country trajectories |

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```
