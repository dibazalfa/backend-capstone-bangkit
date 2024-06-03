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

// Fungsi untuk memperbarui mood
async function updateMood(userId, mood) {
    try {
        const userMoodCollection = db.collection('users').doc(userId).collection('moods');
        const snapshot = await userMoodCollection.orderBy('createdAt', 'desc').limit(1).get();

        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            await doc.ref.update({ mood, updatedAt: new Date().toISOString() });
            return { ...doc.data(), mood }; // Mengembalikan data dokumen yang diperbarui
        } else {
            throw new Error('No mood entry found to update');
        }
    } catch (error) {
        console.error('Error in updateMood function:', error);
        throw error; // Lempar kesalahan agar bisa ditangkap oleh pemanggil
    }
}

module.exports = updateMood;