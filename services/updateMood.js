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
        // const hasMoodToday = await checkMoodToday(userId);

        // if (hasMoodToday) {
        //     return {
        //         error: 'You have already added a mood today. You can only add one mood per day.'
        //     };
        // }
        const userMoodCollection = db.collection('users').doc(userId).collection('moods');
        const today = new Date().toISOString().split('T')[0];
        const snapshot = await userMoodCollection
            .where('createdAt', '>=', `${today}T00:00:00.000Z`)
            .where('createdAt', '<=', `${today}T23:59:59.999Z`)
            .limit(1)
            .get();

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
