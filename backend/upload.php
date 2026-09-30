<?php
// File uploads (stored on your cPanel host).
//   POST   /upload.php        multipart: file, project_id  -> { file: {id,name,size,url,...} }
//   GET    /upload.php?id=..&download=1                    -> streams the file
//   GET    /upload.php?project_id=..                       -> { files: [...] }
//   DELETE /upload.php?id=..                               -> { ok }

declare(strict_types=1);
require __DIR__ . '/bootstrap.php';

$user = require_user();
$method = $_SERVER['REQUEST_METHOD'];

function api_base_url(): string
{
    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $path = rtrim(dirname($_SERVER['SCRIPT_NAME'] ?? '/'), '/');
    return $scheme . '://' . $host . $path;
}

function file_row_to_json(array $row): array
{
    return [
        'id'         => $row['id'],
        'name'       => $row['original_name'],
        'size'       => (int) $row['size_bytes'],
        'mime'       => $row['mime_type'],
        'projectId'  => $row['project_id'],
        'uploadedAt' => $row['created_at'],
        'url'        => api_base_url() . '/upload.php?id=' . rawurlencode($row['id']) . '&download=1',
    ];
}

if ($method === 'POST') {
    if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
        fail('No file received (or it exceeded the PHP upload limit).');
    }
    $file = $_FILES['file'];
    if ($file['size'] > (int) $CONFIG['max_upload']) {
        fail('File is larger than the configured limit.');
    }

    $original = basename((string) $file['name']);
    $ext = strtolower(pathinfo($original, PATHINFO_EXTENSION));
    if (!in_array($ext, $CONFIG['allowed_ext'], true)) {
        fail('File type .' . $ext . ' is not allowed.');
    }

    $dir = $CONFIG['upload_dir'];
    if (!is_dir($dir) && !mkdir($dir, 0755, true) && !is_dir($dir)) {
        fail('Upload directory could not be created.', 500);
    }

    $id = sprintf(
        '%s-%s-%s-%s-%s',
        bin2hex(random_bytes(4)), bin2hex(random_bytes(2)), bin2hex(random_bytes(2)),
        bin2hex(random_bytes(2)), bin2hex(random_bytes(6))
    );
    $stored = $id . '.' . $ext;
    if (!move_uploaded_file($file['tmp_name'], $dir . '/' . $stored)) {
        fail('Could not save the uploaded file.', 500);
    }

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = (string) ($finfo->file($dir . '/' . $stored) ?: 'application/octet-stream');

    $stmt = db()->prepare(
        'INSERT INTO files (id, project_id, original_name, stored_name, mime_type, size_bytes, uploaded_by)
         VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    $projectId = trim((string) ($_POST['project_id'] ?? ''));
    $stmt->execute([$id, $projectId !== '' ? $projectId : null, $original, $stored, $mime, (int) $file['size'], $user['id']]);

    $row = db()->prepare('SELECT * FROM files WHERE id = ?');
    $row->execute([$id]);
    json_out(['file' => file_row_to_json($row->fetch())]);
}

if ($method === 'GET') {
    $id = (string) ($_GET['id'] ?? '');
    if ($id !== '') {
        $stmt = db()->prepare('SELECT * FROM files WHERE id = ? LIMIT 1');
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        if (!$row) {
            fail('File not found', 404);
        }
        if (isset($_GET['download'])) {
            $path = $CONFIG['upload_dir'] . '/' . $row['stored_name'];
            if (!is_file($path)) {
                fail('File missing on disk', 404);
            }
            header_remove('Content-Type');
            header('Content-Type: ' . $row['mime_type']);
            header('Content-Length: ' . filesize($path));
            header('Content-Disposition: attachment; filename="' . addslashes($row['original_name']) . '"');
            readfile($path);
            exit;
        }
        json_out(['file' => file_row_to_json($row)]);
    }

    $projectId = (string) ($_GET['project_id'] ?? '');
    if ($projectId !== '') {
        $stmt = db()->prepare('SELECT * FROM files WHERE project_id = ? ORDER BY created_at DESC');
        $stmt->execute([$projectId]);
    } else {
        $stmt = db()->query('SELECT * FROM files ORDER BY created_at DESC LIMIT 200');
    }
    json_out(['files' => array_map('file_row_to_json', $stmt->fetchAll())]);
}

if ($method === 'DELETE') {
    $id = (string) ($_GET['id'] ?? '');
    if ($id === '') {
        fail('id is required');
    }
    $stmt = db()->prepare('SELECT * FROM files WHERE id = ? LIMIT 1');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    if (!$row) {
        json_out(['ok' => true]);
    }
    if ($user['role'] !== 'admin' && (int) $row['uploaded_by'] !== $user['id']) {
        fail('Forbidden — you can only delete your own uploads', 403);
    }
    @unlink($CONFIG['upload_dir'] . '/' . $row['stored_name']);
    $del = db()->prepare('DELETE FROM files WHERE id = ?');
    $del->execute([$id]);
    json_out(['ok' => true]);
}

fail('Method not allowed', 405);
