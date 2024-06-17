const admin = require('firebase-admin');
const serviceAccount = require('../firebase-adminsdk.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id,
    });
}

const db = admin.firestore();

const getMoodByDate = async (userId, date) => {
    try {
        const userMoodCollection = db.collection('users').doc(userId).collection('moods');
        const snapshot = await userMoodCollection
            .where('createdAt', '>=', `${date}T00:00:00.000Z`)
            .where('createdAt', '<=', `${date}T23:59:59.999Z`)
            .get();

        if (!snapshot.empty) {
            const doc = snapshot.docs[0];
            return { id: doc.id, ...doc.data() };
        } else {
            return null;
        }
    } catch (error) {
        console.error(`Error getting mood for date ${date}:`, error);
        throw new Error(`Error getting mood for date ${date}`);
    }
};

module.exports = getMoodByDate;