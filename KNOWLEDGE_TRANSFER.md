# Knowledge Transfer Document

## 1. Project identity

This project is the internal operations / task-management portal for SV Digital.

It is built as a full-stack business app with:

- Frontend: React 19 + TanStack Start + Vite + Tailwind CSS
- Backend: PHP 8.x + MySQL/MariaDB
- Desktop shell: Electron for Windows packaging
- Hosting target: cPanel shared hosting or any PHP/MySQL server

This is effectively the operational and task-management platform behind the internal workflow, project coordination, team tracking, revenue tracking, and client management features.

---

## 2. Project overview

The system is designed to help a business manage:

- Team members and roles
- Projects and active engagements
- Pipeline and client work
- Credentials and operational records
- Revenue, commercial data, and admin-only tasks
- Files and uploads
- Internal activity tracking and user management

The application is meant to work as:

1. A browser-based portal for daily internal operations
2. A PHP/MySQL powered backend for secure storage and API access
3. A Windows desktop packaged version via Electron

---

## 3. Architecture

### High-level architecture

```text
                SV MANAGEMENT PORTAL
                       │
          ┌────────────┴────────────┐
          │                         │
      Frontend (React)       Electron Desktop
          │                         │
          └────────────┬────────────┘
                       │
                  PHP APIs
                       │
                    MySQL
                   Database
```

### Presentation layer

- Frontend code lives under `src/`
- Uses TanStack Router, React Query, and Tailwind CSS
- Main route shell and app screen logic live in:
  - `src/routes/__root.tsx`
  - `src/routes/index.tsx`

### Backend layer

- Backend API is under `backend/`
- This is a classic server-side PHP API intended for deployment to a standard web host
- Core files include:
  - `backend/auth.php` — login, session, logout, password
  - `backend/store.php` — generic record storage
  - `backend/users.php` — admin user management
  - `backend/upload.php` — file upload/download service
  - `backend/bootstrap.php` — DB connection, JWT/session helpers, CORS, auth checks
  - `backend/config.php` — DB, URL, upload, and access settings
  - `backend/schema.sql` — database schema
  - `backend/install.php` — installer helper for live env setup

### Static legacy assets

The project also contains legacy runtime files under `public/`:

- `public/portal-engine.js`
- `public/portal-runtime.js`
- `public/portal.css`

These appear to be older portal logic that was adapted into the current app structure and should be treated as part of the existing portal runtime and not as disposable boilerplate.

---

## 4. How the app works

### Frontend flow

1. The React app starts in `src/routes/index.tsx`
2. User lands on a login screen if no valid session is present
3. The frontend asks for the backend API base URL
4. The app checks the backend health and DB connectivity before allowing sign-in
5. Once authenticated, the UI loads the main portal dashboard and modules

### Backend flow

1. The frontend calls the PHP API using the configured backend URL
2. `backend/bootstrap.php` opens the MySQL connection and validates requests
3. Auth tokens are checked for each protected request
4. Storage and user operations are handled via `store.php`, `auth.php`, `users.php`, and `upload.php`
5. The app uses a DB-backed store rather than a single giant JSON file

### Authentication model

- Login creates a session or token-based auth flow
- Authorization is enforced server-side
- Admin-only areas are blocked for non-admin users
- A few sensitive modules are restricted to admin access, including some revenue/commercial-related data

---

## 5. Repository layout

```text
.
├── backend/                # PHP APIs and DB-related files
├── electron/               # Electron wrapper for the Windows desktop app
├── public/                 # static app assets and legacy runtime UI files
├── src/                    # React frontend and routing code
├── AGENTS.md               # repo notes and working-state reminders
├── AI_PROJECT_GUIDE.md     # developer onboarding guide
├── README.md               # project setup and deployment guide
├── KNOWLEDGE_TRANSFER.md   # this handover document
├── package.json            # app deps and scripts
├── vite.config.ts          # Vite setup
├── tsconfig.json           # TypeScript config
├── .gitignore              # ignore rules
├── components.json         # UI tooling metadata
└── etc.
```

---

## 6. Setup and local running

### Frontend setup

```bash
npm install
npm run dev
```

Local app URL:

```text
http://localhost:8080
```

### Production build

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

---

## 7. Backend setup requirements

The backend expects a PHP + MySQL server such as:

- cPanel shared hosting
- Any PHP-compatible hosting environment
- Local PHP + MySQL environment for development

Required config values in `backend/config.php` include:

- DB host
- DB name
- DB user
- DB password
- Allowed origins
- Upload path
- JWT/session secret values

The app also expects the MySQL schema created using `backend/schema.sql` and, in production, a writable uploads directory.

---

## 8. Important deployment and security notes

- Keep secrets in `backend/config.php` only
- Do not expose DB credentials or JWT secrets to the browser
- `backend/install.php` should be removed after installation for production use
- The uploads folder must be writable
- CORS must match the frontend origin exactly
- Admin passwords and default users should be changed after first login

---

## 9. Known issues / problems already identified

These are the main practical issues captured in the project notes and setup docs:

### Electron-related issues

- Blank white window in Electron can happen if `base: './'` is not set correctly
- `__dirname is not defined` is a known issue if files are renamed incorrectly in the Electron context

### Backend/API issues

- MySQL permission errors if the DB user is not granted proper access
- CORS errors if the backend URL/origin does not match the frontend origin
- Unauthorized errors after login usually point to bad JWT secret or mismatched backend config
- File uploads fail if the `backend/uploads/` folder is missing or not writable

### Setup issues

- The app expects the backend API URL to be configured before login
- If the backend is not available or schema is not created, the app will not function properly
- If no admin user exists, the system cannot proceed to authenticated use

---

## 10. Past handover / project notes

The earlier project notes describe the app as an internal task-management tool and indicate:

- Electron.js was selected for the Windows desktop version
- PHP backend work was handed over to Vignesh
- Remaining work from the original owner was mainly:
  - frontend development
  - website / portal development
  - frontend and backend integration
  - final UI completion
  - application integration

Current status from the project notes:

- In progress: frontend / website development
- Focus area: integration and final UI completion

This means the application is not a finished full product in the repo yet; it is a partially developed internal portal with a working structure and many integrations already in place.

---

## 11. Handover guidance

The next developer or owner should understand the following before continuing work:

- React frontend structure under `src/`
- PHP backend structure under `backend/`
- MySQL storage design and schema expectations
- Authentication and admin restrictions
- Electron packaging flow for Windows
- API integration pattern between frontend and backend
- Deployment assumptions for cPanel hosting

The most important practical fact is that the project is a full-stack system, not just a frontend app. The backend, database config, and API security must be correct before the UI can be used properly.

---

## 12. Recommended next steps for continuation

1. Confirm the backend URL and DB config for the actual live environment
2. Test the PHP API health endpoint and database connectivity
3. Verify the admin user exists and can log in
4. Validate the frontend loads the main portal modules after auth
5. Check the Electron packaging setup if the Windows desktop app is the target delivery
6. Clean up and verify any legacy assets or old portal runtime files before final deployment

---

## 13. Summary

This repo is a functional internal management portal with a React frontend, PHP/MySQL backend, and Electron packaging layer. It is a real full-stack application that needs both the server-side API setup and the frontend UI flows to work together. The main project risk areas are backend configuration, DB setup, auth validity, and the old portal/runtime assets that may still require maintenance during integration.

This document should serve as a practical handover reference for continuing the project without losing context.
