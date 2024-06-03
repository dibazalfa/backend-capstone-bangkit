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

async function updateMoodData(id, moodData) {
    const moodDocRef = db.collection('moods').doc(id);
    await moodDocRef.update(moodData);
}

module.exports = updateMoodData;
