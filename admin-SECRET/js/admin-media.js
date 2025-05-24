// Initialize variables
let mediaGrid;
let isSelectMode = false;
let selectedFiles = new Set();

document.addEventListener('DOMContentLoaded', async () => {
    mediaGrid = document.querySelector('.media-grid');
    const selectBtn = document.getElementById('selectBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    const loadingOverlay = document.getElementById('loadingOverlay');

    // Upload button click handler
    uploadBtn.addEventListener('click', () => fileInput.click());
    
    // File input change handler
    fileInput.addEventListener('change', async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        loadingOverlay.style.display = 'flex';
        
        try {
            for (const file of files) {
                try {
                    // Validate file
                    validateFile(file);
                    
                    // Upload to Cloudinary
                    const result = await uploadFile(file);
                    console.log('File uploaded:', result.url);

                    // Add to media grid
                    addMediaToGrid({
                        url: result.url,
                        publicId: result.publicId,
                        type: file.type.startsWith('image/') ? 'photo' : 'video'
                    });
                } catch (error) {
                    console.error('Error uploading file:', error);
                    alert(`Error uploading ${file.name}: ${error.message}`);
                }
            }
        } finally {
            loadingOverlay.style.display = 'none';
            fileInput.value = ''; // Reset file input
        }
    });

    selectBtn.addEventListener('click', toggleSelectMode);
    deleteBtn.addEventListener('click', deleteSelectedFiles);

    await loadMediaFiles();
});

function openPreview(type, src, fileName) {
    const modal = document.getElementById("previewModal");
    const previewMedia = document.getElementById("previewMedia");
    const downloadBtn = document.getElementById("downloadBtn");
    const deleteBtn = document.getElementById("deleteBtn");

    // Clear previous content
    previewMedia.innerHTML = "";

    // Create media element
    if (type === "photo") {
        const img = document.createElement("img");
        img.src = src;
        img.alt = "Preview Image";
        previewMedia.appendChild(img);
    } else if (type === "video") {
        const video = document.createElement("video");
        video.src = src;
        video.controls = true;
        video.autoplay = true;
      previewMedia.appendChild(video);
      downloadBtn.href = src;
      downloadBtn.download = "video.mp4";
  }

  // Show modal
  modal.classList.add("active");
}

function closePreview() {
  const modal = document.getElementById("previewModal");
  modal.classList.remove("active");
}

document.addEventListener("DOMContentLoaded", () => {
    const uploadButton = document.getElementById("uploadButton");
    const uploadModal = document.getElementById("uploadModal");
    const previewButton = document.getElementById("previewButton");
    const previewSection = document.getElementById("previewSection");
    const mediaFile = document.getElementById("mediaFile");

    uploadButton.addEventListener("click", () => {
        uploadModal.style.display = "block";
    });

    previewButton.addEventListener("click", () => {
        const file = mediaFile.files[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            previewSection.innerHTML = file.type.startsWith("image")
                ? `<img src="${fileURL}" alt="Preview" style="max-width: 100%; max-height: 200px;">`
                : `<video src="${fileURL}" controls style="max-width: 100%; max-height: 200px;"></video>`;
        } else {
            alert("Please select a file to preview.");
        }
    });    document.getElementById("uploadForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const fileInput = document.getElementById("mediaFile");
        const titleInput = document.getElementById("mediaTitle");

        if (fileInput.files.length === 0) {
            alert("Silakan pilih file untuk diupload.");
            return;
        }

        // Validate file type
        const file = fileInput.files[0];
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/avi', 'video/mov'];
        if (!allowedTypes.includes(file.type)) {
            alert("Tipe file tidak didukung. Silakan upload gambar (JPG, PNG, GIF) atau video (MP4, AVI, MOV).");
            return;
        }

        formData.append("file", file);
        formData.append("title", titleInput.value || file.name);

        try {
            const response = await fetch("../../admin-SECRET/upload.php", {
                method: "POST",
                body: formData,
            });

            const result = await response.json();
            if (result.status === "success") {
                alert("File uploaded successfully!");
                addMediaToGallery(result.file, fileInput.files[0].type);
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            alert("An error occurred while uploading the file.");
        }
    });
});

function addMediaToGallery(fileName, fileType) {
    const mediaGrid = document.querySelector(".media-grid");
    const mediaItem = document.createElement("div");
    mediaItem.className = "media-item";

    const filePath = `../../admin-SECRET/Penyimpanan gambar video/${fileName}`;
    if (fileType.startsWith("image")) {
        mediaItem.innerHTML = `
            <div class="media-item" onclick="openPreview('photo', '${filePath}')">
                <img src="${filePath}" alt="${fileName}">
                <p>${fileName}</p>
            </div>
        `;
    } else if (fileType.startsWith("video")) {
        mediaItem.innerHTML = `
            <div class="media-item" onclick="openPreview('video', '${filePath}')">
                <video src="${filePath}" muted></video>
                <p>${fileName}</p>
            </div>
        `;
    }

    mediaGrid.appendChild(mediaItem);
}

// Toggle select mode
function toggleSelectMode() {
    isSelectMode = !isSelectMode;
    const selectBtn = document.getElementById('selectBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const mediaItems = document.querySelectorAll('.media-item');

    if (isSelectMode) {
        selectBtn.textContent = 'Cancel';
        deleteBtn.style.display = 'block';
        mediaItems.forEach(item => {
            item.classList.add('selectable');
            item.onclick = (e) => handleItemClick(e, item);
        });
    } else {
        selectBtn.textContent = 'Select Files';
        deleteBtn.style.display = 'none';
        selectedFiles.clear();
        mediaItems.forEach(item => {
            item.classList.remove('selectable', 'selected');
            item.onclick = (e) => handlePreview(e, item);
        });
    }
}

// Handle item click (for selection)
function handleItemClick(e, item) {
    e.preventDefault();
    e.stopPropagation();

    const checkbox = item.querySelector('.media-checkbox');
    if (checkbox.checked) {
        checkbox.checked = false;
        item.classList.remove('selected');
        selectedFiles.delete(item.dataset.filename);
    } else {
        checkbox.checked = true;
        item.classList.add('selected');
        selectedFiles.add(item.dataset.filename);
    }

    const deleteBtn = document.getElementById('deleteBtn');
    deleteBtn.textContent = `Delete Selected (${selectedFiles.size})`;
}

// Handle preview (when not in select mode)
function handlePreview(e, item) {
    if (!isSelectMode) {
        const type = item.dataset.type;
        const src = item.dataset.src;
        openPreview(type, src);
    }
}

// Delete selected files
async function deleteSelectedFiles() {
    if (selectedFiles.size === 0) return;

    const confirmation = confirm(`Are you sure you want to delete ${selectedFiles.size} file(s)?`);
    if (!confirmation) return;

    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = 'flex';

    try {
        const deletePromises = Array.from(selectedFiles).map(async (publicId) => {
            await deleteFile(publicId);
            const item = document.querySelector(`[data-public-id="${publicId}"]`);
            if (item) {
                item.remove();
            }
        });

        await Promise.all(deletePromises);
        alert('Files deleted successfully');
        selectedFiles.clear();
        toggleSelectMode();
    } catch (error) {
        console.error('Error deleting files:', error);
        alert('Error deleting files. Please try again.');
    } finally {
        loadingOverlay.style.display = 'none';
    }
}

// Load media files
async function loadMediaFiles() {
    try {
        const files = await getMediaFiles();
        mediaGrid.innerHTML = ''; // Clear existing items

        files.sort((a, b) => b.timestamp - a.timestamp) // Sort by newest first
             .forEach(file => {
                const isVideo = file.name.match(/\.(mp4|avi|mov)$/i);
                const mediaItem = document.createElement('div');
                mediaItem.className = 'media-item';
                mediaItem.dataset.filename = file.name;
                mediaItem.dataset.src = file.url;
                mediaItem.dataset.type = isVideo ? 'video' : 'photo';

                // Add checkbox for selection
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.className = 'media-checkbox';
                mediaItem.appendChild(checkbox);

                // Add preview thumbnail
                if (isVideo) {
                    const video = document.createElement('video');
                    video.src = file.url;
                    video.muted = true;
                    mediaItem.appendChild(video);
                } else {
                    const img = document.createElement('img');
                    img.src = file.url;
                    img.alt = file.name;
                    mediaItem.appendChild(img);
                }

                // Add filename
                const filename = document.createElement('p');
                filename.textContent = file.name.split('_').pop(); // Show only original filename
                mediaItem.appendChild(filename);

                mediaGrid.appendChild(mediaItem);
             });
    } catch (error) {
        console.error('Error loading media files:', error);
        alert('Error loading media files. Please refresh the page.');
    }
}