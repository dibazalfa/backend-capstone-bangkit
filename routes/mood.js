const express = require('express');
const router = express.Router();
const { getFirestore, doc, setDoc, updateDoc, getDoc } = require('firebase/firestore');
const admin = require('firebase-admin');

const db = getFirestore();

// Endpoint untuk menambah mood baru
router.post('/moods', async (req, res) => {
    const { userId, mood } = req.body;

    try {
        const userDoc = db.collection('users').doc(userId);
        const moodData = { mood: mood, timestamp: new Date() };
        await userDoc.update({ moods: admin.firestore.FieldValue.arrayUnion(moodData) });
        res.status(201).json({ message: 'Mood added successfully' });
    } catch (error) {
        console.error('Error adding mood:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Endpoint untuk mengedit mood sebelumnya
router.put('/:userId/:moodId', async (req, res) => {
    const { userId, moodId } = req.params;
    const { newMood } = req.body;

    try {
        const userDoc = doc(db, 'users', userId);
        const userSnap = await getDoc(userDoc);
        if (!userSnap.exists()) {
            return res.status(404).json({ error: 'User not found' });
        }
        const userMoods = userSnap.data().moods;
        if (!userMoods || userMoods.length === 0) {
            return res.status(404).json({ error: 'No mood data found for the user' });
        }
        const moodIndex = userMoods.findIndex(mood => mood.timestamp === moodId);
        if (moodIndex === -1) {
            return res.status(404).json({ error: 'Mood not found' });
        }
        userMoods[moodIndex].mood = newMood;
        await setDoc(userDoc, { moods: userMoods });
        res.status(200).json({ message: 'Mood updated successfully' });
    } catch (error) {
        console.error('Error updating mood:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
