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

// Fungsi untuk menyimpan data mood baru
async function storeData(userId, moodData) {
    const userMoodCollection = db.collection('users').doc(userId).collection('moods');
    await userMoodCollection.add(moodData);
}

module.exports = storeData;
