const express = require('express');
const router = express.Router();
const storeData = require('../services/storeData');

// Fungsi untuk menambahkan mood baru
const addMood = async (req, res, mood) => {
    try {
        const createdAt = new Date().toISOString();
        const moodData = {
            mood,
            createdAt,
        };

        await storeData(null, moodData); // Tidak ada userId

        return res.status(201).json({
            status: 'success',
            message: `Mood '${mood}' is successfully added`,
            moodData
        });
    } catch (error) {
        console.error(`Error adding mood '${mood}' data:`, error);
        return res.status(500).json({
            status: 'fail',
            message: `Error adding mood '${mood}' data`
        });
    }
};

// Endpoint untuk menambah mood Happy
router.post('/create/happy', async (req, res) => {
    await addMood(req, res, 'Happy');
});

// Endpoint untuk menambah mood Sad
router.post('/create/sad', async (req, res) => {
    await addMood(req, res, 'Sad');
});

// Endpoint untuk menambah mood Natural
router.post('/create/natural', async (req, res) => {
    await addMood(req, res, 'Natural');
});

module.exports = router;
