const express = require('express');
const router = express.Router();
const verifyToken = require('../services/authMiddleware');
const chatService = require('../services/chatService');

// Endpoint untuk memproses pesan chatbot
router.post('/message', verifyToken, async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.uid;
        const response = await chatService.processMessage(userId, message); // Menunggu hingga proses selesai
        res.json(response); // Mengirim respons kembali ke klien
    } catch (error) {
        console.error('Error processing message:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Endpoint untuk mengambil history chat
router.get('/history', verifyToken, async (req, res) => {
    try {
        const userId = req.user.uid;
        const chatHistory = await chatService.getChatHistory(userId);
        res.json(chatHistory);
    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
