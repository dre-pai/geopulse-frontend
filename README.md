# GeoPulse Frontend

Interactive geopolitical intelligence dashboard — companion to `geopulse-backend`.

## Stack

- React 19 + TypeScript + Vite
- TanStack Query + Zustand
- MapLibre GL (live event map)
- React Flow (relationship graphs)
- Recharts + Framer Motion
- Tailwind CSS v4

## Quick start

```bash
npm install
npm run dev
```

App: http://localhost:5173  

Vite proxies `/api` → `http://localhost:8000`. Start the backend (Docker Compose) first for live data; the UI falls back to demo fixtures when the API is offline.

Optional:

```bash
cp .env.example .env
# VITE_API_BASE=http://localhost:8000/api/v1
```

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
