# AI Project Guide

This document is intended to help future AI coding assistants understand the project quickly and avoid common mistakes.

## 1. Project overview

This repository is a full-stack internal management portal for a business operations dashboard.

- Frontend: React 19 + TanStack Start + Vite + Tailwind CSS
- Backend: PHP 8.x + MySQL/MariaDB
- Desktop shell: Electron
- Hosting target: cPanel shared hosting or any PHP/MySQL server

The app is designed around a browser UI that talks to a server-side PHP API for authentication, data storage, uploads, and admin-controlled records.

## 2. High-level architecture

### Frontend

The frontend is under `src/` and uses:

- TanStack Router for page routing
- TanStack Query for data fetching and cache management
- React + TypeScript
- Tailwind for styling
- shadcn/ui-style component primitives in `src/components/ui/`

Key frontend files:

- `src/router.tsx` — router setup
- `src/server.ts` — SSR error wrapper and server entry normalization
- `src/routes/` — route definitions and root layout
- `src/styles.css` — global styles

### Backend API

The backend lives in `backend/` and is a classic PHP API intended for deployment to shared hosting.

Key backend files:

- `backend/config.php` — DB credentials, upload settings, CORS
- `backend/bootstrap.php` — central PDO connection, auth helpers, JSON response helpers, admin checks
- `backend/auth.php` — login/session/me/logout/password endpoints
- `backend/store.php` — general key/value storage for portal data
- `backend/upload.php` — file upload/download endpoints
- `backend/users.php` — user management
- `backend/schema.sql` — database schema
- `backend/install.php` — one-click installer

### Static assets and legacy portal code

- `public/portal-engine.js`
- `public/portal-runtime.js`
- `public/portal.css`

These look like legacy portal/runtime assets that are patched and integrated into the app, not disposable boilerplate.

## 3. Repository layout

```text
.
├── AGENTS.md
├── backend/
│   ├── auth.php
│   ├── bootstrap.php
│   ├── config.php
│   ├── install.php
│   ├── README.md
│   ├── schema.sql
│   ├── store.php
│   ├── upload.php
│   ├── users.php
│   └── uploads/
├── electron/
│   ├── main.cjs
│   └── README.md
├── public/
│   ├── portal-engine.js
│   ├── portal-runtime.js
│   ├── portal.css
│   └── robots.txt
├── src/
│   ├── components/
│   ├── hooks/
│   ├── lib/
│   ├── routes/
│   ├── router.tsx
│   ├── server.ts
│   └── styles.css
├── .gitignore
├── .prettierrc
├── AGENTS.md
├── bunfig.toml
├── components.json
├── eslint.config.js
├── package.json
├── README.md
├── tsconfig.json
├── vite.config.ts
└── AI_PROJECT_GUIDE.md
```

## 4. Setup and run

### Install frontend dependencies

```bash
npm install
```

### Run dev server

```bash
npm run dev
```

Default local dev URL:

```text
http://localhost:8080
```

The app asks for the backend API URL on first use. Example:

```text
https://yourdomain.com/backend/
```

### Production frontend build

```bash
npm run build
```

### Linting

```bash
npm run lint
```

### Formatting

```bash
npm run format
```

## 5. Backend setup

The project assumes a PHP/MySQL environment and is intended for cPanel hosting.

### Required backend config

Edit `backend/config.php` before deployment:

- `db_host`
- `db_name`
- `db_user`
- `db_pass`
- `allowed_origins`
- `upload_dir`
- `session_ttl`

The backend uses a `PDO` connection and a centralized bootstrap for JSON responses, auth checks, and role enforcement.

### Database schema

Use `backend/schema.sql` to create the schema. The installer file is available at `backend/install.php` for setup on a live server.

### Important security note

Secrets should stay server-side in `backend/config.php`. Do not put database credentials or JWT secrets into browser-exposed frontend env files.

## 6. Authentication and authorization model

The backend uses bearer-token authentication.

Authentication-related flow:

- Login creates a session token
- Token is hashed with SHA-256 and stored in the database
- Requests verify bearer tokens via `Authorization: Bearer ...`
- `current_user()` resolves the active user
- `require_user()` and `require_admin()` enforce authentication and admin restriction

Important role logic in `backend/bootstrap.php`:

- Admin-only keys include:
  - `svops:commercials`
  - `svops:revenue`
  - `svops:revenueTargets`
- Non-admin writes are blocked for `svops:team`

This is enforced in both the API layer and UI assumptions.

## 7. API contract summary

Common backend endpoints:

- `POST /auth.php?action=login`
- `GET /auth.php?action=me`
- `POST /auth.php?action=logout`
- `POST /auth.php?action=password`
- `GET|POST /store.php`
- `GET|POST|DELETE /upload.php`
- `GET|POST|DELETE /users.php`

Requests are expected to return JSON, and the bootstrap layer standardizes JSON error responses and CORS behavior.

## 8. Data and storage patterns

The app stores portal data in a database-backed store pattern rather than a single monolithic JSON blob. The server exposes general-purpose storage operations via `backend/store.php`.

The backend also includes a structured activity log that is intentionally non-fatal if the activity table is absent; this avoids breaking the app during early setup or upgrade.

## 9. Frontend conventions

### TanStack Start notes

The project uses TanStack Start and a custom server entry wrapper:

- `src/server.ts` catches SSR failures and renders a fallback view rather than crashing the entire app
- `src/router.tsx` configures the router and query client context

### UI building blocks

The repository includes a robust set of reusable primitives in `src/components/ui/` and is likely based on a shadcn-like design system. When editing UI, keep those primitives consistent with existing patterns.

## 10. Important implementation notes for future AI work

- Prefer small, surgical edits over sweeping rewrites.
- Keep backend and frontend contracts aligned; API payload shapes matter.
- Respect the project’s PHP/MySQL deployment model; do not assume a Node-only backend.
- Preserve CORS and auth expectations when changing any API route.
- When touching restricted modules, consider both UI restrictions and server-side admin checks.
- Do not remove or rename important config keys without checking all consumers.
- Avoid adding secrets in frontend code or `.env` values that are loaded by the browser.

## 11. Developer workflow guidance

Before making a feature change:

1. Read the relevant backend endpoint or route file.
2. Check how it is authenticated and authorized.
3. Look for existing patterns in nearby modules before introducing a new one.
4. Validate changes with the smallest relevant check:
   - `npm run lint`
   - `npm run build`
   - PHP-level endpoint smoke tests when backend changes are involved

## 12. Lovable / git caution

The project includes a note in `AGENTS.md` that this repo is connected to Lovable and that published git history should not be rewritten through force pushes, rebases, or amends. This is important to preserve project history and avoid breaking the Lovable sync.

## 13. Recommended default working assumptions

Treat this as a production-facing internal portal with a real backend and real security constraints.

The most likely modification points are:

- `src/routes/` for UI pages
- `src/components/` for UI behavior and shared elements
- `backend/*.php` for auth and storage logic
- `backend/config.php` for environment-specific config

## 14. Useful first commands

```bash
npm install
npm run dev
npm run lint
npm run build
```

## 15. Summary

This project is a hybrid web app and PHP API system that is intended to run in a hosted environment. The front end is modern React/TanStack, the backend is PHP/MySQL, and authentication/authorization is central to the design. Future AI work should respect the existing API contracts, security rules, and deployment assumptions.
