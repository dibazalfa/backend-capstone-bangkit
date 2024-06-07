const admin = require('firebase-admin');

const verifyToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    console.log('Authorization Header:', authHeader); // Log header Authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token:', token); // Log token

    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        console.log('Decoded Token:', decodedToken); // Log decoded token
        req.user = decodedToken;
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ message: 'Unauthorized', error: error.message });
    }
};

module.exports = verifyToken;
