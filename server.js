const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const authRoutes = require('./routes/auth');

// Inisialisasi Firebase Admin SDK
const serviceAccount = require('./firebase-adminsdk.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // projectId: 'capstone-bangkit-424811'
});

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server berjalan pada http://localhost:${PORT}`);
});
