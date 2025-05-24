<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if a file was uploaded
    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        $uploadDir = __DIR__ . '/Penyimpanan gambar video/';
        $fileName = basename($_FILES['file']['name']);
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