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
    const moodCollection = db.collection('moods');
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set ke awal hari

    // Query untuk mood yang ditambahkan hari ini
    const snapshot = await moodCollection
        .where('createdAt', '>=', today.toISOString())
        .where('userId', '==', userId)
        .get();

    if (!snapshot.empty) {
        throw new Error('Mood for today already exists');
    }

    await moodCollection.add(moodData); // Menambahkan moodData ke koleksi moods
}

module.exports = storeData;
