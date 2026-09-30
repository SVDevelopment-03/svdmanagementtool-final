<?php
// Public health / connectivity check used by the login screen "Test connection" button.
//   GET /health.php -> { ok, php, database: {...}, tables: {...}, uploads: {...} }

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$out = [
    'ok'      => false,
    'service' => 'SV Management Portal API',
    'php'     => PHP_VERSION,
    'time'    => date('c'),
];

// ---------- Database ----------
try {
    $pdo = db_quiet();
    if ($pdo === null) {
        throw new RuntimeException('Could not connect with the credentials in config.php');
    }
    $version = (string) $pdo->query('SELECT VERSION()')->fetchColumn();
    $out['database'] = ['connected' => true, 'name' => $CONFIG['db_name'], 'server' => $version];

    $required = ['users', 'sessions', 'app_store', 'files'];
    $present = [];
    foreach ($pdo->query('SHOW TABLES')->fetchAll(PDO::FETCH_COLUMN) as $t) {
        $present[] = (string) $t;
    }
    $missing = array_values(array_diff($required, $present));
    $out['tables'] = ['present' => array_values(array_intersect($required, $present)), 'missing' => $missing];

    if (!$missing) {
        $out['counts'] = [
            'users'     => (int) $pdo->query('SELECT COUNT(*) FROM users')->fetchColumn(),
            'records'   => (int) $pdo->query('SELECT COUNT(*) FROM app_store')->fetchColumn(),
            'files'     => (int) $pdo->query('SELECT COUNT(*) FROM files')->fetchColumn(),
        ];
    }
    $out['ok'] = empty($missing);
    if ($missing) {
        $out['error'] = 'Database reachable but tables are missing. Run install.php or import schema.sql.';
    }
} catch (Throwable $e) {
    $out['database'] = ['connected' => false];
    $out['error'] = 'Database connection failed. Check backend/config.php.';
}

// ---------- Uploads ----------
$dir = $CONFIG['upload_dir'];
if (!is_dir($dir)) {
    @mkdir($dir, 0755, true);
}
$out['uploads'] = [
    'writable'  => is_dir($dir) && is_writable($dir),
    'maxUpload' => (int) $CONFIG['max_upload'],
];

json_out($out, $out['ok'] ? 200 : 503);
