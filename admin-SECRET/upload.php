<?php
// Tambah session check untuk keamanan
session_start();
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized access']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if a file was uploaded
    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/Penyimpanan gambar video/';
        
        // Batasi ukuran file (20MB)
        $maxFileSize = 20 * 1024 * 1024; // 20MB dalam bytes
        if ($_FILES['file']['size'] > $maxFileSize) {
            echo json_encode(['status' => 'error', 'message' => 'Ukuran file terlalu besar (max 20MB)']);
            exit;
        }
        
        // Buat nama file yang aman
        $originalName = basename($_FILES['file']['name']);
        $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
        $fileName = date('Ymd_His') . '_' . uniqid() . '.' . $extension;
        $targetFilePath = $uploadDir . $fileName;

        // Validate file type (image or video)
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/avi', 'video/mov'];
        $fileType = mime_content_type($_FILES['file']['tmp_name']);

        if (in_array($fileType, $allowedTypes)) {
            // Move the uploaded file to the target directory
            if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFilePath)) {
                echo json_encode(['status' => 'success', 'message' => 'File uploaded successfully.', 'file' => $fileName]);
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to move the uploaded file.']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid file type.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No file uploaded or upload error.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}
?>