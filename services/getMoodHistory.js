const admin = require('firebase-admin');
const serviceAccount = require('../firebase-adminsdk.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id,
    });
}

const db = admin.firestore();

const getMoodHistory = async () => {
    try {
        const moodHistory = [];

        // Ambil semua dokumen moods dari semua pengguna
        const allUsers = await db.collection('users').get();
        
        // Untuk setiap pengguna, ambil koleksi moods
        await Promise.all(allUsers.docs.map(async userDoc => {
            const userId = userDoc.id;
            const userMoodCollection = db.collection('users').doc(userId).collection('moods');
            const snapshot = await userMoodCollection.orderBy('createdAt', 'asc').get();
            
            // Tambahkan semua entri mood ke moodHistory
            snapshot.forEach(doc => {
                moodHistory.push({ id: doc.id, ...doc.data() });
            });
        }));

        console.log("Mood history retrieved:", moodHistory);
        return moodHistory;
    } catch (error) {
        console.error("Error getting mood history:", error);
        throw new Error("Error getting mood history");
    }
};

module.exports = getMoodHistory;