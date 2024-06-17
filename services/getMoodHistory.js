const admin = require('firebase-admin');
const serviceAccount = require('../firebase-adminsdk.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id,
    });
}

const db = admin.firestore();

const getMoodHistory = async (userId) => {
    try {
        const userMoodCollection = db.collection('users').doc(userId).collection('moods');
        const snapshot = await userMoodCollection.orderBy('createdAt', 'asc').get();

        if (snapshot.empty) {
            return [];
        }

        const moodHistory = [];
        snapshot.forEach(doc => {
            moodHistory.push({ id: doc.id, ...doc.data() });
        });

        return moodHistory;
    } catch (error) {
        console.error("Error getting mood history:", error);
        throw new Error("Error getting mood history");
    }
};

module.exports = getMoodHistory;