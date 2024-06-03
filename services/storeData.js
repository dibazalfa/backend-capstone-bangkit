const admin = require('firebase-admin');
const serviceAccount = require('../firebase-adminsdk.json');

// Inisialisasi Firebase Admin SDK jika belum diinisialisasi
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id,
    });
}

// Inisialisasi Firestore menggunakan admin.firestore()
const db = admin.firestore();

async function storeData(userId, moodData) {
    const userMoodCollection = db.collection('users').doc(userId).collection('moods');
    await userMoodCollection.add(moodData);
}

async function storeData(userId, chatData) {
    const userChatCollection = db.collection('users').doc(userId).collection('chats');
    await userChatCollection.add(chatData);
}

module.exports = storeData;
