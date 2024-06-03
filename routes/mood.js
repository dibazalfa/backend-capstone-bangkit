const express = require('express');
const router = express.Router();
const storeData = require('../services/storeData');
const updateMood = require('../services/updateMood');
const verifyToken = require('../services/authMiddleware');

// Middleware verifyToken digunakan untuk semua endpoint mood
router.use(verifyToken);

// Fungsi untuk menambahkan mood baru
const addMood = async (req, res, mood) => {
    try {
        const createdAt = new Date().toISOString();
        const moodData = {
            mood,
            createdAt,
            userId: req.user.uid,
        };

        await storeData(req.user.uid, moodData);

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

// Endpoint untuk memperbarui mood
router.put('/update/:mood', async (req, res) => {
    try {
        const mood = req.params.mood; // Dapatkan mood dari parameter rute
        const updatedMoodData = await updateMood(req.user.uid, mood);

        return res.status(200).json({
            status: 'success',
            message: `Mood is successfully updated to '${mood}'`,
            updatedMoodData
        });
    } catch (error) {
        console.error(`Error updating mood data:`, error);
        return res.status(500).json({
            status: 'fail',
            message: `Error updating mood data`
        });
    }
});

module.exports = router;
