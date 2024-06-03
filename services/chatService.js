const admin = require('firebase-admin');
const storeData = require('./storeData');
const fetch = require('node-fetch'); // Pastikan ini diinstal dengan versi 2.x

let model;
const modelUrl = process.env.MODEL_URL; // URL model dari variabel lingkungan

// Memuat model saat aplikasi mulai
(async () => {
    try {
        const response = await fetch(modelUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        model = await response.json();
        console.log('Model loaded successfully from', modelUrl);
    } catch (error) {
        console.error('Error loading model:', error);
    }
})();

// Fungsi untuk memproses pesan
async function processMessage(userId, message) {
    // Normalisasi pesan untuk pencocokan pola
    const normalizedMessage = message.trim().toLowerCase();

    // Mencari intent yang sesuai
    let response = "I'm sorry, I don't understand what you mean.";

    for (const intent of model.intents) {
        for (const pattern of intent.patterns) {
            if (normalizedMessage.includes(pattern.toLowerCase())) {
                // Pilih respons acak dari intent yang sesuai
                const randomIndex = Math.floor(Math.random() * intent.responses.length);
                response = intent.responses[randomIndex];
                break;
            }
        }
        if (response !== "I'm sorry, I don't understand what you mean.") {
            break;
        }
    }

    // Simpan history chat
    const chatData = {
        message,
        response,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };
    await storeData(userId, chatData);

    return { message, response };
}

// Fungsi untuk mengambil history chat
async function getChatHistory(userId) {
    const db = admin.firestore();
    const chatHistorySnapshot = await db.collection('users').doc(userId).collection('chats').orderBy('timestamp').get();
    const chatHistory = chatHistorySnapshot.docs.map(doc => doc.data());
    return chatHistory;
}

module.exports = {
    processMessage,
    getChatHistory,
};
