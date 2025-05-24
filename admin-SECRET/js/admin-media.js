function openPreview(type, src) {
  const modal = document.getElementById("previewModal");
  const previewMedia = document.getElementById("previewMedia");
  const downloadBtn = document.getElementById("downloadBtn");

  // Clear previous content
  previewMedia.innerHTML = "";

  // Create media element
  if (type === "photo") {
      const img = document.createElement("img");
      img.src = src;
      img.alt = "Preview Image";
      previewMedia.appendChild(img);
      downloadBtn.href = src;
      downloadBtn.download = "photo.jpg";
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