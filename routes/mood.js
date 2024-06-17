const express = require('express');
const router = express.Router();
const { db, storeData } = require('../services/storeData');
const updateMood = require('../services/updateMood');
const verifyToken = require('../services/authMiddleware');
const checkMoodForDate = require('../services/checkMoodForDate');
const getMoodByDate = require('../services/getMoodByDate');
const getMoodHistory = require('../services/getMoodHistory');

router.use(express.json());
router.use(verifyToken);

const addMood = async (req, res, mood, date) => {
    try {
        const hasMoodForDate = await checkMoodForDate(req.user.uid, date);

        if (hasMoodForDate) {
            return res.status(400).json({
                status: 'fail',
                message: `You have already added a mood for ${date}. You can only add one mood per day.`
            });
        }

        const createdAt = new Date(`${date}T00:00:00.000Z`).toISOString();
        const moodData = {
            mood,
            createdAt,
            userId: req.user.uid,
        };

        await storeData(req.user.uid, moodData);

        return res.status(201).json({
            status: 'success',
            message: `Mood '${mood}' for ${date} is successfully added`,
            moodData
        });
    } catch (error) {
        console.error(`Error adding mood '${mood}' for ${date}:`, error);
        return res.status(500).json({
            status: 'fail',
            message: `Error adding mood '${mood}' for ${date}`
        });
    }
};

router.post('/create/:date/:mood', async (req, res) => {
    const { date, mood } = req.params;

    if (!['happy', 'sad', 'natural'].includes(mood.toLowerCase())) {
        return res.status(400).json({
            status: 'fail',
            message: `Invalid mood '${mood}'. Mood must be 'happy', 'sad', or 'natural'.`
        });
    }

    await addMood(req, res, mood.charAt(0).toUpperCase() + mood.slice(1).toLowerCase(), date);
});

router.put('/update/:date/:mood', async (req, res) => {
    try {
        const { date, mood } = req.params;

        if (!['happy', 'sad', 'natural'].includes(mood.toLowerCase())) {
            return res.status(400).json({
                status: 'fail',
                message: `Invalid mood '${mood}'. Mood must be 'happy', 'sad', or 'natural'.`
            });
        }

        const updatedMoodData = await updateMood(req.user.uid, mood.charAt(0).toUpperCase() + mood.slice(1).toLowerCase(), date);

        return res.status(200).json({
            status: 'success',
            message: `Mood for ${date} is successfully updated to '${mood}'`,
            updatedMoodData: updatedMoodData
        });
    } catch (error) {
        console.error(`Error updating mood for ${date}:`, error);
        return res.status(500).json({
            status: 'fail',
            message: `Error updating mood for ${date}`
        });
    }
});

router.get('/today', async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const userMoodCollection = db.collection('users').doc(req.user.uid).collection('moods');
        const snapshot = await userMoodCollection
            .where('createdAt', '>=', `${today}T00:00:00.000Z`)
            .where('createdAt', '<=', `${today}T23:59:59.999Z`)
            .limit(1)
            .get();

        if (snapshot.empty) {
            return res.status(404).json({
                status: 'fail',
                message: 'No mood entry found for today'
            });
        }

        const moodData = snapshot.docs[0].data();
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

router.get('/all', async (req, res) => {
    try {
        const moodHistory = await getMoodHistory(req.user.uid);
        return res.status(200).json({
            status: 'success',
            message: 'Mood history retrieved successfully',
            moodHistory
        });
    } catch (error) {
        console.error('Error getting mood history:', error);
        return res.status(500).json({
            status: 'fail',
            message: 'Error getting mood history'
        });
    }
});

module.exports = router;