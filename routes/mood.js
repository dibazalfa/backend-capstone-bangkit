const express = require('express');
const router = express.Router();
const storeData = require('../services/storeData');
const updateMoodData = require('../services/updateMoodData'); 

// Fungsi untuk menambahkan mood baru
const addMood = async (req, res, mood) => {
    try {
        const userId = req.body.userId; // Ambil userId dari body request
        if (!userId) {
            return res.status(400).json({
                status: 'fail',
                message: 'User ID is required'
            });
        }

        const createdAt = new Date().toISOString();
        const moodData = {
            mood,
            createdAt,
        };

        await storeData(userId, moodData); // Tidak ada userId

        return res.status(201).json({
            status: 'success',
            message: `Mood '${mood}' is successfully added`,
            moodData
        });
    } catch (error) {
        console.error(`Error adding mood '${mood}' data:`, error);
        return res.status(500).json({
            status: 'fail',
            message: error.message // Menampilkan pesan error lebih rinci
        });
    }
};

// Fungsi untuk memperbarui mood
const updateMood = async (req, res) => {
    const { id } = req.params;
    const { mood } = req.body;

    if (!mood) {
        return res.status(400).json({
            status: 'fail',
            message: 'Mood is required'
        });
    }

    try {
        const updatedAt = new Date().toISOString();
        const moodData = {
            mood,
            updatedAt,
        };

        await updateMoodData(id, moodData);

        return res.status(200).json({
            status: 'success',
            message: `Mood '${mood}' is successfully updated`,
            moodData
        });
    } catch (error) {
        console.error(`Error updating mood data for id '${id}':`, error);
        return res.status(500).json({
            status: 'fail',
            message: `Error updating mood data for id '${id}'`,
            error: error.message
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

// Endpoint untuk memperbarui mood berdasarkan ID
router.put('/update/:id', async (req, res) => {
    await updateMood(req, res);
});

module.exports = router;
