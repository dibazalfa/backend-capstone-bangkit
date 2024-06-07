require('dotenv').config(); // Tambahkan ini di baris pertama

const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const moodRoutes = require('./routes/mood');
const { loadResources, router: chatRoutes } = require('./routes/chatbot'); // Mengimpor router dari chatbot.js

// Inisialisasi Firebase Admin SDK jika belum diinisialisasi
const serviceAccount = require('./firebase-adminsdk.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: serviceAccount.project_id,
    });
}

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/mood', moodRoutes);
app.use('/chat', chatRoutes); // Menggunakan router dari chatbot.js

const PORT = process.env.PORT || 5000;

loadResources().then(() => {
    app.listen(PORT, () => {
        console.log(`Server berjalan pada http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("Error loading resources:", err);
});
