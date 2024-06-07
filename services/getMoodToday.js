const admin = require('firebase-admin');
const serviceAccount = require('../firebase-adminsdk.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id,
    });
}

const db = admin.firestore();

const getMoodToday = async (userId) => {
    try {
        const userMoodCollection = db.collection('users').doc(userId).collection('moods');
        const today = new Date().toISOString().split('T')[0];
        const snapshot = await userMoodCollection
            .where('createdAt', '>=', `${today}T00:00:00.000Z`)
            .where('createdAt', '<=', `${today}T23:59:59.999Z`)
            .get();

        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            return { id: doc.id, ...doc.data() };
        } else {
            return null;
        }
    } catch (error) {
        console.error("Error getting today's mood:", error);
        throw new Error("Error getting today's mood");
    }
};

module.exports = getMoodToday;