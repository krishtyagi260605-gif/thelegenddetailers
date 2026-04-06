# Legends Detailer Project

Client-ready workspace with:

- `frontend-legends`: public-facing Legends Detailers website
- `app`: separate internal ops app for owner and employees
- `frontend-magic`: legacy redirect entry that points users to Legends admin
- `backend`: FastAPI API with SQLite or Postgres support

## What is now working

- Premium landing page for the detailing brand
- Separate internal ops app with owner/employee login
- Repeat-customer autofill by phone, plate, or past records
- Customer and vehicle master records for faster repeat intake
- Secure admin login flow inside the Legends website
- Searchable vehicle history
- Daily and monthly turnover metrics
- Admin portal with:
  - quick job creation
  - live service board by status
  - payment and doorstep visibility
  - recent jobs and operational summary
- Admin-protected create/update routes in the backend
- Backend startup schema repair for older SQLite databases
- Docker backend build support

## Run locally

### 1. Start backend

```bash
cd "/Users/krishtyagi/Desktop/legends detailer/backend"
cp .env.example .env
../venv/bin/uvicorn app.main:app --reload --port 8000
```

### 2. Start public website

```bash
cd "/Users/krishtyagi/Desktop/legends detailer/frontend-legends"
cp .env.example .env.local
npm run dev -- --port 3001
```

Open `http://localhost:3001`

### 3. Start internal ops app

```bash
cd "/Users/krishtyagi/Desktop/legends detailer/app"
cp .env.example .env.local
npm run dev -- --port 3002
```

Open `http://localhost:3002`

### 4. Open staff admin

Public-site admin remains at `http://localhost:3001/admin`, but the recommended staff workflow is now the separate ops app.

## Optional API base URL

Both frontends default to:

```bash
http://localhost:8000
```

To change it, create `.env.local` in the frontend:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## Admin auth

Backend admin login is controlled by backend env vars:

```bash
ADMIN_USERNAME=admin
ADMIN_PASSCODE=legend5911
ADMIN_TOKEN_SECRET=change-me-in-production
```

Change those before production. Staff then log in from:

```bash
http://localhost:3001/admin
```

Ops app default seeded users are controlled by backend env vars:

```bash
OPS_OWNER_USERNAME=admin
OPS_OWNER_PASSWORD=legend5911
OPS_EMPLOYEE_USERNAME=employee
OPS_EMPLOYEE_PASSWORD=legendemployee
```

Those users log in from:

```bash
http://localhost:3002
```

## Useful API routes

- `POST /api/legends/admin/login`
- `GET /api/legends/admin/session`
- `POST /api/legends/ops/auth/login`
- `GET /api/legends/ops/auth/session`
- `GET /api/legends/ops/lookups/repeat`
- `GET /api/legends/ops/dashboard`
- `GET /api/legends/ops/jobs`
- `POST /api/legends/ops/jobs`
- `PATCH /api/legends/ops/jobs/{id}`
- `GET /api/legends/turnover`
- `GET /api/legends/dashboard`
- `GET /api/legends/services`
- `GET /api/legends/history?q=...`
- `POST /api/legends/services`
- `PATCH /api/legends/services/{id}`

Protected routes:
- `POST /api/legends/services`
- `PATCH /api/legends/services/{id}`

Data storage:
- local development uses `backend/magic_engine.db`
- production can use Postgres by setting `DATABASE_URL`

## Production checks completed

- backend Python compile check passed
- `frontend-legends` lint passed
- `frontend-legends` production build passed
- `frontend-magic` lint passed
- `frontend-magic` production build passed

## Deploy on Render

This repo includes a root [render.yaml](/Users/krishtyagi/Desktop/legends%20detailer/render.yaml) blueprint for:

- `thelegenddetailers`: Next.js frontend
- `legends-ops`: internal ops app
- `legenddetailers-api`: FastAPI backend
- `legenddetailers-db`: managed Postgres

### Recommended Render flow

1. Push this full project to GitHub.
2. In Render, choose `New +` -> `Blueprint`.
3. Select this GitHub repository.
4. Render will read `render.yaml` and propose:
   - frontend web service
   - backend web service
   - Postgres database
5. Before final deploy, set:
   - `ADMIN_PASSCODE` to your real private admin password
6. Deploy the blueprint.
7. After deploy, if Render gives your frontend/backend slightly different URLs than the defaults in `render.yaml`, update:
   - backend `CORS_ORIGINS`
   - frontend `NEXT_PUBLIC_API_BASE_URL`
8. Redeploy both services once after those URL checks.

### Render service settings

Backend:

- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

Frontend:

- Root directory: `frontend-legends`
- Build command: `npm install && npm run build:render`
- Start command: `npm run start -- --hostname 0.0.0.0 --port $PORT`

### Production notes

- Do not use SQLite on Render for real client data. Use Postgres through `DATABASE_URL`.
- Change `ADMIN_USERNAME`, `ADMIN_PASSCODE`, and `ADMIN_TOKEN_SECRET` before production use.
- The public site talks to the FastAPI backend using `NEXT_PUBLIC_API_BASE_URL`.
