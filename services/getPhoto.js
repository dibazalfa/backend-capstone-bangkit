const admin = require('firebase-admin');
const serviceAccount = require('../firebase-adminsdk.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id,
    });
}

const db = admin.firestore();

const getPhoto = async (userId) => {
    try {
        const photos = [];

        // Ambil koleksi photos untuk pengguna tertentu berdasarkan userId
        const userPhotoCollection = db.collection('users').doc(userId).collection('photos');
        const snapshot = await userPhotoCollection.get();

        // Tambahkan semua entri photo ke photos
        snapshot.forEach(doc => {
            photos.push({ id: doc.id, ...doc.data() });
        });

        console.log("Photos retrieved:", photos);
        return photos;
    } catch (error) {
        console.error("Error getting photos:", error);
        throw new Error("Error getting photos");
    }
};

module.exports = getPhoto;
