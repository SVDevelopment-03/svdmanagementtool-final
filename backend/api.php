<?php
// REST API for every portal module (records live in the shared app_store document).
//   GET    /api.php                               -> { modules: { name: count } }
//   GET    /api.php?module=projects               -> { items: [...] }   (&q=search)
//   GET    /api.php?module=projects&id=ID         -> { item }
//   POST   /api.php?module=projects   {record}    -> { item }  (201)
//   PUT    /api.php?module=projects&id=ID {patch} -> { item }
//   DELETE /api.php?module=projects&id=ID         -> { ok }
// Modules: team, projects, commercials, revenue, pipeline, portfolio,
//          marketing, maintenance, credentials

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$user = require_user();
$method = $_SERVER['REQUEST_METHOD'];

const API_MODULES = ['team','projects','commercials','revenue','pipeline','portfolio','marketing','maintenance','credentials'];

function mod_load(string $key): array
{
    $stmt = db()->prepare('SELECT value FROM app_store WHERE store_key = ? AND user_id IS NULL LIMIT 1');
    $stmt->execute([$key]);
    $row = $stmt->fetch();
    $data = $row ? json_decode((string) $row['value'], true) : [];
    return is_array($data) ? array_values($data) : [];
}

function mod_save(string $key, array $items): void
{
    $value = json_encode(array_values($items), JSON_UNESCAPED_UNICODE);
    $upd = db()->prepare('UPDATE app_store SET value = ? WHERE store_key = ? AND user_id IS NULL');
    $upd->execute([$value, $key]);
    $chk = db()->prepare('SELECT id FROM app_store WHERE store_key = ? AND user_id IS NULL LIMIT 1');
    $chk->execute([$key]);
    if (!$chk->fetch()) {
        db()->prepare('INSERT INTO app_store (store_key, user_id, value) VALUES (?, NULL, ?)')->execute([$key, $value]);
    }
}

function find_index(array $items, string $id): int
{
    foreach ($items as $i => $it) {
        if (is_array($it) && isset($it['id']) && (string) $it['id'] === $id) {
            return $i;
        }
    }
    return -1;
}

$module = (string) ($_GET['module'] ?? '');

if ($module === '') {
    if ($method !== 'GET') {
        fail('module is required');
    }
    $out = [];
    foreach (API_MODULES as $m) {
        if (can_access_key('svops:' . $m, $user, false)) {
            $out[$m] = count(mod_load('svops:' . $m));
        }
    }
    json_out(['modules' => $out]);
}

if (!in_array($module, API_MODULES, true)) {
    fail('Unknown module', 404);
}
$key = 'svops:' . $module;
$id = (string) ($_GET['id'] ?? '');
assert_key_access($key, $user, $method !== 'GET');
$items = mod_load($key);

if ($method === 'GET') {
    if ($id !== '') {
        $i = find_index($items, $id);
        if ($i < 0) fail('Record not found', 404);
        json_out(['item' => $items[$i]]);
    }
    $q = strtolower(trim((string) ($_GET['q'] ?? '')));
    if ($q !== '') {
        $items = array_values(array_filter($items, fn($it) => str_contains(strtolower(json_encode($it)), $q)));
    }
    json_out(['items' => $items, 'total' => count($items)]);
}

if ($method === 'POST') {
    $rec = body_json();
    if (!$rec) fail('Record body is required');
    if (empty($rec['id'])) {
        $rec['id'] = substr($module, 0, 3) . '-' . bin2hex(random_bytes(5));
    }
    if (find_index($items, (string) $rec['id']) >= 0) fail('A record with that id already exists', 409);
    $rec['createdAt'] = $rec['createdAt'] ?? date('c');
    $items[] = $rec;
    mod_save($key, $items);
    log_activity($user, 'create', $key, (string) $rec['id']);
    json_out(['item' => $rec], 201);
}

if ($method === 'PUT' || $method === 'PATCH') {
    if ($id === '') fail('id is required');
    $i = find_index($items, $id);
    if ($i < 0) fail('Record not found', 404);
    $patch = body_json();
    unset($patch['id']);
    $items[$i] = array_merge($items[$i], $patch, ['updatedAt' => date('c')]);
    mod_save($key, $items);
    log_activity($user, 'update', $key, $id);
    json_out(['item' => $items[$i]]);
}

if ($method === 'DELETE') {
    if ($id === '') fail('id is required');
    $i = find_index($items, $id);
    if ($i < 0) fail('Record not found', 404);
    array_splice($items, $i, 1);
    mod_save($key, $items);
    log_activity($user, 'delete', $key, $id);
    json_out(['ok' => true]);
}

fail('Method not allowed', 405);
