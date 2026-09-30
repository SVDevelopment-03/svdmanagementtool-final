<?php
// One-time installer: creates tables and the first admin account.
// Visit https://yourdomain.com/portal-api/install.php in a browser, then DELETE this file.

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$existing = db()->query("SHOW TABLES LIKE 'users'")->fetch();

$sql = file_get_contents(__DIR__ . '/schema.sql');
// Strip the seed INSERT — the admin is created below with a real bcrypt hash.
$sql = preg_replace('/INSERT INTO users.*?;/s', '', (string) $sql);

foreach (array_filter(array_map('trim', explode(';', (string) $sql))) as $statement) {
    if ($statement === '' || str_starts_with($statement, '--')) {
        continue;
    }
    db()->exec($statement);
}

$count = (int) db()->query('SELECT COUNT(*) AS c FROM users')->fetch()['c'];
$created = null;

if ($count === 0) {
    $email = 'admin@svdigital.ae';
    $password = 'ChangeMe123!';
    $stmt = db()->prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)');
    $stmt->execute(['SV Admin', $email, password_hash($password, PASSWORD_BCRYPT), 'admin']);
    $created = ['email' => $email, 'password' => $password];
}

$dir = $CONFIG['upload_dir'];
if (!is_dir($dir)) {
    @mkdir($dir, 0755, true);
}

json_out([
    'ok'            => true,
    'tables_ready'  => true,
    'had_tables'    => (bool) $existing,
    'admin_created' => $created,
    'uploads_dir'   => is_dir($dir) ? 'ready' : 'could not create — create it manually',
    'next_step'     => 'Delete install.php, then sign in from the portal.',
]);
