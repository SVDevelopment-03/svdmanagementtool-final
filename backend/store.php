<?php
// Key/value document store for the portal modules.
//   GET  /store.php?key=svops:projects&shared=1        -> { value }
//   GET  /store.php?keys=svops:projects,svops:team&shared=1 -> { values: { key: value|null } }
//   POST /store.php  { key, value, shared }            -> { ok }
//   POST /store.php  { entries: [{key,value,shared}] } -> { ok, saved, skipped }

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$user = require_user();
$method = $_SERVER['REQUEST_METHOD'];

function store_read(array $user, string $key, bool $shared): ?string
{
    if ($shared) {
        $stmt = db()->prepare('SELECT value FROM app_store WHERE store_key = ? AND user_id IS NULL LIMIT 1');
        $stmt->execute([$key]);
    } else {
        $stmt = db()->prepare('SELECT value FROM app_store WHERE store_key = ? AND user_id = ? LIMIT 1');
        $stmt->execute([$key, $user['id']]);
    }
    $row = $stmt->fetch();
    return $row ? (string) $row['value'] : null;
}

const STORE_MAX_BYTES = 4 * 1024 * 1024;      // 4 MB per key
const STORE_RAW_KEYS   = ['svops:theme'];      // plain strings, not JSON documents

// Returns null when the payload is acceptable, otherwise a human message.
function store_invalid(string $key, string $value): ?string
{
    if (!preg_match('/^svops:[A-Za-z][A-Za-z0-9_:-]{0,60}$/', $key)) {
        return 'Invalid storage key';
    }
    if (strlen($value) > STORE_MAX_BYTES) {
        return 'Payload too large (max 4 MB per module)';
    }
    if (in_array($key, STORE_RAW_KEYS, true)) {
        return null;
    }
    if ($value === '') {
        return 'Empty payload rejected';
    }
    json_decode($value);
    if (json_last_error() !== JSON_ERROR_NONE) {
        return 'Payload must be valid JSON (' . json_last_error_msg() . ')';
    }
    return null;
}

function store_updated_at(array $user, string $key, bool $shared): ?string
{
    if ($shared) {
        $stmt = db()->prepare('SELECT updated_at FROM app_store WHERE store_key = ? AND user_id IS NULL LIMIT 1');
        $stmt->execute([$key]);
    } else {
        $stmt = db()->prepare('SELECT updated_at FROM app_store WHERE store_key = ? AND user_id = ? LIMIT 1');
        $stmt->execute([$key, $user['id']]);
    }
    $row = $stmt->fetch();
    return $row ? (string) $row['updated_at'] : null;
}

function store_write(array $user, string $key, string $value, bool $shared): void
{
    // NOTE: MySQL unique indexes treat NULL as distinct, so shared rows (user_id IS NULL)
    // cannot rely on ON DUPLICATE KEY. Update-then-insert keeps exactly one shared row.
    if ($shared) {
        $upd = db()->prepare('UPDATE app_store SET value = ? WHERE store_key = ? AND user_id IS NULL');
        $upd->execute([$value, $key]);
        if ($upd->rowCount() === 0) {
            $exists = db()->prepare('SELECT id FROM app_store WHERE store_key = ? AND user_id IS NULL LIMIT 1');
            $exists->execute([$key]);
            if (!$exists->fetch()) {
                db()->prepare('INSERT INTO app_store (store_key, user_id, value) VALUES (?, NULL, ?)')
                    ->execute([$key, $value]);
            }
        }
        // Drop any duplicate shared rows created before this fix.
        db()->prepare(
            'DELETE FROM app_store WHERE store_key = ? AND user_id IS NULL
             AND id <> (SELECT id FROM (SELECT MIN(id) AS id FROM app_store WHERE store_key = ? AND user_id IS NULL) t)'
        )->execute([$key, $key]);
        log_activity($user, 'save', $key);
        return;
    }

    $sql = 'INSERT INTO app_store (store_key, user_id, value) VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE value = VALUES(value)';
    db()->prepare($sql)->execute([$key, $user['id'], $value]);
}


if ($method === 'GET') {
    $shared = ($_GET['shared'] ?? '0') === '1';

    $multi = trim((string) ($_GET['keys'] ?? ''));
    if ($multi !== '') {
        $values = [];
        foreach (array_slice(array_filter(array_map('trim', explode(',', $multi))), 0, 50) as $key) {
            if (!can_access_key($key, $user, false)) {
                continue; // silently omit restricted modules
            }
            $values[$key] = store_read($user, $key, $shared);
        }
        json_out(['values' => $values]);
    }

    $key = (string) ($_GET['key'] ?? '');
    if ($key === '') {
        fail('key is required');
    }
    assert_key_access($key, $user, false);
    json_out([
        'value'      => store_read($user, $key, $shared),
        'updated_at' => store_updated_at($user, $key, $shared),
    ]);
}

if ($method === 'POST') {
    $body = body_json();

    if (isset($body['entries']) && is_array($body['entries'])) {
        $saved = 0;
        $skipped = [];
        foreach (array_slice($body['entries'], 0, 100) as $entry) {
            $key = (string) ($entry['key'] ?? '');
            if ($key === '') {
                continue;
            }
            if (!can_access_key($key, $user, true)) {
                $skipped[] = $key;
                continue;
            }
            $value = (string) ($entry['value'] ?? '');
            if (store_invalid($key, $value) !== null) {
                $skipped[] = $key;
                continue;
            }
            store_write($user, $key, $value, !empty($entry['shared']));
            $saved++;
        }
        json_out(['ok' => true, 'saved' => $saved, 'skipped' => $skipped]);
    }

    $key = (string) ($body['key'] ?? '');
    $value = (string) ($body['value'] ?? '');
    $shared = !empty($body['shared']);
    if ($key === '') {
        fail('key is required');
    }
    assert_key_access($key, $user, true);
    if (($why = store_invalid($key, $value)) !== null) {
        fail($why, 422);
    }
    store_write($user, $key, $value, $shared);
    json_out(['ok' => true, 'updated_at' => store_updated_at($user, $key, $shared)]);
}

if ($method === 'DELETE') {
    $key = (string) ($_GET['key'] ?? '');
    if ($key === '') {
        fail('key is required');
    }
    assert_key_access($key, $user, true);
    $shared = ($_GET['shared'] ?? '0') === '1';
    if ($shared) {
        db()->prepare('DELETE FROM app_store WHERE store_key = ? AND user_id IS NULL')->execute([$key]);
    } else {
        db()->prepare('DELETE FROM app_store WHERE store_key = ? AND user_id = ?')->execute([$key, $user['id']]);
    }
    json_out(['ok' => true, 'deleted' => $key]);
}

fail('Method not allowed', 405);
