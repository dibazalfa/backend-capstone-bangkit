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
    // Tambahkan logika untuk menentukan bagaimana menyimpan mood tanpa userId
    const moodCollection = db.collection('moods'); // Koleksi baru untuk moods
    await moodCollection.add(moodData); // Menambahkan moodData ke koleksi moods
}

module.exports = storeData;
