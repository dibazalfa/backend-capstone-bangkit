const express = require('express');
const router = express.Router();
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require('firebase/auth');
const bodyParser = require('body-parser');

// Konfigurasi Firebase Client SDK
const firebaseConfig = {
    apiKey: "AIzaSyCo0VwyZyR2g-Z6qpibTopCe9qtKj2u4-8",
    authDomain: "auth-capstone-424817.firebaseapp.com",
    databaseURL: "https://auth-capstone-424817-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "auth-capstone-424817",
    storageBucket: "auth-capstone-424817.appspot.com",
    messagingSenderId: "685262484390",
    appId: "1:685262484390:web:84295566e1e7da98509567"
  };

// Inisialisasi Firebase Client SDK
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// API untuk registrasi
router.post('/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        res.status(201).json({ message: 'User registered successfully', user: userCredential.user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// API untuk login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();
        res.status(200).json({ message: 'User logged in successfully', token: idToken, user: userCredential.user });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// API untuk logout
router.post('/logout', async (req, res) => {
    try {
        await signOut(auth);
        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
