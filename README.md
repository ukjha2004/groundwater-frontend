# Groundwater Uranium Monitoring — Web Dashboard

Frontend for the UDAAN UG Fellowship project (TEXMiN, Dec 2025 – Aug 2026):
**Machine Learning Approaches for Water Quality Testing**.

**Live site:** https://groundwater-frontend-one.vercel.app
**API:** https://groundwater-backend-rozn.onrender.com (docs at `/docs`)

## Problem statement

Predict water-quality degradation and potential aquifer vulnerability in
down-gradient regions of a *hypothetical* uranium in-situ recovery (ISR) site,
identify data gaps in mitigating these vulnerabilities, and support
hydrogeological characterization and the development of monitoring programs.

## Architecture

```
React + Vite (Vercel)  ──HTTP/JSON──▶  FastAPI (Render)  ──▶  Gradient Boosting model (.pkl)
  Leaflet map, Recharts                 /summary /latest-wells /analytics
                                        /model-info /predict
```

## Pages

| Page | What it shows |
|---|---|
| Dashboard | Dataset summary and model R² |
| ML Prediction | Uranium prediction from 12 inputs, validated against training ranges |
| Monitoring Map | Wells around the hypothetical ISR site, colored by prototype risk |
| Analytics | Uranium vs distance, risk distribution, per-well averages |
| Alert Center | Latest risk status for every well |
| ML Model Insights | Leave-one-well-out validation metrics and feature importance (computed by the API) |
| About Project | Objectives, method, limitations |

## Run locally

```bash
npm install
# create .env with:  VITE_API_URL=http://localhost:8000
npm run dev
```

On Vercel, set `VITE_API_URL` under *Project → Settings → Environment Variables*.
Everything prefixed `VITE_` is visible in the browser, so never put secrets there.

## Project structure

```
src/
  App.jsx              layout, navigation, server status
  api.js               API URL, cached requests, server wake-up check
  utils/risk.js        risk colors/icons, ISR site location, date formatting
  components/          StatCard, ModuleCard, InputField, LoadState
  pages/               one file per page
```

## Limitations

The dataset is synthetic/hypothetical and the model is not field-validated.
Risk categories are project-defined prototype thresholds, not regulatory limits.
