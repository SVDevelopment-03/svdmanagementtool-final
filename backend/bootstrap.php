<?php
// Shared bootstrap: config, DB connection, CORS, JSON helpers, auth.

declare(strict_types=1);

$CONFIG = require __DIR__ . '/config.php';

// ---------- CORS ----------
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = $CONFIG['allowed_origins'];
if (in_array('*', $allowed, true)) {
    header('Access-Control-Allow-Origin: ' . ($origin !== '' ? $origin : '*'));
} elseif ($origin !== '' && in_array($origin, $allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
}
header('Vary: Origin');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json; charset=utf-8');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(204);
    exit;
}

// ---------- Helpers ----------
function json_out($data, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function fail(string $message, int $status = 400): void
{
    json_out(['error' => $message], $status);
}

function body_json(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') {
        return [];
    }
    $data = json_decode($raw, true);
    return is_array($data) ? $data : [];
}

// ---------- Database ----------
function db_dsn(): string
{
    global $CONFIG;
    $dsn = sprintf('mysql:host=%s;dbname=%s;charset=utf8mb4', $CONFIG['db_host'], $CONFIG['db_name']);
    if (!empty($CONFIG['db_port'])) {
        $dsn = sprintf(
            'mysql:host=%s;port=%d;dbname=%s;charset=utf8mb4',
            $CONFIG['db_host'],
            (int) $CONFIG['db_port'],
            $CONFIG['db_name']
        );
    }
    if (!empty($CONFIG['db_socket'])) {
        $dsn = sprintf('mysql:unix_socket=%s;dbname=%s;charset=utf8mb4', $CONFIG['db_socket'], $CONFIG['db_name']);
    }
    return $dsn;
}

// Connects and returns null on failure (used by health.php) instead of aborting.
function db_quiet(): ?PDO
{
    global $CONFIG;
    try {
        return new PDO(db_dsn(), $CONFIG['db_user'], $CONFIG['db_pass'], [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    } catch (PDOException $e) {
        return null;
    }
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo === null) {
        $pdo = db_quiet();
        if ($pdo === null) {
            fail('Database connection failed. Check backend/config.php.', 500);
        }
    }
    return $pdo;
}


// ---------- Auth ----------
function bearer_token(): ?string
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if ($header === '' && function_exists('apache_request_headers')) {
        $headers = apache_request_headers();
        $header = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }
    if (preg_match('/Bearer\s+(.+)/i', (string) $header, $m)) {
        return trim($m[1]);
    }
    // Download links opened in a new tab cannot send headers — allow ?token=.
    if (!empty($_GET['token']) && is_string($_GET['token'])) {
        return trim($_GET['token']);
    }
    return null;
}

function current_user(): ?array
{
    static $cached = false;
    static $user = null;
    if ($cached) {
        return $user;
    }
    $cached = true;

    $token = bearer_token();
    if (!$token) {
        return null;
    }
    $hash = hash('sha256', $token);
    $stmt = db()->prepare(
        'SELECT u.id, u.name, u.email, u.role
         FROM sessions s JOIN users u ON u.id = s.user_id
         WHERE s.token_hash = ? AND s.expires_at > NOW() LIMIT 1'
    );
    $stmt->execute([$hash]);
    $row = $stmt->fetch();
    $user = $row ?: null;
    if ($user) {
        $user['id'] = (int) $user['id'];
    }
    return $user;
}

function require_user(): array
{
    $user = current_user();
    if (!$user) {
        fail('Unauthorized', 401);
    }
    return $user;
}

function require_admin(): array
{
    $user = require_user();
    if ($user['role'] !== 'admin') {
        fail('Forbidden — admin only', 403);
    }
    return $user;
}

// Keys only admins may read or write.
const ADMIN_ONLY_KEYS = ['svops:commercials', 'svops:revenue', 'svops:revenueTargets'];

function can_access_key(string $key, array $user, bool $writing): bool
{
    if (in_array($key, ADMIN_ONLY_KEYS, true) && $user['role'] !== 'admin') {
        return false;
    }
    if ($writing && $user['role'] !== 'admin' && $key === 'svops:team') {
        return false;
    }
    return true;
}

function assert_key_access(string $key, array $user, bool $writing): void
{
    if (in_array($key, ADMIN_ONLY_KEYS, true) && $user['role'] !== 'admin') {
        fail('Forbidden — this module is restricted to admins', 403);
    }
    if ($writing && $user['role'] !== 'admin' && $key === 'svops:team') {
        fail('Forbidden — only admins can edit the team directory', 403);
    }
}


// ---------- Activity log (never breaks the request if the table is missing) ----------
function client_ip(): string
{
    return substr((string) ($_SERVER['REMOTE_ADDR'] ?? ''), 0, 64);
}

function log_activity(?array $user, string $action, string $target = '', string $detail = ''): void
{
    try {
        db()->prepare('INSERT INTO activity_log (user_id, user_name, action, target, detail, ip) VALUES (?, ?, ?, ?, ?, ?)')
            ->execute([
                $user['id'] ?? null,
                $user['name'] ?? null,
                substr($action, 0, 40),
                substr($target, 0, 190),
                substr($detail, 0, 500),
                client_ip(),
            ]);
    } catch (Throwable $e) {
        // table not installed yet — ignore
    }
}
