# CoreApex — Smart City Management Platform

> **Mobil İcra** · AI-powered civic reporting, inspector task management, and executive analytics for Azerbaijani municipalities.

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [User Roles & Portals](#user-roles--portals)
6. [API Reference](#api-reference)
7. [AI & Computer Vision Module](#ai--computer-vision-module)
8. [Digital Twin Simulation](#digital-twin-simulation)
9. [Authentication & Security](#authentication--security)
10. [Database Schema](#database-schema)
11. [Frontend Architecture](#frontend-architecture)
12. [PWA & Offline Support](#pwa--offline-support)
13. [Environment Variables](#environment-variables)
14. [Local Development](#local-development)
15. [Deployment](#deployment)

---

## Overview

CoreApex is a full-stack smart city governance platform that connects three distinct user groups:

- **Citizens** submit geo-tagged infrastructure issue reports with AI-assisted photo classification
- **Inspectors** receive routed tasks, update statuses in the field, upload proof-of-completion, and run digital twin simulations before intervention
- **Executives** monitor city-wide KPIs, SLA compliance, inter-agency coordination, and publish government alerts

The platform is designed for Azerbaijani municipalities and operates entirely in Azerbaijani, with all AI outputs generated in Azerbaijani as well.

**Production URL:** `https://coreapex.onrender.com`

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      Browser / PWA                       │
│              React 18 + TypeScript + Vite               │
│                                                          │
│   ┌──────────┐  ┌────────────┐  ┌────────────────────┐  │
│   │ Citizen  │  │ Inspector  │  │    Executive        │  │
│   │  Portal  │  │   Portal   │  │      Portal         │  │
│   └──────────┘  └────────────┘  └────────────────────┘  │
└───────────────────────┬─────────────────────────────────┘
                        │  Axios (Bearer JWT)
                        │  /api/v1/*  (Vite proxy in dev)
                        ▼
┌─────────────────────────────────────────────────────────┐
│                  FastAPI Backend                          │
│              Python 3.11 + Uvicorn                       │
│                                                          │
│  /auth  /reports  /tasks  /proposals  /alerts            │
│  /analytics  /simulation                                 │
│                                                          │
│  ┌─────────────┐    ┌─────────────────────────────────┐ │
│  │  Supabase   │    │         Groq API                 │ │
│  │  Auth + DB  │    │  Llama-4-scout-17b-16e (vision)  │ │
│  │  + Storage  │    │  Image → Category + Description  │ │
│  └─────────────┘    └─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Request Flow — Citizen Report Submission

```
1. Citizen opens camera in NewReport page
2. Photo uploaded to POST /reports/classify-upload
3. Backend reads image bytes → sends to Groq Llama-4-scout
4. AI returns: { category, title, description, assigned_agency }
5. Image stored in Supabase Storage (report-photos bucket)
6. Frontend pre-fills form with AI suggestions
7. Citizen reviews, edits if needed, submits
8. Report saved to Supabase DB with status = "pending"
9. Inspector assigned → Task created → Inspector notified
```

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 18.3.1 | UI framework |
| TypeScript | 5.7.2 | Type safety |
| Vite | 6.0.5 | Build tool & dev server |
| React Router | 6.28.0 | Client-side routing |
| Tailwind CSS | 3.4.17 | Utility-first styling |
| Recharts | 2.15.2 | Analytics charts (bar, line, pie, donut) |
| @vis.gl/react-google-maps | 1.8.3 | Interactive task map with GPS markers |
| Axios | 1.7.9 | HTTP client with JWT interceptors |
| Sonner | 2.0.3 | Toast notifications |
| lucide-react | 0.487.0 | Icon library |
| vite-plugin-pwa | 1.3.0 | Progressive Web App manifest + service worker |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Python | 3.11 | Runtime |
| FastAPI | latest | REST API framework |
| Uvicorn | 0.29.0 | ASGI server |
| Supabase Python SDK | latest | Database + Auth + Storage client |
| Groq SDK | latest | LLM API for image classification |
| OpenCV (headless) | 4.9.0 | Image authenticity verification |
| python-dotenv | 1.0.1 | Environment variable management |
| PyJWT | 2.13.0 | JWT token handling |

### Infrastructure

| Service | Role |
|---|---|
| Supabase | PostgreSQL database + Auth (JWT) + File storage |
| Groq Cloud | AI inference — Llama-4-scout multimodal model |
| Google Maps Platform | Maps API for inspector route view |
| Render.com | Backend hosting (FastAPI + Uvicorn) |

---

## Project Structure

```
CoreApex/
├── README.md
│
├── frontend/
│   ├── package.json
│   ├── vite.config.ts          # Vite + PWA config, dev proxy to backend
│   ├── tailwind.config.js
│   └── src/
│       ├── main.tsx
│       ├── App.tsx             # Router + protected routes
│       ├── index.css
│       │
│       ├── api/
│       │   ├── client.ts       # Axios instance — JWT interceptor, 401 handler
│       │   └── index.ts        # All API modules (auth, reports, tasks, etc.)
│       │
│       ├── types/
│       │   └── index.ts        # All TypeScript interfaces
│       │
│       ├── mocks/
│       │   └── index.ts        # Realistic mock data (fallback when API is empty)
│       │
│       ├── hooks/
│       │   ├── useApi.ts       # Generic data-fetching hook
│       │   └── useInstallPrompt.ts  # PWA install prompt hook
│       │
│       ├── layouts/
│       │   ├── CitizenLayout.tsx
│       │   ├── InspectorLayout.tsx
│       │   ├── ExecutiveLayout.tsx
│       │   └── Sidebar.tsx
│       │
│       ├── components/
│       │   ├── PortalHeader.tsx
│       │   ├── TaskCard.tsx
│       │   ├── TaskMap.tsx         # Google Maps component with task pins
│       │   ├── ProposalCard.tsx
│       │   ├── AlertCard.tsx
│       │   ├── KPICard.tsx
│       │   ├── ReportCard.tsx
│       │   ├── StatusBadge.tsx
│       │   ├── InstallBanner.tsx   # PWA install prompt UI
│       │   ├── LocationPickerMap.tsx
│       │   └── ui/
│       │       ├── Button.tsx
│       │       ├── Input.tsx
│       │       ├── Modal.tsx
│       │       ├── Spinner.tsx
│       │       └── Breadcrumb.tsx
│       │
│       └── pages/
│           ├── Landing.tsx
│           ├── AuthPage.tsx
│           ├── CitizenPage.tsx
│           ├── citizen/
│           │   ├── Dashboard.tsx
│           │   ├── Reports.tsx
│           │   ├── NewReport.tsx       # AI photo upload + form
│           │   ├── Proposals.tsx
│           │   └── Alerts.tsx
│           ├── inspector/
│           │   ├── InspectorPage.tsx   # Main tabbed inspector portal
│           │   ├── Dashboard.tsx
│           │   ├── Tasks.tsx
│           │   └── Simulation.tsx
│           └── executive/
│               ├── ExecutivePage.tsx   # Main tabbed executive portal
│               ├── Dashboard.tsx
│               ├── Analytics.tsx
│               ├── Archive.tsx
│               └── Reports.tsx
│
└── backend/
    ├── main.py                 # FastAPI app entry point + CORS + router registration
    ├── start_server.py
    ├── make_tables.py          # DB table creation script
    │
    ├── routers/
    │   ├── auth.py             # /auth — login, register, me
    │   ├── reports.py          # /reports — CRUD, AI classify, CSV export
    │   ├── tasks.py            # /tasks — inspector task management
    │   ├── proposals.py        # /proposals — community proposals + voting
    │   ├── alerts.py           # /alerts — government notifications
    │   ├── analytics.py        # /analytics — KPIs, trends, agency performance
    │   └── simulation.py       # /simulation — digital twin layers & risk
    │
    ├── models/
    │   └── schemas.py          # Pydantic request/response schemas
    │
    ├── services/
    │   ├── groq_classifier.py  # Groq Llama-4-scout image classification
    │   ├── ai_classifier.py    # Alternative AI classifier
    │   └── security.py        # Image authenticity verification (OpenCV)
    │
    └── core/
        └── dependencies.py     # Supabase client dependency injection
```

---

## User Roles & Portals

### Role: `citizen`

Route: `/citizen`

Citizens can submit reports, track their status, vote on community proposals, and read government alerts.

**Tabs / Pages:**
- **Dashboard** — summary of own reports with status badges
- **Reports** — full list with filter (pending / in-progress / resolved) and detail view
- **New Report** — camera upload → AI classification → form review → submit
- **Proposals** — browse and upvote community improvement proposals
- **Alerts** — district-specific government announcements

**Report Lifecycle for Citizen:**
```
Submit (pending) → Assigned to Inspector (inprogress) → Completed (resolved) / Missed SLA (overdue)
```

---

### Role: `inspector`

Route: `/inspector`

Inspectors are field workers who receive tasks routed from citizen reports and manage them from their mobile device.

**Tabs:**

| Tab | Description |
|---|---|
| Gündalik Marşrut (Route) | Google Maps view with all assigned tasks as colored pins; tap to navigate |
| Tapşırıqlar Paneli (Tasks) | Accordion list of tasks with status controls, GPS badge, and file upload |
| Simulyasiya Paneli (Simulation) | Digital Twin — toggle geo-layers and compute impact score before intervention |
| Təkliflər (Proposals) | Read community proposals to understand citizen priorities |

**Task Status Flow:**
```
pending → (click "Başla") → inprogress → (click "Tamamla") → resolved
```

**Proof Upload:** Inspectors can attach a photo of completed work via `POST /tasks/{id}/proof` (multipart upload to Supabase Storage).

---

### Role: `executive`

Route: `/executive`

Executives see city-wide operational data and can manage government alerts and inter-agency requests.

**Tabs:**

| Tab | Description |
|---|---|
| Analitik Panel | Bar chart (by neighborhood), donut chart (by category), monthly trend line chart, agency compliance progress bars, SLA breach cards |
| Rəqəmsal Arxiv | Searchable & filterable table of all reports with CSV export |
| Qurumlara Nəzarət | Inter-agency request tracking with SLA countdown and overdue flagging |
| Xəbərdarlıqlar | Create / delete district-specific government alerts (info / warning / success) |

**KPI Cards (top of page):**
- Total reports submitted
- Resolved count
- Open (active) count
- SLA breaches

---

## API Reference

All endpoints are prefixed with `/api/v1` in production (Vite proxy rewrites in development).

### Auth — `/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/auth/register` | None | Register new user; role defaults to `citizen` |
| POST | `/auth/login` | None | Unified login for all roles; role read from Supabase user metadata |
| POST | `/auth/login/staff` | None | Legacy staff login endpoint |
| GET | `/auth/me` | Bearer | Returns current user id, email, full_name, role |

**Login Response:**
```json
{
  "access_token": "eyJ...",
  "role": "citizen",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "Əli Məmmədov"
  }
}
```

---

### Reports — `/reports`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/reports/classify-upload` | Bearer | Upload image file; returns AI classification + photo URL |
| POST | `/reports/ai-classify` | Bearer | Classify from public image URL |
| POST | `/reports/` | Bearer | Create a new report |
| GET | `/reports/mine` | Bearer | Get all reports submitted by current citizen |
| GET | `/reports` | Bearer | Get all reports (executive/inspector); supports `?status=` filter |
| GET | `/reports/{id}` | Bearer | Get single report detail |
| PATCH | `/reports/{id}/status` | Bearer | Update report status |
| POST | `/reports/{id}/sla-report` | Bearer | Submit SLA breach report with recommendations |
| GET | `/reports/export` | Token param | Export filtered reports as CSV file download |

**Category → Agency Routing:**
```python
CATEGORY_AGENCY = {
    "Yollar":     "AAYDA",           # Roads State Agency
    "Zibil":      "MKTB",            # Waste management
    "Abadlıq":    "Yaşıllaşdırma",   # Landscaping
    "Su kəməri":  "Azərsu",
    "Elektrik":   "Azərişıq",
}
```

---

### Tasks — `/tasks`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/tasks/mine` | Bearer | Get all tasks assigned to the current inspector |
| GET | `/tasks/{id}` | Bearer | Get task detail |
| PATCH | `/tasks/{id}/status` | Bearer | Update task status (pending→inprogress→resolved) |
| POST | `/tasks/{id}/proof` | Bearer | Upload proof-of-completion image (multipart) |
| POST | `/tasks/` | Bearer | Create a task from a report (executive/admin) |

---

### Proposals — `/proposals`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/proposals` | Bearer | List all proposals; `?tag=` filter supported |
| POST | `/proposals/` | Bearer | Create new community proposal |
| POST | `/proposals/{id}/vote` | Bearer | Toggle vote on a proposal |

---

### Alerts — `/alerts`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/alerts` | Bearer | List government alerts; `?type=` filter (info/warning/success) |
| POST | `/alerts/` | Bearer (executive) | Create new alert for a district |
| DELETE | `/alerts/{id}` | Bearer (executive) | Delete an alert |

---

### Analytics — `/analytics`

| Method | Path | Description |
|---|---|---|
| GET | `/analytics/summary` | Returns `{ total, resolved, open, sla_breaches }` |
| GET | `/analytics/by-neighborhood` | Report counts grouped by neighborhood |
| GET | `/analytics/by-category` | Report counts grouped by category |
| GET | `/analytics/monthly-trend` | Monthly submitted vs resolved counts for a given year |
| GET | `/analytics/agency-performance` | Per-agency compliance % and avg resolution hours |
| GET | `/analytics/sla-breaches` | List of overdue reports with severity classification |

---

### Simulation — `/simulation`

| Method | Path | Description |
|---|---|---|
| GET | `/simulation/layers?lat=&lng=` | Returns geo-layer risk data for given coordinates |
| POST | `/simulation/run` | Run full simulation; returns impact score + risk level |
| POST | `/simulation/risk-assess` | Assess risk for a specific task |

---

## AI & Computer Vision Module

### Image Classification Pipeline

When a citizen uploads a photo of an infrastructure issue, the backend performs a multi-step AI analysis:

```
1. Receive multipart image upload
2. Read image bytes with aiofiles / standard I/O
3. [Optional] Verify image authenticity with OpenCV
   → Checks for signs of synthetic generation / manipulation
4. Base64-encode image bytes
5. Send to Groq API — model: meta-llama/llama-4-scout-17b-16e-instruct
6. Structured prompt forces JSON output with:
   - category (one of 6 fixed values)
   - title (6-8 word Azerbaijani summary)
   - description (2-3 sentence Azerbaijani description)
7. Parse JSON response; fall back to "Digər" on parse failure
8. Store image in Supabase Storage bucket "report-photos"
9. Return classification + public photo URL to frontend
```

**Prompt Design (Azerbaijani municipal context):**
```
The model is instructed to act as an image analyst for an Azerbaijani municipality.
It must return strictly valid JSON with no surrounding text.
Output language: Azerbaijani.
Categories: Yollar | Su kəməri | Elektrik | Abadlıq | Zibil | Digər
```

**Model:** `meta-llama/llama-4-scout-17b-16e-instruct` via Groq Cloud API  
**Groq Advantage:** Sub-second inference latency compared to OpenAI-hosted models

### Image Authenticity Check

Before classification, `services/security.py` uses OpenCV to perform basic authenticity verification — detecting obvious signs of AI-generated or tampered images to prevent false reports.

---

## Digital Twin Simulation

The Simulation tab in the Inspector portal allows field workers to model environmental impact before starting an intervention.

**Available Geo-Layers:**

| Layer | Description | Impact Score |
|---|---|---|
| Yeraltı Sular (Water) | Underground water pipe network proximity | +20 |
| Şəhər Tıxacı (Traffic) | Traffic flow disruption analysis | +25 |
| Külək Axını (Wind) | Airflow simulation | +15 |
| Səs-küy (Noise) | Acoustic impact radius | +20 |
| Qrunt (Ground) | Geotechnical soil stability analysis | +20 |

**Risk Levels:**
- Score < 30 → Low risk (blue) — proceed normally
- Score 30–60 → Medium risk (amber) — take precautions
- Score > 60 → High risk (red) — intervention recommended before starting

**API behavior:** The `/simulation/layers` endpoint seeds its random number generator with the coordinate hash, ensuring the same location always returns consistent risk data across sessions.

---

## Authentication & Security

### Auth Flow

```
1. POST /auth/login { email, password }
2. Backend calls Supabase sign_in_with_password
3. Supabase returns session { access_token, ... }
4. Backend reads role from user.user_metadata.role
5. Response: { access_token, role, user: { id, email, full_name } }
6. Frontend stores in localStorage:
   - apexcore_token → used in Authorization: Bearer header
   - apexcore_role  → used for route protection
   - apexcore_user  → used to display user name in header
```

### Protected Routes

`App.tsx` wraps each portal with `<ProtectedRoute role="...">`:

```typescript
function ProtectedRoute({ role, children }) {
  const token = localStorage.getItem('apexcore_token')
  const storedRole = localStorage.getItem('apexcore_role')
  if (!token) return <Navigate to="/auth" />
  if (storedRole !== role) return <Navigate to={`/${storedRole}`} />
  return children
}
```

This means a citizen who knows the `/executive` URL will be redirected to `/citizen` automatically.

### Token Lifecycle

The Axios client in `api/client.ts` attaches the token to every request via interceptor. On any `401` response (except login/register routes), the client:
1. Clears `localStorage` (`apexcore_token`, `apexcore_role`)
2. Redirects to `/` (landing page)

---

## Database Schema

The database is hosted on Supabase (PostgreSQL). Key tables:

### `reports`
```
id             uuid PK
report_id      text (human-readable, e.g. "MR-0241")
title          text
description    text
status         text  CHECK (pending|inprogress|resolved|overdue)
category       text
neighborhood   text
address        text
photo_url      text
ai_routed      text  (agency name from AI classification)
citizen_id     uuid FK → auth.users
submitted_date timestamptz
resolved_date  timestamptz
deadline_date  timestamptz
```

### `tasks`
```
id             uuid PK
report_id      uuid FK → reports
inspector_id   uuid FK → auth.users
title          text
address        text
category       text
priority       text  CHECK (high|medium|low)
status         text  CHECK (pending|inprogress|resolved|overdue)
agency_body    text
deadline       timestamptz
map_x          float8  (latitude)
map_y          float8  (longitude)
proof_url      text
```

### `proposals`
```
id             uuid PK
title          text
description    text
tag            text
author_id      uuid FK → auth.users
votes          int4  DEFAULT 0
created_at     timestamptz
```

### `alerts`
```
id             uuid PK
title          text
body           text
type           text  CHECK (info|warning|success)
district       text
created_by     uuid FK → auth.users
created_at     timestamptz
```

---

## Frontend Architecture

### Routing

```
/                   → Landing page (public)
/auth               → Login + Register (public)
/citizen            → CitizenPage (role=citizen required)
/citizen/reports/new → NewReport (role=citizen required)
/inspector          → InspectorPage (role=inspector required)
/inspector/*        → InspectorPage (catch-all for sub-navigation)
/executive          → ExecutivePage (role=executive required)
/executive/*        → ExecutivePage (catch-all)
*                   → Redirect to /
```

### `useApi` Hook

A custom hook that wraps fetch logic with loading/error state:

```typescript
const { data, loading, error, refetch } = useApi<T>(
  () => someApi.method(),
  [dependency]  // optional dep array for re-fetch
)
```

### Mock Data Strategy

`src/mocks/index.ts` contains realistic Azerbaijani municipal data. All portals use it as a **fallback** when the API returns empty arrays — so new accounts immediately see a populated, realistic interface without any backend data.

```typescript
// Pattern used throughout:
const apiData = toArr<T>(rawData)
const data = apiData.length ? apiData : MOCK_DATA
```

This approach means the app is fully demoed without any database setup.

### Google Maps Integration

`TaskMap.tsx` uses `@vis.gl/react-google-maps` to render:
- Markers for each task at `task.map_x` (lat), `task.map_y` (lng) coordinates
- Color-coded by priority: red (high), amber (medium), blue (low)
- Click-to-highlight from the task list via `highlightId` prop
- Info windows with task title and status

---

## PWA & Offline Support

The app is a fully installable Progressive Web App configured via `vite-plugin-pwa`.

**Manifest settings:**
```json
{
  "name": "Mobil İcra",
  "short_name": "Mobil İcra",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#1A3C6E",
  "start_url": "/"
}
```

**Workbox caching strategy:**
- All static assets (JS, CSS, HTML, images, fonts) are precached on install
- Google Fonts → `CacheFirst` with 1-year TTL
- Google Maps tiles → `NetworkFirst` with 24-hour TTL

**Install prompt:** `InstallBanner.tsx` uses the `beforeinstallprompt` browser event (captured by `useInstallPrompt.ts`) to show a native install button.

---

## Environment Variables

### Frontend (`frontend/.env`)

```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_API_URL=https://coreapex.onrender.com   # omit in dev (Vite proxy handles it)
```

### Backend (`backend/.env`)

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
GROQ_API_KEY=your_groq_api_key
```

> **Note:** `SUPABASE_SERVICE_ROLE_KEY` is required for the `/auth/register` endpoint, which uses the Supabase Admin API to create users with email auto-confirmation (bypassing the email verification flow).

---

## Local Development

### Prerequisites

- Node.js 18+
- Python 3.11+
- A Supabase project with tables created (run `backend/make_tables.py`)
- Groq API key
- Google Maps API key

### Backend

```bash
cd backend

# Create virtual environment
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file (see Environment Variables section)

# Start server
uvicorn main:app --reload --port 8000
```

Backend will be available at `http://localhost:8000`  
Swagger docs: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Create .env file (VITE_GOOGLE_MAPS_API_KEY at minimum)

# Start dev server
npm run dev
```

Frontend will be available at `http://localhost:5173`

The Vite dev server proxies all `/api/v1/*` requests to `https://coreapex.onrender.com` by default (configured in `vite.config.ts`). To point at your local backend instead, update the proxy target to `http://localhost:8000`.

### Build for Production

```bash
cd frontend
npm run build
# Output in frontend/dist/
```

---

## Deployment

### Backend (Render.com)

The FastAPI backend is deployed on Render as a Web Service.

**Start command:**
```
uvicorn main:app --host 0.0.0.0 --port $PORT
```

**Root health check:**
```
GET / → { "message": "CoreApex Smart City API Running Successfully" }
```

All environment variables are set in the Render dashboard. CORS is currently configured to allow all origins (`allow_origins=["*"]`); this should be restricted to the frontend domain in a hardened production deployment.

### Frontend

The frontend builds to a static SPA (`dist/`) and can be deployed to any static host (Netlify, Vercel, Render Static Sites, etc.). Ensure `VITE_API_URL` points to the production backend and `VITE_GOOGLE_MAPS_API_KEY` is set in the build environment.

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| Supabase for auth + DB + storage | Single managed service reduces ops overhead; built-in JWT auth eliminates custom auth server |
| Groq + Llama-4-scout | Sub-second vision inference; free tier generous enough for demo; Azerbaijani language support |
| Role-based localStorage routing | Simple, stateless; roles are embedded in Supabase JWT metadata so they cannot be forged |
| Mock data as API fallback | Allows full demo without database records; new accounts see realistic populated UI immediately |
| Vite proxy in development | No CORS issues in dev; production switches to direct `VITE_API_URL` |
| PWA with standalone display | Inspectors use the app in the field on mobile; installable PWA eliminates app store dependency |
| Recharts for analytics | Lightweight, composable, no licensing cost; sufficient for bar/line/pie charts needed |

---

*Built for Azerbaijani smart city governance — CoreApex © 2026*
