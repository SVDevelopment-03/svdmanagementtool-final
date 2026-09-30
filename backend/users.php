<?php
// Admin-only user management.
//   GET    /users.php            -> { users: [...] }
//   POST   /users.php  { name, email, password, role }
//   DELETE /users.php?id=..

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$admin = require_admin();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $rows = db()->query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at ASC')->fetchAll();
    json_out(['users' => $rows]);
}

if ($method === 'POST') {
    $body = body_json();
    $name = trim((string) ($body['name'] ?? ''));
    $email = trim((string) ($body['email'] ?? ''));
    $password = (string) ($body['password'] ?? '');
    $role = ($body['role'] ?? 'member') === 'admin' ? 'admin' : 'member';

    if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 8) {
        fail('Name, a valid email and a password of at least 8 characters are required.');
    }

    $exists = db()->prepare('SELECT id FROM users WHERE email = ?');
    $exists->execute([$email]);
    if ($exists->fetch()) {
        fail('A user with that email already exists.', 409);
    }

    $stmt = db()->prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)');
    $stmt->execute([$name, $email, password_hash($password, PASSWORD_BCRYPT), $role]);
    $newId = (int) db()->lastInsertId();
    log_activity($admin, 'user_create', $email, $role);
    json_out(['ok' => true, 'id' => $newId], 201);
}

if ($method === 'PUT') {
    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) fail('id is required');
    $body = body_json();
    $sets = [];
    $vals = [];
    if (isset($body['name']) && trim((string) $body['name']) !== '') {
        $sets[] = 'name = ?'; $vals[] = trim((string) $body['name']);
    }
    if (isset($body['email'])) {
        $email = trim((string) $body['email']);
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) fail('Invalid email');
        $dup = db()->prepare('SELECT id FROM users WHERE email = ? AND id <> ?');
        $dup->execute([$email, $id]);
        if ($dup->fetch()) fail('A user with that email already exists.', 409);
        $sets[] = 'email = ?'; $vals[] = $email;
    }
    if (isset($body['role'])) {
        if ($id === $admin['id'] && $body['role'] !== 'admin') fail('You cannot remove your own admin role.');
        $sets[] = 'role = ?'; $vals[] = $body['role'] === 'admin' ? 'admin' : 'member';
    }
    if (!empty($body['password'])) {
        if (strlen((string) $body['password']) < 8) fail('Password must be at least 8 characters.');
        $sets[] = 'password_hash = ?'; $vals[] = password_hash((string) $body['password'], PASSWORD_BCRYPT);
    }
    if (!$sets) fail('Nothing to update');
    $vals[] = $id;
    db()->prepare('UPDATE users SET ' . implode(', ', $sets) . ' WHERE id = ?')->execute($vals);
    if (!empty($body['password'])) {
        db()->prepare('DELETE FROM sessions WHERE user_id = ?')->execute([$id]);
    }
    log_activity($admin, 'user_update', (string) $id, !empty($body['password']) ? 'password reset' : '');
    json_out(['ok' => true]);
}

if ($method === 'DELETE') {
    $id = (int) ($_GET['id'] ?? 0);
    if ($id <= 0) {
        fail('id is required');
    }
    if ($id === $admin['id']) {
        fail('You cannot delete your own account.');
    }
    $stmt = db()->prepare('DELETE FROM users WHERE id = ?');
    $stmt->execute([$id]);
    log_activity($admin, 'user_delete', (string) $id);
    json_out(['ok' => true]);
}

fail('Method not allowed', 405);
