const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');
const multer = require('multer');
const path = require('path');
const serviceAccount = require('../firebase-adminsdk.json');
const verifyToken = require('../services/authMiddleware');


// Inisialisasi Firebase Admin SDK jika belum diinisialisasi
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://capstone-bangkit-424811-default-rtdb.asia-southeast1.firebasedatabase.app",
        storageBucket: "emoticare_bucket"
    });
}

const bucketName = "emoticare_bucket";
const bucket = admin.storage().bucket(bucketName);

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // max 5 mb
    }
});

const allowedFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];

router.use(verifyToken);

router.post('/upload', upload.single(), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                status: 'fail',
                message: 'No file uploaded'
            });
        }

        if (!allowedFileTypes.includes(req.file.mimetype)) {
            return res.status(400).json({
                status: 'fail',
                message: 'Invalid file type. Only JPEG, JPG, and PNG files are allowed.'
            });
        }

        const fileName = `${Date.now()}_${path.basename(req.file.originalname)}`;
        const file = bucket.file(fileName);

        const metadata = {
            metadata: {
                contentType: req.file.mimetype
            }
        };

        await file.save(req.file.buffer, metadata);

        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

        return res.status(200).json({
            status: 'success',
            message: 'File uploaded successfully',
            fileUrl: publicUrl,
            userId: req.user.uid
        });
    } catch (error) {
        console.error('Error uploading file:', error);
        return res.status(500).json({
            status: 'fail',
            message: 'Error uploading file'
        });
    }
});

module.exports = router;
