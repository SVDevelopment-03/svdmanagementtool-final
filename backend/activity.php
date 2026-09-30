<?php
// Admin-only audit trail.
//   GET  /activity.php?limit=200 -> { items: [...] }
//   POST /activity.php           -> { ok: true }
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$user = require_admin();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = body_json();
    $action = trim((string) ($body['action'] ?? ''));
    $target = trim((string) ($body['target'] ?? ''));
    $detail = trim((string) ($body['detail'] ?? ''));
    if ($action === '') {
        fail('Action is required.', 400);
    }
    try {
        $stmt = db()->prepare('INSERT INTO activity_log (user_id, user_name, action, target, detail, ip) VALUES (?, ?, ?, ?, ?, ?)');
        $stmt->execute([
            $user['id'] ?? null,
            $user['name'] ?? null,
            substr($action, 0, 40),
            substr($target, 0, 190),
            substr($detail, 0, 500),
            client_ip(),
        ]);
    } catch (Throwable $e) {
        fail('Activity log table missing — re-run install.php or import schema.sql.', 500);
    }
    json_out(['ok' => true], 201);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') fail('Method not allowed', 405);
$limit = max(1, min(1000, (int) ($_GET['limit'] ?? 200)));
try {
    $rows = db()->query("SELECT id, user_name, action, target, detail, ip, created_at FROM activity_log ORDER BY id DESC LIMIT $limit")->fetchAll();
} catch (Throwable $e) {
    fail('Activity log table missing — re-run install.php or import schema.sql.', 500);
}
json_out(['items' => $rows]);
