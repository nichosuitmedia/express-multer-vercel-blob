// Load environment variables
require('dotenv').config();

const express = require('express');
const multer = require('multer');
const { uploadBlob, listBlobs } = require('@vercel/blob'); // Import the necessary functions from the SDK

const app = express();
const PORT = process.env.PORT || 3000;

// Configure Multer for handling file uploads
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route for uploading files to Vercel Blob
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Upload the file to Vercel Blob
        const blobResult = await uploadBlob({
            data: file.buffer, // Use the file buffer from multer
            contentType: file.mimetype,
            access: 'public', // Set access to 'public' for URL accessibility
        });

        res.json({
            message: 'File uploaded successfully!',
            blobUrl: blobResult.url, // URL to access the uploaded file
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'File upload failed', error });
    }
});

// Route to list all files stored in Vercel Blob
app.get('/files', async (req, res) => {
    try {
        const files = await listBlobs(); // List all blobs
        res.json(files);
    } catch (error) {
        console.error('List files error:', error);
        res.status(500).json({ message: 'Failed to list files', error });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
