const admin = require('firebase-admin');
const serviceAccount = require('../firebase-adminsdk.json'); // Pastikan jalur ini benar

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}
const db = admin.firestore();

const checkMoodToday = async (userId) => {
    try {
        const userMoodCollection = db.collection('users').doc(userId).collection('moods');
        const today = new Date().toISOString().split('T')[0];
        const snapshot = await userMoodCollection
            .where('createdAt', '>=', `${today}T00:00:00.000Z`)
            .where('createdAt', '<=', `${today}T23:59:59.999Z`)
            .get();
        console.log("Snapshot size:", snapshot.size);
        return !snapshot.empty;
    } catch (error) {
        console.error("Error checking mood for today:", error);
        throw new Error("Error checking mood for today");
    }
};

module.exports = checkMoodToday;