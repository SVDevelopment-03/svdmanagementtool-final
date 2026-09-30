-- SV Management Portal — MySQL schema (cPanel / phpMyAdmin)
-- Import this file into your database via phpMyAdmin, or run:
--   mysql -u USER -p DBNAME < schema.sql

CREATE TABLE IF NOT EXISTS users (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name          VARCHAR(120) NOT NULL,
  email         VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          ENUM('admin','member') NOT NULL DEFAULT 'member',
  created_at    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS sessions (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED NOT NULL,
  token_hash CHAR(64) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_sessions_token (token_hash),
  KEY idx_sessions_user (user_id),
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Key/value document store used by the portal modules
-- (projects, team, pipeline, portfolio, marketing, maintenance, revenue, commercials...)
CREATE TABLE IF NOT EXISTS app_store (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  store_key  VARCHAR(190) NOT NULL,
  user_id    INT UNSIGNED NULL,          -- NULL = shared org-wide record
  value      LONGTEXT NOT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uniq_store (store_key, user_id),
  CONSTRAINT fk_store_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS files (
  id           CHAR(36) NOT NULL,
  project_id   VARCHAR(64) NULL,
  original_name VARCHAR(255) NOT NULL,
  stored_name  VARCHAR(255) NOT NULL,
  mime_type    VARCHAR(120) NOT NULL,
  size_bytes   INT UNSIGNED NOT NULL,
  uploaded_by  INT UNSIGNED NULL,
  created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_files_project (project_id),
  CONSTRAINT fk_files_user FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS activity_log (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id    INT UNSIGNED NULL,
  user_name  VARCHAR(120) NULL,
  action     VARCHAR(40) NOT NULL,
  target     VARCHAR(190) NULL,
  detail     VARCHAR(500) NULL,
  ip         VARCHAR(64) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_activity_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS login_attempts (
  id         INT UNSIGNED NOT NULL AUTO_INCREMENT,
  email      VARCHAR(190) NOT NULL,
  ip         VARCHAR(64) NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_login_attempts (email, ip, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Seed admin: admin@svdigital.ae / ChangeMe123!  (change the password after first login)
INSERT INTO users (name, email, password_hash, role)
SELECT 'SV Admin', 'admin@svdigital.ae',
       '$2y$10$inJnWH4gBOoCm4SuVD2ZfelyiH//ribVp3cABQfmXW/KOBDMoiE4K', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@svdigital.ae');
