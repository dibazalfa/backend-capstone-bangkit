const express = require('express');
const router = express.Router();
const admin = require('firebase-admin');

router.use(express.json());

router.get('/all', async (req, res) => {
    try {
        const listUsersResult = await admin.auth().listUsers();
        res.status(200).json({ users: listUsersResult.users });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const userRecord = await admin.auth().getUser(id);
        res.status(200).json({ user: userRecord });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
