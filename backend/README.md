# SV Management Portal — cPanel backend (PHP + MySQL)

This folder is the API the portal talks to. It runs on ordinary shared hosting (cPanel, PHP 8.0+, MySQL 5.7+/MariaDB).

## 1. Create the database
cPanel → **MySQL Databases** → create a database and a user, then add the user to the database with **All Privileges**.

## 2. Upload the API
Upload the contents of this `backend/` folder to a folder inside `public_html`, e.g.:

```
public_html/portal-api/
├── auth.php
├── bootstrap.php
├── config.php
├── install.php
├── schema.sql
├── store.php
├── upload.php
├── users.php
├── .htaccess
└── uploads/        (created automatically, chmod 755)
```

## 3. Configure
Edit `config.php`:

- `db_host`, `db_name`, `db_user`, `db_pass` — from step 1
- `allowed_origins` — set to your published app URL (and `http://localhost:8080` while developing). `['*']` works for testing.
- `upload_dir` — defaults to `./uploads`

## 4. Install
Open `https://yourdomain.com/portal-api/install.php` once. It creates all tables and the first admin:

```
admin@svdigital.ae / ChangeMe123!
```

**Then delete `install.php`** and change the password from the portal.

## 5. Point the app at the API
On the portal login screen, set **API base URL** to `https://yourdomain.com/portal-api`.

## Endpoints

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/auth.php?action=login` | Sign in → bearer token |
| GET | `/auth.php?action=me` | Current user |
| POST | `/auth.php?action=logout` | Revoke token |
| POST | `/auth.php?action=password` | Change own password |
| GET/POST | `/store.php` | Module data (projects, team, pipeline, …) |
| POST/GET/DELETE | `/upload.php` | File uploads stored on the server |
| GET/POST/DELETE | `/users.php` | Admin-only user management |

## Roles

- **admin** — full access, including Commercials, Revenue and Credentials, plus user management.
- **member** — everything except the restricted modules above. Enforced both in the UI and server-side in `bootstrap.php` (`ADMIN_ONLY_KEYS`).

## Security notes

- Passwords are bcrypt-hashed; sessions are random 256-bit tokens stored as SHA-256 hashes with an expiry.
- Uploads are extension-allowlisted, size-limited, stored under random names and streamed back through `upload.php` (direct access to `uploads/` is denied by `.htaccess`).
- Always serve the API over HTTPS.
