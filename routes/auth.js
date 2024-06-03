const express = require('express');
const router = express.Router();
const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require('firebase/auth');
const bodyParser = require('body-parser');

// Konfigurasi Firebase Client SDK
const firebaseConfig = {
    apiKey: "AIzaSyAN8uQYCaRbQ8Jxm8Ldx6VCINc1DWYB7Qk",
    authDomain: "capstone-bangkit-424811.firebaseapp.com",
    databaseURL: "https://capstone-bangkit-424811-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "capstone-bangkit-424811",
    storageBucket: "capstone-bangkit-424811.appspot.com",
    messagingSenderId: "486224351037",
    appId: "1:486224351037:web:c6dd27063da04fddf3ff54"
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
        res.status(200).json({ message: 'User logged in successfully', user: userCredential.user });
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
