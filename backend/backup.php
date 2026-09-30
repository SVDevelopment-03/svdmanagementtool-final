<?php
// Admin-only full backup of every shared module.
//   GET  /backup.php                    -> { version, exported_at, data: { key: parsedJson } }
//   POST /backup.php { data: {...} }    -> { ok, restored }
declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$admin = require_admin();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $rows = db()->query("SELECT store_key, value FROM app_store WHERE user_id IS NULL AND store_key LIKE 'svops:%'")->fetchAll();
    $data = [];
    foreach ($rows as $r) {
        $data[$r['store_key']] = json_decode((string) $r['value'], true);
    }
    log_activity($admin, 'backup_export', '', count($data) . ' modules');
    json_out(['version' => 1, 'exported_at' => date('c'), 'data' => $data]);
}

if ($method === 'POST') {
    $body = body_json();
    $data = $body['data'] ?? null;
    if (!is_array($data) || !$data) fail('Backup file has no data.');
    $restored = 0;
    $pdo = db();
    $pdo->beginTransaction();
    try {
        foreach ($data as $key => $value) {
            if (!is_string($key) || !preg_match('/^svops:[A-Za-z0-9_]{1,60}$/', $key)) continue;
            $json = json_encode($value, JSON_UNESCAPED_UNICODE);
            $pdo->prepare('DELETE FROM app_store WHERE store_key = ? AND user_id IS NULL')->execute([$key]);
            $pdo->prepare('INSERT INTO app_store (store_key, user_id, value) VALUES (?, NULL, ?)')->execute([$key, $json]);
            $restored++;
        }
        $pdo->commit();
    } catch (Throwable $e) {
        $pdo->rollBack();
        fail('Restore failed: ' . $e->getMessage(), 500);
    }
    log_activity($admin, 'backup_restore', '', $restored . ' modules');
    json_out(['ok' => true, 'restored' => $restored]);
}

fail('Method not allowed', 405);
