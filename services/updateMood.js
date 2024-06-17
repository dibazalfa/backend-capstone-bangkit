const admin = require('firebase-admin');
const serviceAccount = require('../firebase-adminsdk.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id,
    });
}

const db = admin.firestore();

const updateMood = async (userId, mood, date) => {
    try {
        const userMoodCollection = db.collection('users').doc(userId).collection('moods');
        const snapshot = await userMoodCollection
            .where('createdAt', '>=', `${date}T00:00:00.000Z`)
            .where('createdAt', '<=', `${date}T23:59:59.999Z`)
            .limit(1)
            .get();

        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            await doc.ref.update({ mood, updatedAt: new Date().toISOString() });
            return { id: doc.id, ...doc.data(), mood }; // Mengembalikan data dokumen yang diperbarui
        } else {
            throw new Error(`No mood entry found to update for date ${date}`);
        }
    } catch (error) {
        console.error('Error in updateMood function:', error);
        throw error; // Lempar kesalahan agar bisa ditangkap oleh pemanggil
    }
};

module.exports = updateMood;