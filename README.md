# SV Internal Management Portal

A full-stack internal management dashboard built with a **React + TanStack Start** frontend and a **PHP + MySQL** backend designed for cPanel hosting. Includes an Electron shell ready for Windows desktop packaging.

---

## What is included

- `src/` — React frontend (TanStack Start / Vite / Tailwind CSS)
- `public/portal-engine.js`, `public/portal-runtime.js`, `public/portal.css` — the original portal UI logic, patched for role-based access and API storage
- `backend/` — PHP API endpoints for auth, storage, file uploads, and user management
- `electron/` — Electron main process and packaging instructions
- `backend/schema.sql` — MySQL database schema
- `backend/install.php` — one-click backend installer

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TanStack Start, Vite 7, Tailwind CSS v4 |
| Backend | PHP 8.1+, MySQL 5.7+ / MariaDB 10.3+ |
| Desktop | Electron + `@electron/packager` |
| Hosting | cPanel shared hosting (or any PHP/MySQL server) |

---

## 1. Frontend setup (local development)

### Requirements

- Node.js 20+ and a package manager (`npm`, `yarn`, `pnpm`, or `bun`)
- Git (optional)

### Steps

1. **Unzip the project** into a folder, for example:

   ```bash
   cd C:\Users\<you>\Projects\sv-portal
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the dev server**:

   ```bash
   npm run dev
   ```

4. Open your browser to:

   ```
   http://localhost:8080
   ```

5. The first screen asks for your **Backend API URL**. Enter the URL where you uploaded the PHP files, for example:

   ```
   https://yourdomain.com/backend/
   ```

> The dev server runs on port `8080` by default. If that port is busy it will try the next available port and print the URL in the terminal.

---

## 2. Backend setup (PHP / MySQL / cPanel)

### Option A — Manual setup

1. **Create a MySQL database** in cPanel (or your hosting control panel).

2. **Create a database user** and grant it all privileges on that database.

3. **Edit `backend/config.php`** with your database credentials:

   ```php
   define('DB_HOST', 'localhost');
   define('DB_NAME', 'your_database_name');
   define('DB_USER', 'your_database_user');
   define('DB_PASS', 'your_database_password');
   define('JWT_SECRET', 'change-this-to-a-long-random-string');
   define('BASE_URL', 'https://yourdomain.com/backend/');
   ```

   > `JWT_SECRET` should be at least 32 random characters. Do not share it.

4. **Upload the `backend/` folder** to your cPanel public_html directory, for example:

   ```
   public_html/backend/
   ```

5. **Import the schema** using phpMyAdmin or the MySQL CLI:

   ```bash
   mysql -u your_database_user -p your_database_name < backend/schema.sql
   ```

6. **Create the uploads directory** and make it writable:

   ```bash
   mkdir -p backend/uploads
   chmod 755 backend/uploads
   ```

7. **Test the backend** by visiting:

   ```
   https://yourdomain.com/backend/auth.php?action=status
   ```

   You should see a JSON response.

### Option B — One-click installer

1. Upload the entire `backend/` folder to your server.
2. Visit `https://yourdomain.com/backend/install.php` in your browser.
3. Fill in the database credentials and submit.
4. Delete `install.php` after installation for security.

---

## 3. First login / creating the admin user

The first time the backend runs, no users exist. The frontend login form accepts an email and password, but before that you need to create an admin user.

Run this SQL in phpMyAdmin or the MySQL CLI:

```sql
INSERT INTO users (email, password_hash, role, name, status)
VALUES (
  'admin@example.com',
  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin',
  'Administrator',
  'active'
);
```

The password hash above is the bcrypt hash for **`password`**. Log in with:

- Email: `admin@example.com`
- Password: `password`

Change the password immediately after logging in.

---

## 4. Project structure

```text
.
├── backend/                 # PHP API
│   ├── auth.php             # login / session / password change
│   ├── bootstrap.php        # shared DB, JWT, CORS helpers
│   ├── config.php           # database + app config
│   ├── install.php          # one-click installer
│   ├── schema.sql           # MySQL schema
│   ├── store.php            # JSON document storage for portal data
│   ├── upload.php           # file upload / download endpoints
│   ├── users.php            # admin user management
│   └── .htaccess            # security hardening
├── electron/                # Electron desktop shell
│   ├── main.cjs             # Electron main process
│   └── README.md
├── public/                  # static assets + portal runtime
│   ├── portal.css
│   ├── portal-engine.js
│   ├── portal-runtime.js
│   └── favicon.ico
├── src/                     # React frontend
│   ├── router.tsx
│   ├── routes/
│   │   ├── __root.tsx
│   │   ├── index.tsx
│   │   └── sitemap.xml.ts
│   └── styles.css
├── index.html
├── package.json
├── README.md
└── vite.config.ts
```

---

## 5. Environment variables

Create a `.env` file in the project root if you need to override frontend build settings:

```env
# Optional: the default backend URL used in the login screen placeholder
VITE_DEFAULT_API_URL=https://yourdomain.com/backend/
```

> Never put secrets in `.env` files that are shipped to the browser. Backend secrets belong in `backend/config.php`.

---

## 6. Building for production

### Web build

```bash
npm run build
```

The static files are output to `dist/`. Upload the contents of `dist/` to your cPanel `public_html` folder (or a subdomain).

> If you are also packaging the Electron app, make sure `vite.config.ts` has `base: './'` before building.

### Electron desktop app (Windows)

1. Make sure `base: './'` is set in `vite.config.ts`.
2. Build the web assets:

   ```bash
   npm run build
   ```

3. Install Electron tooling:

   ```bash
   npm install --save-dev electron @electron/packager
   ```

4. Package for Windows:

   ```bash
   npx @electron/packager . "SVPortal" \
     --platform=win32 --arch=x64 \
     --out=electron-release --overwrite \
     --ignore='node_modules' \
     --ignore='^/src' --ignore='^/public' \
     --ignore='^/electron-release'
   ```

5. The output folder `electron-release/SVPortal-win32-x64/` contains the runnable `.exe` and supporting files.

See `electron/README.md` for macOS and Linux packaging notes.

---

## 7. Common issues

| Problem | Solution |
|---------|----------|
| Blank white window in Electron | Make sure `base: './'` is set in `vite.config.ts` and you rebuilt. |
| `__dirname is not defined` | `electron/main.cjs` is already CommonJS; do not rename it to `.js`. |
| File uploads fail | Check that `backend/uploads/` exists and is writable (`chmod 755`). |
| CORS errors in browser | Make sure `BASE_URL` in `backend/config.php` matches the frontend origin exactly. |
| "Unauthorized" after login | Check that `JWT_SECRET` is set and matches between requests. |
| MySQL permission denied | Verify the database user has full privileges and the password is correct. |

---

## 8. Security checklist

Before going live:

- [ ] Change `JWT_SECRET` to a long random string.
- [ ] Delete `backend/install.php` after installation.
- [ ] Change the default admin password.
- [ ] Upload files outside `public_html` if your host allows it, or protect `backend/uploads/` with `.htaccess` rules.
- [ ] Enable HTTPS on your domain.
- [ ] Keep PHP, MySQL, and Node.js dependencies up to date.

---

## 9. Need help?

- Backend docs: `backend/README.md`
- Electron docs: `electron/README.md`

## Remote API + MySQL mode

1. Upload `/backend` to cPanel and edit `backend/config.php` (`db_host`, `db_port`/`db_socket`, `db_name`, `db_user`, `db_pass`, `allowed_origins`).
2. Import `backend/schema.sql` (or open `backend/install.php` once). Seeded admin: `admin@svdigital.ae` / `ChangeMe123!` — change it after first login.
3. On the login screen, enter the API base URL (e.g. `https://yourdomain.com/backend`) and press **Test connection** — it calls `backend/health.php` and reports MySQL version, table status and upload-folder permissions.
4. Sign in. Anything created while offline is pushed to MySQL automatically on the first successful remote login.

All nine modules read and write through `backend/store.php` (bulk GET via `?keys=a,b` and bulk POST via `{ entries: [...] }`), and file attachments upload to `backend/upload.php`, which stores them on the host and records them in the `files` table. Revenue and Commercials remain admin-only, enforced server-side.
