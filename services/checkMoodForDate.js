const admin = require('firebase-admin');
const serviceAccount = require('../firebase-adminsdk.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}
const db = admin.firestore();

const checkMoodForDate = async (userId, date) => {
    try {
        const userMoodCollection = db.collection('users').doc(userId).collection('moods');
        const snapshot = await userMoodCollection
            .where('createdAt', '>=', `${date}T00:00:00.000Z`)
            .where('createdAt', '<=', `${date}T23:59:59.999Z`)
            .get();
        console.log("Snapshot size:", snapshot.size);
        return !snapshot.empty;
    } catch (error) {
        console.error(`Error checking mood for ${date}:`, error);
        throw new Error(`Error checking mood for ${date}`);
    }
};

module.exports = checkMoodForDate;