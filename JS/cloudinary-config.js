// Cloudinary configuration
const cloudinaryConfig = {
    cloudName: 'dr3uip0uu',
    apiKey: '168467257562997',
    apiSecret: 'YY5wFsU4AXWxooOgvUsTqsAB13g',
    uploadPreset: 'alfaz_team_media', // Preset untuk upload tanpa autentikasi
    folder: 'alfaz-team-media' // Folder untuk menyimpan media
};

// Upload function
async function uploadFile(file) {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', cloudinaryConfig.uploadPreset);
        formData.append('folder', cloudinaryConfig.folder);
        
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/auto/upload`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message);
        }

        return {
            url: data.secure_url,
            publicId: data.public_id,
            format: data.format
        };
    } catch (error) {
        console.error('Upload error:', error);
        throw error;
    }
}

// Delete function
async function deleteFile(publicId) {
    try {
        const timestamp = new Date().getTime();
        const signature = await generateSignature(publicId, timestamp);
        
        const formData = new FormData();
        formData.append('public_id', publicId);
        formData.append('signature', signature);
        formData.append('api_key', 'YOUR_API_KEY');
        formData.append('timestamp', timestamp);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/destroy`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();
        if (data.error) {
            throw new Error(data.error.message);
        }

        return data.result === 'ok';
    } catch (error) {
        console.error('Delete error:', error);
        throw error;
    }
}

// Generate signature for secure operations
async function generateSignature(publicId, timestamp) {
    const str = `public_id=${publicId}&timestamp=${timestamp}${cloudinaryConfig.apiSecret}`;
    
    // Generate SHA-1 hash
    const msgBuffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    
    return hashHex;
}

// Validate file
function validateFile(file) {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4', 'video/avi', 'video/mov'];
    const maxSize = 20 * 1024 * 1024; // 20MB

    if (!validTypes.includes(file.type)) {
        throw new Error('Invalid file type. Please upload JPEG, PNG, GIF, MP4, AVI or MOV files.');
    }

    if (file.size > maxSize) {
        throw new Error('File too large. Maximum size is 20MB.');
    }

    return true;
}

// Get media list
async function getMediaList() {
    try {
        const timestamp = new Date().getTime();
        const signature = await generateSignature('', timestamp);
        
        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/resources/image/upload?prefix=${cloudinaryConfig.folder}/`, {
            headers: {
                'Authorization': `Basic ${btoa(cloudinaryConfig.apiKey + ':' + cloudinaryConfig.apiSecret)}`
            }
        });

        const data = await response.json();
        return data.resources;
    } catch (error) {
        console.error('Error getting media list:', error);
        throw error;
    }
}

export {
    uploadFile,
    deleteFile,
    validateFile,
    cloudinaryConfig,
    getMediaList
};
