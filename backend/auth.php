<?php
// /auth.php?action=login   POST { email, password }  -> { token, user }
// /auth.php?action=me      GET  (Bearer token)       -> { user }
// /auth.php?action=logout  POST (Bearer token)
// /auth.php?action=password POST { current_password, new_password }

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$action = $_GET['action'] ?? '';

if ($action === 'login') {
    $body = body_json();
    $email = trim((string) ($body['email'] ?? ''));
    $password = (string) ($body['password'] ?? '');
    if ($email === '' || $password === '') {
        fail('Email and password are required.');
    }

    // Brute-force guard: max 5 failed attempts per email+IP in 15 minutes.
    $limited = false;
    try {
        $c = db()->prepare('SELECT COUNT(*) AS c FROM login_attempts WHERE email = ? AND ip = ? AND created_at > (NOW() - INTERVAL 15 MINUTE)');
        $c->execute([$email, client_ip()]);
        $limited = (int) $c->fetch()['c'] >= 5;
    } catch (Throwable $e) {}
    if ($limited) {
        fail('Too many failed attempts. Try again in 15 minutes.', 429);
    }

    $stmt = db()->prepare('SELECT id, name, email, role, password_hash FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    $user = $stmt->fetch();
    if (!$user || !password_verify($password, $user['password_hash'])) {
        try {
            db()->prepare('INSERT INTO login_attempts (email, ip) VALUES (?, ?)')->execute([$email, client_ip()]);
        } catch (Throwable $e) {}
        log_activity(null, 'login_failed', $email);
        fail('Invalid email or password.', 401);
    }
    try {
        db()->prepare('DELETE FROM login_attempts WHERE email = ? OR created_at < (NOW() - INTERVAL 1 DAY)')->execute([$email]);
    } catch (Throwable $e) {}
    log_activity($user, 'login', $email);

    $token = bin2hex(random_bytes(32));
    $expires = date('Y-m-d H:i:s', time() + (int) $CONFIG['session_ttl']);
    $ins = db()->prepare('INSERT INTO sessions (user_id, token_hash, expires_at) VALUES (?, ?, ?)');
    $ins->execute([$user['id'], hash('sha256', $token), $expires]);

    // housekeeping: drop expired sessions
    db()->exec('DELETE FROM sessions WHERE expires_at < NOW()');

    json_out([
        'token' => $token,
        'user'  => [
            'id'    => (int) $user['id'],
            'name'  => $user['name'],
            'email' => $user['email'],
            'role'  => $user['role'],
        ],
    ]);
}

if ($action === 'me') {
    json_out(['user' => require_user()]);
}

if ($action === 'logout') {
    $token = bearer_token();
    if ($token) {
        $stmt = db()->prepare('DELETE FROM sessions WHERE token_hash = ?');
        $stmt->execute([hash('sha256', $token)]);
    }
    json_out(['ok' => true]);
}

if ($action === 'password') {
    $user = require_user();
    $body = body_json();
    $current = (string) ($body['current_password'] ?? '');
    $new = (string) ($body['new_password'] ?? '');
    if (strlen($new) < 8) {
        fail('New password must be at least 8 characters.');
    }
    $stmt = db()->prepare('SELECT password_hash FROM users WHERE id = ?');
    $stmt->execute([$user['id']]);
    $row = $stmt->fetch();
    if (!$row || !password_verify($current, $row['password_hash'])) {
        fail('Current password is incorrect.', 401);
    }
    $upd = db()->prepare('UPDATE users SET password_hash = ? WHERE id = ?');
    $upd->execute([password_hash($new, PASSWORD_BCRYPT), $user['id']]);
    log_activity($user, 'password_change', $user['email']);
    json_out(['ok' => true]);
}

fail('Unknown action', 404);
