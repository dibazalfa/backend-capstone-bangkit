const express = require('express');
const router = express.Router();
const { db, storeData } = require('../services/storeData');
const updateMood = require('../services/updateMood');
const verifyToken = require('../services/authMiddleware');
const checkMoodToday = require('../services/checkMoodToday');
const getMoodToday = require('../services/getMoodToday');

router.use(express.json());
// Middleware verifyToken digunakan untuk semua endpoint mood
router.use(verifyToken);

// Fungsi untuk menambahkan mood baru
const addMood = async (req, res, mood) => {
    try {
        const hasMoodToday = await checkMoodToday(req.user.uid);

        if (hasMoodToday) {
            return res.status(400).json({
                status: 'fail',
                message: 'You have already added a mood today. You can only add one mood per day.'
            });
        }

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
        
        // Memeriksa apakah mood yang diterima valid
        if (!['happy', 'sad', 'natural'].includes(mood)) {
            return res.status(400).json({
                status: 'fail',
                message: `Invalid mood '${mood}'. Mood must be 'happy', 'sad', or 'natural'.`
            });
        }

        // Jika semua validasi berhasil, lanjutkan untuk memperbarui mood
        const updatedMoodData = await updateMood(req.user.uid, mood);

        return res.status(200).json({
            status: 'success',
            message: `Mood is successfully updated to '${mood}'`,
            updatedMoodData: updatedMoodData
        });
    } catch (error) {
        console.error(`Error updating mood data:`, error);
        return res.status(500).json({
            status: 'fail',
            message: `Error updating mood data`
        });
    }
});

// Endpoint untuk mendapatkan mood hari ini
router.get('/today', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        console.log(`Today's date: ${today}`);
        const userMoodCollection = db.collection('users').doc(req.user.uid).collection('moods');
        const snapshot = await userMoodCollection
            .where('createdAt', '>=', `${today}T00:00:00.000Z`)
            .where('createdAt', '<=', `${today}T23:59:59.999Z`)
            .limit(1)
            .get();

        if (snapshot.empty) {
            console.log('No mood entry found for today');
            return res.status(404).json({
                status: 'fail',
                message: 'No mood entry found for today'
            });
        }

        const moodData = snapshot.docs[0].data();
        console.log('Mood data retrieved:', moodData);
        return res.status(200).json({
            status: 'success',
            message: 'Mood for today retrieved successfully',
            moodData
        });
    } catch (error) {
        console.error('Error getting mood for today:', error);
        return res.status(500).json({
            status: 'fail',
            message: "Error getting today's mood"
        });
    }
});

module.exports = router;
