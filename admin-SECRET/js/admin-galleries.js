function navigateToFolder(folderUrl) {
    window.location.href = folderUrl;
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("admin-galleries.js loaded successfully");

    const addFolderButton = document.getElementById("addFolderButton");
    const folderPopup = document.getElementById("folderPopup");
    const folderNameInput = document.getElementById("folderNameInput");
    const confirmFolderButton = document.getElementById("confirmFolderButton");
    const cancelFolderButton = document.getElementById("cancelFolderButton");

    console.log("Checking folderPopup element:", folderPopup);

    addFolderButton.addEventListener("click", () => {
        console.log("Add Folder button clicked");
        if (folderPopup) {
            folderPopup.classList.remove("hidden");
            console.log("Popup displayed");
        } else {
            console.error("folderPopup element not found");
        }
    });    confirmFolderButton.addEventListener("click", async () => {
        console.log("Confirm Folder button clicked");
        const folderName = folderNameInput.value.trim();
        if (folderName) {
            console.log(`Folder name entered: ${folderName}`);
            const galleryContainer = document.querySelector(".gallery-container .folders");
            
            // Create new folder HTML
            const newFolder = document.createElement("div");
            newFolder.className = "folder";
            const folderPath = `admin-media-${Date.now()}.html`; // Generate unique file name
            newFolder.onclick = () => navigateToFolder(folderPath);            newFolder.innerHTML = `
                <div class='folder-image' style='background-color: #ff0000;'></div>
                <div class='folder-content'>
                    <p>${folderName}</p>
                </div>
            `;

            // Create the folder file on the server
            try {
                const response = await fetch('../../admin-SECRET/create_folder.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        folderName: folderName,
                        templatePath: folderPath
                    })
                });

                const result = await response.json();
                if (result.status === 'success') {
                    galleryContainer.appendChild(newFolder);
                    folderPopup.classList.add("hidden");
                    folderNameInput.value = "";
                    alert('Folder berhasil dibuat!');
                } else {
                    alert('Gagal membuat folder: ' + result.message);
                }
            } catch (error) {
                console.error('Error creating folder:', error);
                alert('Terjadi kesalahan saat membuat folder');
            }
        } else {
            console.log("Folder name is empty");
            alert("Nama folder tidak boleh kosong.");
        }
    });

    cancelFolderButton.addEventListener("click", () => {
        folderPopup.classList.add("hidden");
        folderNameInput.value = "";
    });
});