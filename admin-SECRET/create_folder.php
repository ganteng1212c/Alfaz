<?php
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['folderName']) || !isset($data['templatePath'])) {
        echo json_encode(['status' => 'error', 'message' => 'Missing required parameters']);
        exit;
    }

    $folderName = $data['folderName'];
    $templatePath = $data['templatePath'];
    $newFilePath = __DIR__ . '/html/' . $templatePath;

    // Create the template HTML content
    $templateContent = <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>{$folderName}</title>
    <link rel="stylesheet" href="../../admin-SECRET/css/admin-media.css">
    <link rel="icon" href="../../admin-SECRET/source/logo.png" type="image/png">
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
</head>
<body>
    <header>
        <div class="header-bar">
            <h1 class="title">{$folderName}</h1>
        </div>
    </header>
    <div class="gallery-container">
        <div class="media-grid">
            <!-- Media items will be added here -->
        </div>
    </div>

    <!-- Preview Modal -->
    <div class="preview-modal" id="previewModal">
        <div class="preview-content">
            <span class="close-btn" onclick="closePreview()">&times;</span>
            <div id="previewMedia"></div>
            <a id="downloadBtn" class="download-btn" target="_blank">
                <img src="https://img.icons8.com/?size=100&id=108635&format=png&color=000000" alt="Download Icon">
            </a>
        </div>
    </div>
    <button id="uploadButton" class="upload-btn">
        <img src="../../Source/upload.png" alt="Upload Icon" style="width: 30px; height: 30px;">
        Upload
    </button>
    <div class="modal" id="uploadModal">
        <h2>Upload Media</h2>
        <form id="uploadForm">
            <input type="file" id="mediaFile" accept="image/*,video/*" required>
            <button type="button" id="previewButton">Preview</button>
            <div id="previewSection"></div>
            <input type="text" id="mediaTitle" placeholder="Enter Title" required>
            <button type="submit">Submit</button>
        </form>
    </div>
    <script src="../../admin-SECRET/js/admin-media.js"></script>
</body>
</html>
HTML;

    try {
        if (file_put_contents($newFilePath, $templateContent)) {
            echo json_encode(['status' => 'success', 'message' => 'Folder created successfully', 'path' => $templatePath]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to create folder']);
        }
    } catch (Exception $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>
