<?php
// SV Management Portal — backend configuration
// Edit these values in cPanel after uploading.
//TODO: change db_user and db_pass to a non-root user with only the necessary privileges
return [
    // MySQL (cPanel → MySQL Databases)
    'db_host'     => 'localhost',
    'db_port'     => null,   // leave null for the default 3306
    'db_socket'   => null,   // optional unix socket path (overrides host/port)
    'db_name'     => 'cpaneluser_svportal',
    'db_user'     => 'root',
    'db_pass'     => '',


    // Absolute or relative path where uploaded files are stored.
    // Keep this OUTSIDE public_html if possible; files are streamed via upload.php.
    'upload_dir'  => __DIR__ . '/uploads',

    // Max upload size in bytes (default 25 MB)
    'max_upload'  => 25 * 1024 * 1024,

    'allowed_ext' => ['pdf','doc','docx','xls','xlsx','ppt','pptx','csv','txt','zip','rar','png','jpg','jpeg','gif','webp','svg','ai','psd','fig','mp4','mov'],

    // Origins allowed to call this API (your Lovable app + desktop app).
    // Use ['*'] while testing.
    'allowed_origins' => ['*'],

    // Session lifetime in seconds (default 12 hours)
    'session_ttl' => 12 * 60 * 60,
];
